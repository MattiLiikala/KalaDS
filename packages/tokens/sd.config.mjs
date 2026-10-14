import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import StyleDictionary from 'style-dictionary';
import { formattedVariables } from 'style-dictionary/utils';
import { checkSources } from './scripts/check-sources.mjs';

const isWatch = process.argv.includes('--watch');

/** React Native has no rem: 1rem is the browser default font size. */
const REM_PX = 16;

/**
 * Dimensions as plain numbers for React Native: px and rem become density-independent pixels.
 * `em` values (letter spacing) stay multipliers of the font size, since React Native needs absolute
 * values: the text style helpers in @kalads/react-native-components multiply them out.
 */
function nativeDimension(value) {
  if (typeof value === 'number') return value;
  const match = /^(-?[\d.]+)(px|rem|em)$/.exec(String(value));
  if (!match) throw new Error(`[tokens] native: can't convert dimension "${value}"`);
  const n = Number(match[1]);
  return match[2] === 'rem' ? n * REM_PX : n;
}

/** A DTCG shadow (one layer or an array) as React Native `boxShadow` objects (New Architecture, RN 0.76+). */
function nativeShadow(value) {
  // Transitive transforms can see a value twice (a component shadow referencing a converted semantic one).
  return [value].flat().map((layer) => 'blurRadius' in layer ? layer : ({
    offsetX: nativeDimension(layer.offsetX),
    offsetY: nativeDimension(layer.offsetY),
    blurRadius: nativeDimension(layer.blur),
    spreadDistance: nativeDimension(layer.spread),
    color: layer.color,
    ...(layer.inset ? { inset: true } : {}),
  }));
}

StyleDictionary.registerTransform({
  name: 'kds/native/value',
  type: 'value',
  transitive: true,
  transform: (token) => {
    const value = token.$value ?? token.value;
    switch (token.$type ?? token.type) {
      case 'dimension':
        return nativeDimension(value);
      case 'shadow':
        return nativeShadow(value);
      // "'Overlock', serif" → "Overlock". Fallback stacks don't exist in React Native; useKalaFonts()
      // registers each weight of the family under this name.
      case 'fontFamily':
        return String(value).split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      default:
        return value;
    }
  },
});

const camel = (key) => key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

/** Nested object of all tokens with camelCase keys: tokens.component.button.primary.bgHover. */
function nativeTree(dictionary) {
  const tree = {};
  for (const token of dictionary.allTokens) {
    const keys = token.path.map(camel);
    let node = tree;
    for (const key of keys.slice(0, -1)) node = node[key] ??= {};
    node[keys.at(-1)] = token.$value ?? token.value;
  }
  return tree;
}

/** TypeScript type of a token value: literal for strings, so variants stay precise. */
function typeOf(value, indent) {
  if (Array.isArray(value)) return `ReadonlyArray<NativeShadow>`;
  if (value && typeof value === 'object') {
    const pad = '  '.repeat(indent + 1);
    const key = (k) => (/^[a-z_$][\w$]*$/i.test(k) ? k : JSON.stringify(k));
    const body = Object.entries(value).map(([k, v]) => `${pad}readonly ${key(k)}: ${typeOf(v, indent + 1)};`).join('\n');
    return `{\n${body}\n${'  '.repeat(indent)}}`;
  }
  return typeof value === 'number' ? 'number' : 'string';
}

const HEADER = '/**\n * Do not edit directly, this file was auto-generated.\n */\n\n';

StyleDictionary.registerFormat({
  name: 'kds/native/js',
  format: ({ dictionary }) =>
    `${HEADER}import { darkTokens } from './dark.js';\n\nexport const tokens = ${JSON.stringify(nativeTree(dictionary), null, 2)};\n\n/** Every token per theme. The light theme is \`tokens\`; only colours and shadows differ. */\nexport const themes = { light: tokens, dark: darkTokens };\n\nexport default tokens;\n`,
});

