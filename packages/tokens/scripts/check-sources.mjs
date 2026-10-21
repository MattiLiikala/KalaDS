/**
 * Checks on the token sources, run before every build. The build fails when:
 *
 * 1. The dark semantic set (src/semantic/dark/) doesn't have exactly the semantic colour tokens of the
 *    light set: a theme only changes which core colour a semantic token points to, never its name.
 * 2. A component colour token references a core colour: themes switch at the semantic layer, so a core
 *    reference would stay the same in every theme.
 * 3. A component colour token references a semantic token for a different property. Semantic colour
 *    names start with the property they're for (`bg-*`, `text-*`, `border-*`, `ring-*`): a fill uses a
 *    `bg` token, a border a `border` token, and a label on an interactive fill uses a `text-on-interactive*`
 *    token. Values that happen to match in one theme drift apart in the other.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [join(dir, f), JSON.parse(readFileSync(join(dir, f), 'utf8'))]);

/** Every token in a file: [path, token]. */
function tokens(tree, path = []) {
  return Object.entries(tree).flatMap(([key, value]) =>
    value && typeof value === 'object' && '$value' in value ? [[[...path, key], value]] : value && typeof value === 'object' ? tokens(value, [...path, key]) : [],
  );
}

/** What a component colour token is, from its name. */
function role(path) {
  const name = path.at(-1);
  if (/ring/.test(name)) return 'ring';
  if (/shadow/.test(name)) return 'shadow';
  // A notification's accent is its border and icon colour.
  if (/border/.test(name) || name === 'accent' || (path.at(-2) === 'divider' && name === 'color')) return 'border';
  if (/^(thumb|dot|check)/.test(name)) return 'mark';
  if (/(^|-)text($|-)|^color|label|^close$|separator|placeholder|^icon/.test(name)) return 'text';
  return 'fill';
}

/** Semantic tokens each role may reference: [group (the property), name] → allowed. */
const ALLOWED = {
  fill: (g) => g === 'bg',
  text: (g) => g === 'text',
  border: (g) => g === 'border',
  // Marks (a toggle's thumb, a radio's dot, a checkbox's check) sit on the control's fill: a fill colour,
  // or the label colour of that fill.
  mark: (g, n) => g === 'bg' || (g === 'text' && /^on-/.test(n)),
  ring: (g) => g === 'ring',
  shadow: (g) => g === 'shadow',
};

/** `bg-hover` → `text-hover`: the label that sits on a fill, in the same state. */
const labelFor = (name) => (name === 'bg' ? 'text' : name.startsWith('bg-') ? `text-${name.slice(3)}` : undefined);

export function checkSources(root = new URL('..', import.meta.url).pathname) {
  const errors = [];
  const at = (dir) => join(root, 'src', dir);

  // 1. Same semantic colour tokens in both themes.
  const key = (p) => p.join('.');
  const lightColours = new Set(read(at('semantic')).flatMap(([, j]) => tokens(j).filter(([, t]) => t.$type === 'color').map(([p]) => key(p))));
  const darkTokens = read(at('semantic/dark')).flatMap(([file, j]) => tokens(j).map(([p, t]) => [key(p), t, file]));
  const darkColours = new Set(darkTokens.map(([p]) => p));
  for (const [p, t, file] of darkTokens) if (t.$type !== 'color') errors.push(`${file}: ${p} is a ${t.$type} token; the dark set only has colours`);
  for (const p of lightColours) if (!darkColours.has(p)) errors.push(`src/semantic/dark: ${p} is missing (every semantic colour needs a dark value)`);
  for (const p of darkColours) if (!lightColours.has(p)) errors.push(`src/semantic/dark: ${p} doesn't exist in the light set`);

  // 2 and 3. Component colour tokens: semantic references only, with a matching meaning.
  for (const [file, json] of read(at('component'))) {
    const all = tokens(json);
    const byPath = new Map(all.map(([p, t]) => [key(p), t]));
    for (const [path, token] of all) {
      if (token.$type !== 'color') continue;
      const value = String(token.$value);
      const name = `${key(path)} → ${value}`;
      if (value === 'transparent') continue;
      const ref = value.match(/^\{([^}]+)\}$/)?.[1].split('.');
      if (!ref) {
        errors.push(`${file}: ${name}: use a semantic token, not a literal colour`);
        continue;
      }
      // Same-component references (a badge's border is its text colour) keep the referenced token's meaning.
      if (ref[0] === 'component' && ref[1] === path[1]) continue;
      if (ref[0] !== 'semantic') {
        errors.push(`${file}: ${name}: reference a semantic token; core colours don't change with the theme`);
        continue;
      }
      const [, group, ...rest] = ref;
      const r = role(path);
      if (!ALLOWED[r](group, rest.join('-'))) errors.push(`${file}: ${name}: a ${r} token can't use semantic.${group}.${rest.join('.')}`);
      // A label on an interactive fill uses a text-on-interactive* token.
      const label = labelFor(path.at(-1));
      const labelToken = label && byPath.get(key([...path.slice(0, -1), label]));
      if (group === 'bg' && rest[0].startsWith('interactive') && labelToken) {
        const labelRef = String(labelToken.$value).match(/^\{semantic\.text\.(on-interactive[^}]*)\}$/);
        if (!labelRef) errors.push(`${file}: ${key([...path.slice(0, -1), label])} → ${labelToken.$value}: the label on ${value} needs a text.on-interactive* token`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`[tokens] source checks failed:\n  ${errors.join('\n  ')}`);
  }
}
