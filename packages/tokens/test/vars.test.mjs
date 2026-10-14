/**
 * @kalads/tokens/vars (run `pnpm build` first): every semantic token, as a reference to a CSS variable
 * that variables.css defines, and nothing but semantic tokens.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { vars } from '../dist/vars/vars.js';

const css = readFileSync(new URL('../dist/css/variables.css', import.meta.url), 'utf8');

const leaves = (node) => Object.values(node).flatMap((v) => (typeof v === 'string' ? [v] : leaves(v)));
/** Every semantic variable declared in :root (the theme blocks only re-declare them). */
const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
const declared = new Set([...root.matchAll(/(--kds-semantic-[\w-]+):/g)].map((m) => m[1]));

test('every vars value is a semantic variable that variables.css defines', () => {
  const values = leaves(vars);
  for (const value of values) {
    const name = value.match(/^var\((--kds-semantic-[\w-]+)\)$/)?.[1];
    assert.ok(name, `not a semantic variable reference: ${value}`);
    assert.ok(css.includes(`${name}:`), `${name} is not defined in variables.css`);
  }
  assert.deepEqual(new Set(values.map((v) => v.slice(4, -1))), declared, 'vars and the semantic variables differ');
});
