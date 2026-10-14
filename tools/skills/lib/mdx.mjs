/**
 * Turns the Storybook MDX docs into plain Markdown for the skills, and translates the web component names
 * in them to the platform's names (`kds-button` → `Button`, `on-inverse` → `onInverse`).
 */

/** Web event → callback prop, as in @kalads/spec's check-parity.mjs. */
export const CALLBACKS = {
  'kds-change': 'onChange',
  'kds-input': 'onChange',
  'kds-close': 'onClose',
  'kds-open': 'onOpen',
  'kds-select': 'onSelect',
  'kds-toggle': 'onToggle',
  'kds-remove': 'onRemove',
};

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());

/** Storybook page titles the docs link to → the skill's reference files. */
const PAGE_LINKS = [
  [/\*\*Guidelines\/Buttons and Surfaces\*\*/g, '[surfaces.md](surfaces.md)'],
  [/\*\*Guidelines\/Accessibility\*\*/g, '[accessibility.md](accessibility.md)'],
  [/\*\*Guidelines\/Writing\*\*/g, '[writing.md](writing.md)'],
  [/\*\*Foundations\/Colors\*\*/g, '[tokens.md](tokens.md)'],
  [/\*\*Foundations\*\*/g, '[tokens.md](tokens.md)'],
];

/**
 * Builds the translator for one platform. `tags` maps `kds-*` tag names to component names; `attributes`
 * is every web attribute name, so only real attributes are camel-cased.
 */
export function translator(platform, { tags, attributes }) {
  if (platform === 'web') return (text) => text;
  const name = (tag) => {
    if (tags.has(tag)) return tags.get(tag);
    if (tag.startsWith('kds-icon-')) return `${pascal(tag.slice('kds-icon-'.length))}Icon`;
    return undefined;
  };
  const inCode = (code) =>
    code
      .replace(/(?<![-\w])kds-[a-z-]+(?![-\w])/g, (t) => CALLBACKS[t] ?? name(t) ?? t)
      .replace(/(?<![-\w$])[a-z]+(?:-[a-z]+)+(?![-\w(])/g, (a) => (attributes.has(a) ? camel(a) : a));
  return (text) =>
    text
      // Notes that only explain the web component's API ("the web component's `start` slot").
      .replace(/\s*\(the web component's [^)]*\)/g, '')
      // React Native has no <option>: its Select and Autocomplete take Option children.
      .replace(/`<option>`( \(and `<optgroup>`\))?/g, (m) => (platform === 'native' ? '`Option`' : m))
      // Code spans: tags, events and attributes.
      .replace(/`([^`\n]+)`/g, (_, code) => `\`${inCode(code)}\``)
      // Tag, event and attribute names in prose.
      .replace(/(?<![-\w`])kds-[a-z-]+(?![-\w`])/g, (t) => CALLBACKS[t] ?? name(t) ?? t)
      .replace(/(?<![-\w`$.])[a-z]+(?:-[a-z]+)+(?![-\w`(])/g, (a) => (attributes.has(a) ? camel(a) : a));
}

/** Converts simple web component markup to JSX for React / React Native examples. */
export function htmlToJsx(html, { tags, numberAttributes }) {
  return html
    .replace(/<(\/?)(kds-[a-z-]+)/g, (_, slash, tag) => {
      const n = tags.get(tag) ?? (tag.startsWith('kds-icon-') ? `${pascal(tag.slice(9))}Icon` : tag);
      return `<${slash}${n}`;
    })
    .replace(/<([A-Z]\w*)((?:\s+[a-z-]+(?:="[^"]*")?)*)\s*>/g, (_, n, attrs) => {
      const props = attrs.replace(/\s+([a-z-]+)(?:="([^"]*)")?/g, (__, a, v) => {
        const p = camel(a);
        if (v === undefined) return ` ${p}`;
        return numberAttributes.has(a) && /^\d+$/.test(v) ? ` ${p}={${v}}` : ` ${p}="${v}"`;
      });
      return `<${n}${props}>`;
    })
    .replace(/<([A-Z]\w*Icon)([^>]*)><\/\1>/g, '<$1$2 />');
}

/** `<table>` HTML (as the docs write it) → a Markdown table. */
function table(html) {
  const cell = (c) =>
    c
      .replace(/<code>\{?'?([^<]*?)'?\}?<\/code>/g, '`$1`')
      .replace(/<a [^>]*>([^<]*)<\/a>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) =>
    [...r[1].matchAll(/<t[hd]>([\s\S]*?)<\/t[hd]>/g)].map((c) => cell(c[1])),
  );
  if (!rows.length) return '';
  const [head, ...body] = rows;
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...body.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

/** `<DoDont>` examples → "Do: …" / "Don't: …" bullets (the captions carry the guidance). */
function doDont(html) {
  return [...html.matchAll(/<(Do|Dont) caption="([^"]*)"/g)]
    .map(([, kind, caption]) => `- **${kind === 'Do' ? 'Do' : "Don't"}:** ${caption.replace(/^Don't /, '').replace(/^./, (c) => (kind === 'Do' ? c : c.toLowerCase()))}`)
    .join('\n');
}

/**
 * MDX → Markdown. Keeps headings, prose, lists and code fences; turns tables and Do/Don't blocks into
 * Markdown; drops imports, Storybook blocks and live examples.
 */
export function mdxToMarkdown(mdx) {
  const lines = mdx.split('\n');
  const out = [];
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) fence = !fence;
    if (fence || /^\s*```/.test(line)) {
      out.push(line);
      continue;
    }
    if (/^import /.test(line)) continue;
    const element = line.match(/^\s*<([A-Za-z][\w.-]*)/);
    if (!element) {
      out.push(line);
      continue;
    }
    // Consume the whole element (until its tags balance).
    let block = line;
    let depth = 0;
    for (let j = i; j < lines.length; j++) {
      if (j > i) block += `\n${lines[j]}`;
      for (const [, close, , self] of lines[j].matchAll(/<(\/?)([A-Za-z][\w.-]*)(?:"[^"]*"|[^>"])*?(\/?)>/g)) {
        if (self) continue;
        depth += close ? -1 : 1;
      }
      if (depth <= 0) {
        i = j;
        break;
      }
    }
    const tag = element[1];
    if (tag === 'table') out.push(table(block));
    else if (tag === 'DoDont') out.push(doDont(block));
    // Everything else (Meta, Canvas, Controls, live <kds-*> examples) is for the browser only.
  }
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** The body of one `## Heading` section (without the heading), or '' when there is none. */
export function section(markdown, heading) {
  const m = markdown.match(new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return m ? m[1].trim() : '';
}

/** Applies the page-link replacements (Storybook page titles → reference files). */
export function relink(text, prefix = '') {
  return PAGE_LINKS.reduce((t, [re, link]) => t.replace(re, link.replace('](', `](${prefix}`)), text);
}