StyleDictionary.registerFormat({
  name: 'kds/native/dts',
  format: ({ dictionary }) =>
    `${HEADER}/** One layer of a React Native \`boxShadow\`. */
export interface NativeShadow {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly blurRadius: number;
  readonly spreadDistance: number;
  readonly color: string;
  readonly inset?: boolean;
}

export type Tokens = ${typeOf(nativeTree(dictionary), 0)};

export declare const tokens: Tokens;

/** Every token per theme. The light theme is \`tokens\`; only colours and shadows differ. */
export declare const themes: { readonly light: Tokens; readonly dark: Tokens };

export default tokens;
`,
});

StyleDictionary.registerFormat({
  name: 'kds/native/dark-js',
  format: ({ dictionary }) => `${HEADER}export const darkTokens = ${JSON.stringify(nativeTree(dictionary), null, 2)};\n`,
});

/**
 * The semantic tokens as CSS variable references, for React style objects:
 * `vars.spacing.md` is `'var(--kds-semantic-spacing-md)'`. Keys are camelCase, as in the React Native
 * tree (`s.spacing.md`). The values are references, so they follow `data-kds-theme`. Only semantic tokens:
 * core and component tokens aren't for app code.
 */
function varsTree(dictionary) {
  const tree = {};
  for (const token of dictionary.allTokens) {
    if (token.path[0] !== 'semantic') continue;
    const keys = token.path.slice(1).map(camel);
    let node = tree;
    for (const key of keys.slice(0, -1)) node = node[key] ??= {};
    node[keys.at(-1)] = `var(--${token.name})`;
  }
  return tree;
}

/** The type of varsTree: every value is its literal `var(--…)` string. */
function varsType(value, indent) {
  if (typeof value === 'string') return `'${value}'`;
  const pad = '  '.repeat(indent + 1);
  const key = (k) => (/^[a-z_$][\w$]*$/i.test(k) ? k : JSON.stringify(k));
  const body = Object.entries(value).map(([k, v]) => `${pad}readonly ${key(k)}: ${varsType(v, indent + 1)};`).join('\n');
  return `{\n${body}\n${'  '.repeat(indent)}}`;
}

StyleDictionary.registerFormat({
  name: 'kds/vars/js',
  format: ({ dictionary }) => `${HEADER}export const vars = ${JSON.stringify(varsTree(dictionary), null, 2)};\n\nexport default vars;\n`,
});

StyleDictionary.registerFormat({
  name: 'kds/vars/dts',
  format: ({ dictionary }) =>
    `${HEADER}/** The semantic tokens as CSS variable references (\`vars.spacing.md\` → \`var(--kds-semantic-spacing-md)\`). Needs @kalads/tokens/css. */\nexport type Vars = ${varsType(varsTree(dictionary), 0)};\n\nexport declare const vars: Vars;\n\nexport default vars;\n`,
});

/** Names of the tokens whose value differs between the themes, filled in before the builds run. */
const themed = new Set();

/**
 * One theme's variables for the `data-kds-theme` scopes: `[data-kds-theme="dark"]` and, inside the
 * prefers-color-scheme media query, `[data-kds-theme="auto"]`. Only the tokens whose value differs between
 * the themes are written, references kept, so component tokens resolve again inside a themed subtree.
 */
StyleDictionary.registerFormat({
  name: 'kds/css/theme',
  format: ({ dictionary, options }) => {
    // Filtered here rather than with a file filter: the references stay resolvable (no "filtered out
    // references" warning), since the variables they point to are declared in :root.
    const changed = { ...dictionary, allTokens: dictionary.allTokens.filter((t) => themed.has(t.name)) };
    const body = `  color-scheme: ${options.theme};\n${formattedVariables({ format: 'css', dictionary: changed, outputReferences: true, usesDtcg: true })}`;
    return `[data-kds-theme="${options.theme}"] {\n${body}\n}\n\n@media (prefers-color-scheme: ${options.theme}) {\n  [data-kds-theme="auto"] {\n${body.replace(/^/gm, '  ')}\n  }\n}\n`;
  },
});

