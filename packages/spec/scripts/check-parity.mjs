/**
 * Checks that every web component has a React and a React Native component of the same name, and that
 * their props declare a callback for each event the web component fires. (Prop names and types are
 * already enforced by `extends <Name>Spec`.) Run after building: reads the packages' type declarations.
 */
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { COMPONENTS } from '../dist/generated.js';

/** Web event → callback prop. kds-input is Input's per-keystroke onChange (kds-change becomes onCommit). */
const CALLBACK = {
  'kds-change': ['onChange', 'onCommit'],
  'kds-input': ['onChange'],
  'kds-close': ['onClose'],
  'kds-open': ['onOpen'],
  'kds-select': ['onSelect'],
  'kds-toggle': ['onToggle'],
  'kds-remove': ['onRemove'],
};
/** Events that are internal to a web component (between kds-radio and kds-radio-group). */
const INTERNAL = new Set(['kds-radio-select']);

const packages = fileURLToPath(new URL('../../', import.meta.url));
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const libraries = {
  react: (name) => `${packages}react-components/dist/types/${kebab(name)}/${name}.d.ts`,
  'react-native': (name) => `${packages}react-native-components/dist/${kebab(name)}/${name}.d.ts`,
};

const problems = [];
for (const { name, events } of COMPONENTS) {
  for (const [library, file] of Object.entries(libraries)) {
    const path = file(name);
    if (!existsSync(path)) {
      problems.push(`${library}: no ${name} (${path})`);
      continue;
    }
    const types = readFileSync(path, 'utf8');
    if (!types.includes(`${name}Spec`)) problems.push(`${library}: ${name}Props doesn't extend ${name}Spec`);
    for (const event of events) {
      if (INTERNAL.has(event)) continue;
      const callbacks = CALLBACK[event];
      if (!callbacks) problems.push(`${library}: ${name} fires ${event}, which has no callback mapping in check-parity.mjs`);
      else if (!callbacks.some((cb) => new RegExp(`\\b${cb}\\??:`).test(types))) problems.push(`${library}: ${name} has no ${callbacks.join(' / ')} for ${event}`);
    }
  }
}

if (problems.length) {
  console.error(`[spec] parity check failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`[spec] parity OK: ${COMPONENTS.length} components in web, React and React Native`);
