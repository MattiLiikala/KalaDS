/**
 * Generates the agent skills shipped in the KalaDS component packages:
 *
 *   packages/web-components/skills/kalads-web/
 *   packages/react-components/skills/kalads-react/
 *   packages/react-native-components/skills/kalads-react-native/
 *
 * Everything except SKILL.md's rules and setup.md (templates/platforms.mjs) is generated from the
 * library's own sources: the web components' manifest, the React / React Native type declarations,
 * @kalads/spec, the tokens, the icons, and the Storybook docs (usage guidance, snippets, guidelines).
 * So a skill always describes exactly the version it ships with.
 *
 * Skills are for building apps WITH KalaDS. Only consumer guidance goes in: the docs' Usage sections and
 * the Guidelines pages, never the contributor rules in the repository's CLAUDE.md files.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as spec from '@kalads/spec';
import { imports, markup } from './lib/markup.mjs';
import { htmlToJsx, mdxToMarkdown, relink, section, translator } from './lib/mdx.mjs';
import { readProps } from './lib/props.mjs';
import { PLATFORMS, setupMd, skillMd } from './templates/platforms.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../..');
const packages = join(repo, 'packages');
const storybook = join(repo, 'apps/storybook/src');
const read = (path) => readFileSync(path, 'utf8');
const json = (path) => JSON.parse(read(path));

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------------------------------------- sources

const manifest = json(join(packages, 'web-components/custom-elements.json'));
const elements = new Map();
for (const mod of manifest.modules) for (const d of mod.declarations ?? []) if (d.tagName) elements.set(d.tagName, d);

const COMPONENTS = spec.COMPONENTS;
const tags = new Map(COMPONENTS.map((c) => [c.tag, c.name]));
const attributes = new Set([...elements.values()].flatMap((d) => (d.attributes ?? []).map((a) => a.name)));
const numberAttributes = new Set(
  [...elements.values()].flatMap((d) => (d.attributes ?? []).filter((a) => /^[\d\s|]+$|number/.test(a.type?.text ?? '')).map((a) => a.name)),
);

/** Docs pages: one per stories file, with its components (main + subcomponents) and sidebar category. */
const pages = [];
const storiesDir = join(storybook, 'stories/components');
for (const file of readdirSync(storiesDir).filter((f) => f.endsWith('.stories.ts'))) {
  const src = read(join(storiesDir, file));
  const page = file.replace('.stories.ts', '');
  const main = src.match(/component: '([a-z-]+)'/)[1];
  const subs = [...(src.match(/subcomponents: \{([^}]*)\}/)?.[1] ?? '').matchAll(/'(kds-[a-z-]+)':/g)].map((m) => m[1]);
  const category = src.match(/title: 'Components\/([^/]+)\//)[1];
  pages.push({ page, category, tags: [main, ...subs] });
}
// Components without a page of their own join the page whose name they extend (CheckboxGroup → Checkbox).
for (const { tag, name } of COMPONENTS) {
  if (pages.some((p) => p.tags.includes(tag))) continue;
  const host = pages.find((p) => name.startsWith(p.page) || p.page.startsWith(name));
  if (!host) throw new Error(`No docs page for ${name}`);
  host.tags.push(tag);
}

const mdx = (path) => mdxToMarkdown(read(path));
const usage = (page) => section(mdx(join(storiesDir, `${page}.mdx`)), 'Usage');

const tokensJson = json(join(packages, 'tokens/dist/json/tokens.json'));
const tokensDark = json(join(packages, 'tokens/dist/json/dark.json'));
const { tokens: nativeTokens, themes: nativeThemes } = await import(join(packages, 'tokens/dist/native/tokens.js'));
const icons = readdirSync(join(packages, 'icons/src/svgs'))
  .filter((f) => f.endsWith('.svg'))
  .map((f) => f.slice(0, -4))
  .sort();

/** React / React Native props, read from the built declarations. */
const names = COMPONENTS.map((c) => c.name);
const read_ = {
  react: readProps(join(packages, 'react-components/dist/types/index.d.ts'), names, [join(packages, 'react-components/dist'), join(packages, 'spec/dist')]),
  native: readProps(join(packages, 'react-native-components/dist/index.d.ts'), names, [join(packages, 'react-native-components/dist'), join(packages, 'spec/dist')]),
};
const props = { react: read_.react.props, native: read_.native.props };

