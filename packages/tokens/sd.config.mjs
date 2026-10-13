import StyleDictionary from 'style-dictionary';

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
    `${HEADER}export const tokens = ${JSON.stringify(nativeTree(dictionary), null, 2)};\n\nexport default tokens;\n`,
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
export default tokens;
`,
});

const sd = new StyleDictionary({
  source: ['src/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'kds',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
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
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('[tokens] build complete');

if (isWatch) {
  const { default: chokidar } = await import('chokidar');
  chokidar.watch('src/**/*.json').on('change', async (path) => {
    console.log(`[tokens] changed: ${path}`);
    await sd.buildAllPlatforms();
    console.log('[tokens] rebuilt');
  });
  console.log('[tokens] watching src/**/*.json');
}