/** Core, then semantic, then component. The dark theme swaps in src/semantic/dark/ for the semantic colours. */
const SOURCES = ['src/core/**/*.json', 'src/semantic/*.json', 'src/component/**/*.json'];
const DARK = ['src/semantic/dark/*.json'];


const light = new StyleDictionary({
  source: SOURCES,
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'kds',
      buildPath: 'dist/css/',
      files: [
        { destination: 'variables.css', format: 'css/variables', options: { outputReferences: true, selector: ':root' } },
        { destination: 'theme-light.css', format: 'kds/css/theme', options: { theme: 'light' } },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    // React (web): the semantic tokens as var(--…) references in a typed object.
    vars: {
      transformGroup: 'css',
      prefix: 'kds',
      buildPath: 'dist/vars/',
      files: [
        { destination: 'vars.js', format: 'kds/vars/js' },
        { destination: 'vars.d.ts', format: 'kds/vars/dts' },
      ],
    },
    // React Native: resolved values, dimensions as numbers, shadows as boxShadow objects.
    native: {
      transforms: ['name/camel', 'kds/native/value'],
      buildPath: 'dist/native/',
      files: [
        { destination: 'tokens.js', format: 'kds/native/js' },
        { destination: 'tokens.d.ts', format: 'kds/native/dts' },
      ],
    },
    json: {
      buildPath: 'dist/json/',
      files: [{ destination: 'tokens.json', format: 'json/nested' }],
    },
  },
});

// The light sources stay included; the dark semantic colours override them (same token paths).
const dark = new StyleDictionary({
  include: SOURCES,
  source: DARK,
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'kds',
      buildPath: 'dist/css/',
      files: [{ destination: 'theme-dark.css', format: 'kds/css/theme', options: { theme: 'dark' } }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        { destination: 'dark.js', format: 'javascript/es6' },
        { destination: 'dark.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    native: {
      transforms: ['name/camel', 'kds/native/value'],
      buildPath: 'dist/native/',
      files: [{ destination: 'dark.js', format: 'kds/native/dark-js' }],
    },
    json: {
      buildPath: 'dist/json/',
      files: [{ destination: 'dark.json', format: 'json/nested' }],
    },
  },
});

async function build() {
  checkSources();
  themed.clear();
  const values = async (sd) => {
    const { allTokens } = await sd.getPlatformTokens('css', { cache: false });
    return new Map(allTokens.map((t) => [t.name, JSON.stringify(t.$value ?? t.value)]));
  };
  const [l, d] = await Promise.all([values(light), values(dark)]);
  for (const [name, value] of l) if (d.get(name) !== value) themed.add(name);

  await light.buildAllPlatforms();
  await dark.buildAllPlatforms();

  // One stylesheet: :root (light), then the light and dark theme scopes.
  const css = (f) => readFileSync(`dist/css/${f}`, 'utf8');
  writeFileSync('dist/css/variables.css', `${css('variables.css')}\n${css('theme-light.css')}\n${css('theme-dark.css')}`);
  rmSync('dist/css/theme-light.css');
  rmSync('dist/css/theme-dark.css');
  console.log(`[tokens] build complete (${themed.size} tokens change in dark mode)`);
}

await build();

if (isWatch) {
  const { default: chokidar } = await import('chokidar');
  chokidar.watch('src/**/*.json').on('change', async (path) => {
    console.log(`[tokens] changed: ${path}`);
    // A Style Dictionary instance reads its sources once: rebuild in a fresh process.
    const { execFileSync } = await import('node:child_process');
    try {
      execFileSync(process.execPath, ['sd.config.mjs'], { stdio: 'inherit' });
    } catch {
      // The build printed its error.
    }
  });
  console.log('[tokens] watching src/**/*.json');
}
