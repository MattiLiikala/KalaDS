#!/usr/bin/env node
/**
 * KalaDS rule checker for app code. Usage: node check.mjs [files or folders…]   (default: src)
 *
 * Flags the rule breaks it can find without running the app: hardcoded colours and sizes in styles,
 * colours that don't follow dark mode (palette tokens, static React Native colour tokens), restyled components, raw elements and icons that KalaDS replaces, and buttons on inverse surfaces
 * without the inverse variant. Exits 1 when it finds any. It can't judge everything: the rules in
 * SKILL.md still apply.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const PLATFORM = '__PLATFORM__';
/** The KalaDS components (tag names on web), filled in when the skill is generated. */
const COMPONENTS = new Set(__COMPONENTS__);

const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.expo', '.next', 'coverage', 'storybook-static']);
const STYLE_EXT = new Set(['.css', '.scss', '.sass', '.less']);
const CODE_EXT = new Set(['.html', '.htm', '.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue', '.svelte', '.astro']);

/** Properties whose values must come from tokens (colour, spacing, type, radius, shadow). */
const TOKEN_PROPS_CSS =
  /^(color|background(-color)?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|fill|stroke|box-shadow|text-shadow|(padding|margin)(-(top|right|bottom|left|block|inline)(-(start|end))?)?|gap|row-gap|column-gap|font(-size|-family|-weight)?|line-height|letter-spacing|border-radius|inset|top|right|bottom|left)$/;
const TOKEN_PROPS_JS =
  /^(color|backgroundColor|borderColor|border(Top|Right|Bottom|Left|Start|End)Color|outlineColor|tintColor|shadowColor|fill|stroke|boxShadow|textShadow|(padding|margin)(Top|Right|Bottom|Left|Horizontal|Vertical|Start|End|Block|Inline)?|gap|rowGap|columnGap|fontSize|fontFamily|fontWeight|lineHeight|letterSpacing|borderRadius|border(Top|Bottom)(Left|Right|Start|End)Radius)$/;
/** Style keys that change how a component looks (not where it sits): never set them on KalaDS components. */
const APPEARANCE_JS =
  /^(color|background(Color)?|border\w*|outline\w*|tintColor|shadow\w*|boxShadow|textShadow|padding\w*|font\w*|lineHeight|letterSpacing|textTransform|textDecoration\w*|opacity)$/;
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch|lab|lch)\(/;
const LENGTH = /(?<![\w.-])(?!0(px|rem|em)?\b)\d*\.?\d+(px|rem|em|pt)\b/;

const problems = [];
const report = (file, text, index, message) => {
  const line = text.slice(0, index).split('\n').length;
  problems.push(`${relative(process.cwd(), file)}:${line}  ${message}`);
};

/** CSS: token-only properties with literal colours or lengths (var(--kds-…) fallbacks are fine). */
function checkCss(file, css, offset = 0, text = css) {
  for (const m of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)/g)) {
    const [, prop, rawValue] = m;
    if (!TOKEN_PROPS_CSS.test(prop) || prop.startsWith('--')) continue;
    const value = rawValue.replace(/var\([^)]*\)/g, '');
    if (COLOUR.test(value)) report(file, text, offset + m.index, `hardcoded colour in \`${prop}\`: use a semantic token (var(--kds-semantic-…))`);
    else if (LENGTH.test(value) && !/^(1px|0)\s+(solid|dashed|dotted)/.test(value.trim()))
      report(file, text, offset + m.index, `hardcoded size in \`${prop}\`: use a semantic token (var(--kds-semantic-…))`);
  }
}