/**
 * A component's description for a platform. Web: the manifest's. React / React Native: the component's own
 * JSDoc, which describes that implementation (the web text mentions shadow roots, native <option>s…).
 */
function describe(platform, tag) {
  if (platform === 'web') {
    const el = elements.get(tag);
    return [el.summary, el.description].filter(Boolean).join('\n\n');
  }
  const doc = read_[platform].docs[tags.get(tag)];
  if (!doc) throw new Error(`${PLATFORMS[platform].package}: ${tags.get(tag)} has no JSDoc description`);
  return doc;
}

/** The first sentence, for the components index. */
const firstSentence = (text) => text.replace(/\s+/g, ' ').match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

/** Component categories, layout first (the order an agent builds a screen in). */
const CATEGORIES = ['Layout', 'Inputs', 'Data Display', 'Feedback', 'Surfaces', 'Navigation'];

// --------------------------------------------------------------------------------------------- builders

const defaultOf = (name, prop) => {
  const value = spec[`${name}Defaults`]?.[prop];
  return value === undefined ? '' : `\`${JSON.stringify(value).replace(/"/g, "'")}\``;
};

function webProps(tag) {
  const el = elements.get(tag);
  const name = tags.get(tag);
  const typed = Object.fromEntries((props.react[name] ?? []).map((p) => [p.name, p.type]));
  const out = [`### \`<${tag}>\``, ''];
  const attrs = el.attributes ?? [];
  if (attrs.length) {
    out.push('| Attribute | Type | Default | Description |', '| --- | --- | --- | --- |');
    for (const a of attrs) {
      const type = typed[camel(a.name)] ?? a.type?.text ?? '';
      out.push(`| \`${a.name}\` | \`${cell(type)}\` | ${defaultOf(name, camel(a.name))} | ${cell(a.description)} |`);
    }
    out.push('');
  }
  const slots = el.slots ?? [];
  if (slots.length) {
    out.push('| Slot | Description |', '| --- | --- |');
    for (const s of slots) out.push(`| ${s.name ? `\`${s.name}\`` : '(default)'} | ${cell(s.description)} |`);
    out.push('');
  }
  const events = el.events ?? [];
  if (events.length) {
    out.push('| Event | Description |', '| --- | --- |');
    for (const e of events) out.push(`| \`${e.name}\` | ${cell(e.description)} |`);
    out.push('');
  }
  return out.join('\n');
}

function jsProps(platform, tag, t) {
  const name = tags.get(tag);
  const list = [...(props[platform][name] ?? [])];
  const el = elements.get(tag);
  const defaultSlot = (el.slots ?? []).find((s) => !s.name);
  if (defaultSlot && !list.some((p) => p.name === 'children')) list.push({ name: 'children', type: 'ReactNode', doc: defaultSlot.description });
  // Spec props first, in the web component's order; then the platform's own (slots as props, callbacks).
  const order = (el.attributes ?? []).map((a) => camel(a.name));
  list.sort((a, b) => {
    const ia = order.indexOf(a.name);
    const ib = order.indexOf(b.name);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });
  const out = [`### \`${name}\``, '', '| Prop | Type | Default | Description |', '| --- | --- | --- | --- |'];
  for (const p of list) out.push(`| \`${p.name}\` | \`${cell(p.type)}\` | ${defaultOf(name, p.name)} | ${cell(t(p.doc))} |`);
  return out.join('\n') + '\n';
}

function example(platform, page) {
  const p = PLATFORMS[platform];
  const file = join(storybook, 'snippets', `${page}.${p.snippet}`);
  if (!existsSync(file)) return '';
  const code = read(file);
  const body = platform === 'web' ? code.trim() : `${imports(code)}\n\n${markup(code)}`;
  return `\`\`\`${p.lang}\n${body}\n\`\`\``;
}

