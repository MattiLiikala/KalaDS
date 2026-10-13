import React from 'react';
import { Source } from '@storybook/blocks';

interface Props {
  /** The web snippet (src/snippets/<Name>.web.html, imported with ?raw). */
  web: string;
  /** The React snippet's source (src/snippets/<Name>.react.tsx, imported with ?raw). */
  react: string;
  /** The React Native snippet's source (src/snippets/<Name>.native.tsx, imported with ?raw). */
  native: string;
}

/**
 * The markup a React or React Native snippet returns, dedented. The files are whole components so they
 * type-check; the page shows only the usage, like the web snippet.
 */
export function markup(code: string) {
  const match = code.match(/\n([ \t]*)return \(\n([\s\S]*?)\n\1\);\n/);
  if (!match) throw new Error('FrameworkTabs: a snippet must return its markup as `return (\n…\n);`');
  const lines = match[2].split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

/**
 * The component's main example in each library, in the same short form: the markup to put in your own
 * code. Every snippet is a real file checked by `pnpm --filter @kalads/storybook typecheck` (tsc for
 * React and React Native, the web components' manifest for web), so none can drift from the API.
 * The live source of the main story, following the Props controls, stays under its "Show code".
 */
export function FrameworkTabs({ web, react, native }: Props) {
  return (
    <div className="kds-docs-frameworks">
      <kds-tabs label="Framework">
        <kds-tab value="web">Web components</kds-tab>
        <kds-tab value="react">React</kds-tab>
        <kds-tab value="native">React Native</kds-tab>
        <kds-tab-panel value="web">
          <Source code={web.trim()} language="html" dark={false} />
        </kds-tab-panel>
        <kds-tab-panel value="react">
          <Source code={markup(react)} language="tsx" dark={false} />
        </kds-tab-panel>
        <kds-tab-panel value="native">
          <Source code={markup(native)} language="tsx" dark={false} />
        </kds-tab-panel>
      </kds-tabs>
    </div>
  );
}