/** JS style objects (style={{…}}, StyleSheet.create): token-only keys with literal values. */
function checkStyleObjects(file, code) {
  for (const m of code.matchAll(/\b([a-zA-Z]+)\s*:\s*(['"`][^'"`\n]*['"`]|-?\d+(\.\d+)?)(?=\s*[,}\n])/g)) {
    const [, key, value] = m;
    if (!TOKEN_PROPS_JS.test(key)) continue;
    // Only inside something that looks like a style: skip ordinary objects such as { color: 'danger' } props.
    const before = code.slice(Math.max(0, m.index - 400), m.index);
    const inStyle = /(style\s*=\s*\{\{|StyleSheet\.create\(|styles?\s*[:=]\s*\{|Style\s*=\s*\{)[^]*$/.test(before);
    if (!inStyle) continue;
    const literal = value.replace(/^['"`]|['"`]$/g, '');
    if (COLOUR.test(literal)) report(file, code, m.index, `hardcoded colour in \`${key}\`: use a token`);
    else if (/^-?\d/.test(value) && Number(value) !== 0) report(file, code, m.index, `hardcoded number in \`${key}\`: use a token`);
    else if (LENGTH.test(literal)) report(file, code, m.index, `hardcoded size in \`${key}\`: use a token`);
    else if (key === 'fontFamily') report(file, code, m.index, 'hardcoded font family: use Typography or the font tokens');
  }
}

const TAG = /<(\/?)([A-Za-z][\w.-]*)((?:\s+(?:[^\s=>/{}"']+(?:\s*=\s*(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}))?)|\s*\{\.\.\.[^}]*\})*)\s*(\/?)>/g;
const attr = (attrs, name) => new RegExp(`(?:^|\\s)${name}(?=[\\s=]|$)`).test(attrs);

/** Markup (HTML, JSX): raw elements and icons, restyled components, buttons on inverse surfaces. */
function checkMarkup(file, code) {
  const web = PLATFORM === 'web';
  const isButton = (tag) => (web ? tag === 'kds-button' || tag === 'kds-icon-button' : tag === 'Button' || tag === 'IconButton');
  const isComponent = (tag) => COMPONENTS.has(tag);
  const stack = [];
  for (const m of code.matchAll(TAG)) {
    const [, close, tag, attrs, selfClose] = m;
    if (close) {
      const i = stack.findLastIndex((e) => e.tag === tag);
      if (i >= 0) stack.length = i;
      continue;
    }
    const inverse = stack.some((e) => e.inverse);
    if (tag === 'svg' || tag === 'Svg') report(file, code, m.index, 'raw SVG: use an icon component (see references/icons.md)');
    if (PLATFORM !== 'native') {
      if (tag === 'button') report(file, code, m.index, `native <button>: use ${web ? '<kds-button>' : 'Button'}`);
      if (tag === 'select') report(file, code, m.index, `native <select>: use ${web ? '<kds-select>' : 'Select'}`);
      if (tag === 'input' && !/type\s*=\s*["'](hidden|file)["']/.test(attrs))
        report(file, code, m.index, `native <input>: use ${web ? '<kds-input>, <kds-checkbox>, <kds-radio> or <kds-toggle>' : 'Input, Checkbox, Radio or Toggle'}`);
    }
    if (isComponent(tag) && /(?:^|\s)style\s*=/.test(attrs)) {
      if (web) report(file, code, m.index, `inline style on <${tag}>: use its attributes`);
      else {
        const style = attrs.match(/style\s*=\s*\{\{([^]*?)\}\}/)?.[1] ?? '';
        const keys = [...style.matchAll(/([a-zA-Z]+)\s*:/g)].map((k) => k[1]).filter((k) => APPEARANCE_JS.test(k));
        if (keys.length) report(file, code, m.index, `<${tag}> style sets ${keys.join(', ')}: style is for layout only; use its props`);
      }
    }
    // Every variant has an inverse version, and the guideline asks for it on all buttons on inverse surfaces.
    if (isButton(tag) && inverse && !attr(attrs, web ? 'on-inverse' : 'onInverse')) {
      report(file, code, m.index, `<${tag}> inside an inverse surface without ${web ? 'on-inverse' : 'onInverse'} (see references/surfaces.md)`);
    }
    if (!selfClose) stack.push({ tag, inverse: /\bbg\s*=\s*["']inverse["']/.test(attrs) });
  }
}

/** React Native: core components that a KalaDS component replaces. */
function checkNativeImports(file, code) {
  const REPLACED = { Button: 'Button', TouchableOpacity: 'Button', TouchableHighlight: 'Button', TextInput: 'Input', Switch: 'Toggle', Text: 'Typography' };
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]react-native['"]/g)) {
    for (const name of m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0])) {
      if (REPLACED[name]) report(file, code, m.index, `\`${name}\` from react-native: use KalaDS \`${REPLACED[name]}\``);
    }
  }
  for (const m of code.matchAll(/from\s*['"]react-native-svg['"]/g)) report(file, code, m.index, 'react-native-svg: use an icon from @kalads/icons/native');
}

/** Colours that stay the same in dark mode: palette tokens in UI, React Native colours read without useTokens(). */
function checkThemed(file, code) {
  if (PLATFORM === 'native') {
    for (const m of code.matchAll(/\btokens\.(semantic\.(bg|text|border|status|interactive|shadow)|component\.[\w.]*(bg|text|color|border|shadow)\w*|color\.(?!data\d))/gi))
      report(file, code, m.index, `static colour token \`tokens.${m[1]}\`: read colours from useTokens() so they follow dark mode`);
  } else {
    for (const m of code.matchAll(/--kds-color-(?!data\d)[\w-]+/g))
      report(file, code, m.index, `palette token \`${m[0]}\` doesn't follow dark mode: use a semantic token (var(--kds-semantic-…))`);
  }
}

function checkFile(file) {
  const ext = extname(file);
  const text = readFileSync(file, 'utf8');
  if (!STYLE_EXT.has(ext) && !CODE_EXT.has(ext)) return;
  checkThemed(file, text);
  if (STYLE_EXT.has(ext)) return checkCss(file, text);
  if (['.html', '.htm', '.vue', '.svelte', '.astro'].includes(ext)) {
    for (const m of text.matchAll(/<style[^>]*>([^]*?)<\/style>/g)) checkCss(file, m[1], m.index + m[0].indexOf(m[1]), text);
  }
  if (['.js', '.jsx', '.ts', '.tsx', '.mjs'].includes(ext)) {
    checkStyleObjects(file, text);
    // CSS in template literals (Lit css``, styled-components).
    for (const m of text.matchAll(/\bcss`([^`]*)`/g)) checkCss(file, m[1], m.index + 4, text);
    if (PLATFORM === 'native') checkNativeImports(file, text);
  }
  checkMarkup(file, text);
}

function walk(path) {
  const stat = statSync(path, { throwIfNoEntry: false });
  if (!stat) return console.error(`check.mjs: no such file or folder: ${path}`);
  if (stat.isFile()) return checkFile(path);
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry) || entry.startsWith('.')) continue;
    walk(join(path, entry));
  }
}

const targets = process.argv.slice(2);
for (const target of targets.length ? targets : ['src']) walk(target);
if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} KalaDS rule ${problems.length === 1 ? 'problem' : 'problems'}.`);
  process.exit(1);
}
console.log('KalaDS check: no problems found.');