function componentPage(platform, { page, category, tags: pageTags }, t) {
  const p = PLATFORMS[platform];
  const title = platform === 'web' ? `<${pageTags[0]}>` : tags.get(pageTags[0]);
  const parts = [
    `# ${title}`,
    '',
    `${category} · \`${p.package}\`${pageTags.length > 1 ? ` · also: ${pageTags.slice(1).map((tg) => `\`${platform === 'web' ? tg : tags.get(tg)}\``).join(', ')}` : ''}`,
    '',
    t(describe(platform, pageTags[0])),
    '',
    '## Example',
    '',
    example(platform, page),
    '',
    '## Props',
    '',
    platform === 'web'
      ? 'Set attributes in markup; listen to events with `addEventListener` (the value is in `event.detail`).'
      : 'Only the props KalaDS adds are listed; standard props of the underlying element (`aria-*`, `id`, event handlers' +
        (platform === 'native' ? ', `testID`' : '') +
        ') pass through.',
    '',
    ...pageTags.map((tg) => (platform === 'web' ? webProps(tg) : jsProps(platform, tg, t))),
  ];
  const guidance = relink(usage(page), '../');
  if (guidance) parts.push('## Usage', '', fixCode(platform, t(guidance)));
  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Code fences written as web markup become JSX on React / React Native. */
function fixCode(platform, text) {
  if (platform === 'web') return text;
  return text.replace(/```html\n([^]*?)```/g, (_, code) => `\`\`\`tsx\n${htmlToJsx(code, { tags, numberAttributes })}\`\`\``);
}

function componentsIndex(platform) {
  const p = PLATFORMS[platform];
  const byCategory = new Map();
  for (const pg of pages) byCategory.set(pg.category, [...(byCategory.get(pg.category) ?? []), pg]);
  const out = [
    `# Components (${p.package})`,
    '',
    'Pick the component here, then read its reference for props, an example and usage guidance.',
    platform === 'native' ? '\nAlso exported: `Option` (the options of `Select` and `Autocomplete`) and `useKalaFonts()`.' : '',
  ];
  const t = translator(platform, { tags, attributes });
  for (const category of CATEGORIES.filter((c) => byCategory.has(c))) {
    const list = byCategory.get(category);
    out.push('', `## ${category}`, '', '| Component | Use for | Reference |', '| --- | --- | --- |');
    for (const pg of list.sort((a, b) => a.page.localeCompare(b.page))) {
      for (const tg of pg.tags) {
        const shown = platform === 'web' ? `\`<${tg}>\`` : `\`${tags.get(tg)}\``;
        out.push(`| ${shown} | ${cell(t(firstSentence(describe(platform, tg))))} | [${pg.page}.md](components/${pg.page}.md) |`);
      }
    }
  }
  return out.join('\n') + '\n';
}

function tokensPage(platform) {
  const native = platform === 'native';
  const out = [
    '# Tokens',
    '',
    native
      ? 'Use these in your own styles. Dimensions are numbers (density-independent pixels), colours are strings, shadows are `boxShadow` values. Read colours and shadows inside a component with `const { s } = useTokens()` (`s.bg.subtle`), so they follow dark mode; sizes and spacing can also come from `import { tokens } from \'@kalads/tokens/native\'` (`tokens.semantic.spacing.md`).'
      : 'Use these CSS custom properties in your own CSS, for the layout around components. They are defined by `@kalads/tokens/css`. Colours and shadows have a value per theme: the **Dark** column is what the token resolves to inside `data-kds-theme="dark"`.',
    '',
    'Use the **semantic** tokens: they say what a value is for, so they stay right when the palette changes. Core palette tokens (`color.*`) are only for data visualisation.',
    '',
    `Layout components take the token steps directly as props: \`gap="md"\`, \`padding="lg"\`, \`bg="subtle"\`, \`radius="md"\` — prefer them to writing styles.`,
  ];
  const groups = native ? nativeTokens.semantic : tokensJson.semantic;
  const darkGroups = native ? nativeThemes.dark.semantic : tokensDark.semantic;
  const flat = (obj, path = []) =>
    Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) && !('offsetX' in v) && !('offset-x' in v) ? flat(v, [...path, k]) : [[[...path, k], v]]));
  const show = (v) => (typeof v === 'object' ? JSON.stringify(v) : String(v));
  const get = (tree, path) => path.reduce((n, k) => n?.[k], tree);
  for (const [group, values] of Object.entries(groups)) {
    if (group === 'type') continue; // Text styles: use Typography's variants.
    const rows = flat(values).map(([path, value]) => [path, value, get(darkGroups, [group, ...path])]);
    const themed = rows.some(([, light, dark]) => show(light) !== show(dark));
    out.push('', `## ${group}`, '', themed ? '| Token | Light | Dark |' : '| Token | Value |', themed ? '| --- | --- | --- |' : '| --- | --- |');
    for (const [path, value, dark] of rows) {
      const key = [group, ...path].map((s) => (/^[a-z]\w*$/i.test(s) ? `.${s}` : `['${s}']`)).join('').slice(1);
      const name = native ? (themed ? `s.${key}` : `tokens.semantic.${key}`) : `var(--kds-semantic-${[group, ...path].join('-')})`;
      out.push(`| \`${name}\` | \`${cell(show(value))}\` |${themed ? ` \`${cell(show(dark))}\` |` : ''}`);
    }
  }
  out.push('', '## Text styles', '', 'Use `Typography` variants (`h1`–`h6`, `body`, `body-sm`, `label`, `caption`, `overline`) instead of setting font sizes.'.replace('`Typography`', platform === 'web' ? '`<kds-typography>`' : '`Typography`'));
  const data = Object.keys(tokensJson.color ?? {}).filter((k) => k.startsWith('data'));
  if (data.length) {
    out.push('', '## Data visualisation', '', `Palettes: ${data.map((d) => `\`${d}\``).join(', ')}, each with steps 100–900 (${native ? '`tokens.color.data1[500]`' : '`var(--kds-color-data1-500)`'}). Only for charts and data, never for interface elements.`);
  }
  return out.join('\n') + '\n';
}

function iconsPage(platform) {
  const p = PLATFORMS[platform];
  const out = ['# Icons', ''];
  if (platform === 'web') {
    out.push('Each icon is an element: `<kds-icon-<name>>`. Size and colour follow the surrounding text (`currentColor`); inside buttons, use the `start` / `end` slots.', '');
    out.push('```html\n<kds-icon-search></kds-icon-search>\n<kds-icon-warning label="Warning"></kds-icon-warning>\n```');
  } else {
    out.push(
      `Import each icon as a component: \`${p.iconImport}\`. Or use \`<Icon name="plus" />\` from \`${p.package}\` when the name is data.`,
      '',
      'Icons are decorative unless you pass `label`. Inside components (Button `start` / `end`, Chip, MenuItem) they take the component\'s colour and size.',
    );
  }
  out.push('', '| Name | Use |', '| --- | --- |');
  for (const name of icons) out.push(`| \`${name}\` | \`${p.icon(name, pascal(name))}\` |`);
  return out.join('\n') + '\n';
}

