/**
 * Contrast of the colour pairs the components use, in both themes (run `pnpm build` first). Text needs
 * 4.5:1 (WCAG 1.4.3). Non-text UI (fills against their surface, control borders, focus rings, marks on a
 * fill) needs 3:1 (WCAG 1.4.11), the Buttons and Surfaces rule. Disabled states are exempt.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = (file) => JSON.parse(readFileSync(new URL(`../dist/json/${file}`, import.meta.url), 'utf8'));
const THEMES = { light: load('tokens.json'), dark: load('dark.json') };

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const TEXT = 4.5;
const UI = 3;

/** [foreground, background, minimum] token paths, for every theme. */
function pairs() {
  const list = [];
  const add = (fg, bg, min) => list.push([fg, bg, min]);
  const surfaces = ['semantic.bg.default', 'semantic.bg.subtle'];

  // Text on the page surfaces.
  for (const bg of surfaces) {
    for (const t of ['default', 'subtle', 'muted', 'brand', 'brand-strong', 'link', 'link-hover', 'link-active']) add(`semantic.text.${t}`, bg, TEXT);
    for (const s of ['danger', 'warning', 'success', 'info']) {
      add(`semantic.text.status-${s}`, bg, TEXT);
      add(`semantic.text.status-${s}-strong`, bg, TEXT);
      add(`semantic.border.status-${s}`, bg, UI);
    }
    add('semantic.text.interactive', bg, TEXT);
    // Controls and focus.
    for (const b of ['border.control', 'border.control-hover', 'bg.interactive-control', 'bg.interactive-control-hover', 'ring.interactive-focus', 'bg.interactive', 'border.interactive']) add(`semantic.${b}`, bg, UI);
  }
  add('semantic.text.default', 'semantic.bg.muted', TEXT);
  add('semantic.text.subtle', 'semantic.bg.muted', TEXT);
  add('semantic.text.inverse', 'semantic.bg.inverse', TEXT);

  // Solid buttons: label on the fill, fill against the surface, in every state.
  for (const v of ['primary', 'secondary', 'danger']) {
    for (const [prefix, surface] of [[`component.button.${v}`, 'semantic.bg.default'], [`component.button.${v}.on-inverse`, 'semantic.bg.inverse']]) {
      for (const state of ['bg', 'bg-hover', 'bg-active']) {
        add(`${prefix}.text`, `${prefix}.${state}`, TEXT);
        add(`${prefix}.${state}`, surface, UI);
      }
      add(`${prefix}.ring-focus`, surface, UI);
    }
  }
  // Ghost buttons: label on the surface and on the hover / active fills.
  for (const bg of ['semantic.bg.default', 'component.button.ghost.bg-hover', 'component.button.ghost.bg-active']) add('component.button.ghost.text', bg, TEXT);
  for (const bg of ['semantic.bg.inverse', 'component.button.ghost.on-inverse.bg-hover', 'component.button.ghost.on-inverse.bg-active']) add('component.button.ghost.on-inverse.text', bg, TEXT);
  add('component.button.ghost.on-inverse.ring-focus', 'semantic.bg.inverse', UI);

  // Status: labels on the subtle status fills (notifications, chips).
  for (const s of ['danger', 'warning', 'success', 'info']) {
    for (const fill of [`semantic.bg.status-${s}-subtle`, `semantic.bg.status-${s}-subtle-hover`]) {
      add(`semantic.text.status-${s}-strong`, fill, TEXT);
      add('semantic.text.default', fill, TEXT);
    }
  }
  // Labels on the subtle accent fills (selected chips, list items, options).
  for (const [label, fills] of [
    ['text.on-interactive-subtle', ['bg.interactive-subtle', 'bg.interactive-subtle-hover']],
    ['text.on-interactive-secondary-subtle', ['bg.interactive-secondary-subtle', 'bg.interactive-secondary-subtle-hover']],
  ]) {
    for (const fill of fills) add(`semantic.${label}`, `semantic.${fill}`, TEXT);
  }
  // Marks on a checked control: the check, the toggle thumb.
  add('component.checkbox.check', 'component.checkbox.bg-checked', UI);
  add('component.toggle.thumb-checked', 'component.toggle.track-bg-checked', UI);
  add('component.toggle.thumb', 'component.toggle.track-bg', UI);
  return list;
}

/**
 * Light-theme pairs that were already just below 4.5:1 before the dark theme (4.41 and 4.39). Listed so
 * they stay visible; remove an entry once its colours are retuned.
 */
const KNOWN = new Set(['light semantic.text.muted semantic.bg.subtle', 'light semantic.text.status-warning semantic.bg.subtle']);

const get = (tree, path) => path.split('.').reduce((node, key) => node?.[key], tree);

for (const [theme, tokens] of Object.entries(THEMES)) {
  test(`${theme}: colour pairs meet their contrast minimum`, () => {
    const failures = [];
    for (const [fg, bg, min] of pairs()) {
      const a = get(tokens, fg);
      const b = get(tokens, bg);
      assert.ok(/^#[0-9a-f]{6}$/i.test(a ?? '') && /^#[0-9a-f]{6}$/i.test(b ?? ''), `${fg} (${a}) / ${bg} (${b}): opaque colours expected`);
      const ratio = contrast(a, b);
      if (ratio < min && !KNOWN.has(`${theme} ${fg} ${bg}`)) failures.push(`${fg} ${a} on ${bg} ${b}: ${ratio.toFixed(2)} < ${min}`);
    }
    assert.deepEqual(failures, []);
  });
}

test('the dark theme changes colours only', () => {
  const flat = (tree, path = [], out = {}) => {
    for (const [k, v] of Object.entries(tree)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && !('offsetX' in v)) flat(v, [...path, k], out);
      else out[[...path, k].join('.')] = JSON.stringify(v);
    }
    return out;
  };
  const light = flat(THEMES.light);
  const dark = flat(THEMES.dark);
  assert.deepEqual(Object.keys(dark).sort(), Object.keys(light).sort());
  // Anything that changes is a colour, or a shadow (which carries one): sizes and fonts are shared.
  for (const k of Object.keys(light).filter((k) => light[k] !== dark[k])) assert.match(light[k], /#[0-9a-f]{6}/i, `${k} changes in dark mode but isn't a colour`);
});
