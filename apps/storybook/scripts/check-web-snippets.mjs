// Checks the docs' web snippets (src/snippets/<Name>.web.html) against the web components' manifest:
// every kds-* tag exists, its attributes are documented, and each slot="…" names a slot of the parent.
// The React and React Native snippets get the same guarantee from tsc.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, '../../packages/web-components/custom-elements.json'), 'utf8'));
const svgs = join(root, '../../packages/icons/src/svgs');

const elements = new Map();
for (const mod of manifest.modules) {
  for (const d of mod.declarations ?? []) {
    if (!d.tagName) continue;
    elements.set(d.tagName, {
      attributes: new Set((d.attributes ?? []).map((a) => a.name)),
      slots: new Set((d.slots ?? []).map((s) => s.name).filter(Boolean)),
    });
  }
}
// kds-icon-button extends kds-button, so it has the same slots.
for (const s of elements.get('kds-button')?.slots ?? []) elements.get('kds-icon-button')?.slots.add(s);
const isGlobal = (name) => ['id', 'slot', 'class', 'role'].includes(name) || /^(aria|data)-/.test(name);

const errors = [];
const snippets = join(root, 'src/snippets');
const files = readdirSync(snippets).filter((f) => f.endsWith('.web.html'));
for (const file of files) {
  const html = readFileSync(join(snippets, file), 'utf8');
  const stack = [];
  for (const [, close, tag, attrs] of html.matchAll(/<(\/?)([a-z][a-z0-9-]*)([^>]*)>/g)) {
    if (close) {
      stack.pop();
      continue;
    }
    const parent = stack.at(-1);
    const names = [...attrs.matchAll(/([a-z-]+)(?:="([^"]*)")?/g)].map(([, n, v]) => [n, v]);
    if (tag.startsWith('kds-icon-') && !elements.has(tag)) {
      if (!existsSync(join(svgs, `${tag.slice('kds-icon-'.length)}.svg`))) errors.push(`${file}: no icon <${tag}>`);
    } else if (tag.startsWith('kds-')) {
      const el = elements.get(tag);
      if (!el) errors.push(`${file}: unknown element <${tag}>`);
      else for (const [n] of names) if (!isGlobal(n) && !el.attributes.has(n)) errors.push(`${file}: <${tag}> has no attribute "${n}"`);
    }
    const slot = names.find(([n]) => n === 'slot')?.[1];
    if (slot && parent) {
      if (!elements.get(parent)?.slots.has(slot)) errors.push(`${file}: <${parent}> has no slot "${slot}"`);
    }
    stack.push(tag);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`[storybook] web snippets OK: ${files.length} files`);