function guideline(platform, file, title) {
  const t = translator(platform, { tags, attributes });
  let md = mdx(join(storybook, 'stories/guidelines', file));
  md = md.replace(/^# .*$/m, `# ${title}`);
  return fixCode(platform, t(relink(md))) + '\n';
}

// ------------------------------------------------------------------------------------------------ write

for (const [platform, p] of Object.entries(PLATFORMS)) {
  const pkgDir = join(packages, p.dir);
  const { version } = json(join(pkgDir, 'package.json'));
  const out = join(pkgDir, 'skills', p.skill);
  rmSync(join(pkgDir, 'skills'), { recursive: true, force: true });
  mkdirSync(join(out, 'references/components'), { recursive: true });
  mkdirSync(join(out, 'scripts'), { recursive: true });
  const write = (rel, content) => writeFileSync(join(out, rel), content);
  const t = translator(platform, { tags, attributes });

  write('SKILL.md', skillMd(platform, { version, check: `node ${join('.agents/skills', p.skill, 'scripts/check.mjs')} src` }));
  write('references/setup.md', setupMd(platform, { version }));
  write('references/components.md', componentsIndex(platform));
  for (const pg of pages) write(`references/components/${pg.page}.md`, componentPage(platform, pg, t));
  write('references/tokens.md', tokensPage(platform));
  write('references/icons.md', iconsPage(platform));
  write('references/surfaces.md', guideline(platform, 'ButtonsAndSurfaces.mdx', 'Buttons and surfaces'));
  write('references/accessibility.md', guideline(platform, 'Accessibility.mdx', 'Accessibility'));
  write('references/writing.md', guideline(platform, 'Writing.mdx', 'Writing'));
  const componentNames = COMPONENTS.map((c) => (platform === 'web' ? c.tag : c.name));
  write(
    'scripts/check.mjs',
    read(join(here, 'templates/check.mjs'))
      .replace("'__PLATFORM__'", `'${platform}'`)
      .replace('__COMPONENTS__', JSON.stringify(componentNames)),
  );

  // The kalads-skills command ships in every component package (one source, copied).
  mkdirSync(join(pkgDir, 'bin'), { recursive: true });
  copyFileSync(join(here, 'src/kalads-skills.mjs'), join(pkgDir, 'bin/kalads-skills.mjs'));

  console.log(`[skills] ${p.package}: skills/${p.skill} (${pages.length} component pages, ${icons.length} icons)`);
}
