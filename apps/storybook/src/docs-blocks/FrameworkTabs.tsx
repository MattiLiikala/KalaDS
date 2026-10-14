import React from 'react';
import { Source } from '@storybook/blocks';
import { useColorTheme } from './ThemedDocsContainer';
import { markup } from '@kalads/skills-builder/markup';

interface Props {
  /** The web snippet (src/snippets/<Name>.web.html, imported with ?raw). */
  web: string;
  /** The React snippet's source (src/snippets/<Name>.react.tsx, imported with ?raw). */
  react: string;
  /** The React Native snippet's source (src/snippets/<Name>.native.tsx, imported with ?raw). */
  native: string;
}

/**
 * The component's main example in each library, in the same short form: the markup to put in your own
 * code. Every snippet is a real file checked by `pnpm --filter @kalads/storybook typecheck` (tsc for
 * React and React Native, the web components' manifest for web), so none can drift from the API.
 * The live source of the main story, following the Props controls, stays under its "Show code".
 */
export function FrameworkTabs({ web, react, native }: Props) {
  const dark = useColorTheme() === 'dark';
  return (
    <div className="kds-docs-frameworks">
      <kds-tabs label="Framework">
        <kds-tab value="web">Web components</kds-tab>
        <kds-tab value="react">React</kds-tab>
        <kds-tab value="native">React Native</kds-tab>
        <kds-tab-panel value="web">
          <Source code={web.trim()} language="html" dark={dark} />
        </kds-tab-panel>
        <kds-tab-panel value="react">
          <Source code={markup(react)} language="tsx" dark={dark} />
        </kds-tab-panel>
        <kds-tab-panel value="native">
          <Source code={markup(native)} language="tsx" dark={dark} />
        </kds-tab-panel>
      </kds-tabs>
    </div>
  );
}
