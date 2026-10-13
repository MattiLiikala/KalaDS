import React from 'react';
import { Controls, Description, Primary, Stories, Title, useOf } from '@storybook/blocks';

/**
 * Category overline, component title and status badge. The category comes from the story title
 * ("Components/Inputs/Button" → "Inputs"); the status from `parameters.status` ("stable" by default,
 * or "beta").
 */
export function ComponentHeader() {
  const { preparedMeta } = useOf('meta');
  const parts = preparedMeta.title.split('/');
  const category = parts.length > 2 ? parts[parts.length - 2] : undefined;
  const status: string = preparedMeta.parameters?.status ?? 'stable';
  return (
    <header className="kds-docs-header">
      {category && <span className="kds-docs-overline">{category}</span>}
      <div className="kds-docs-header-title">
        <Title />
        <kds-badge variant={status === 'stable' ? 'success' : 'warning'}>{status}</kds-badge>
      </div>
    </header>
  );
}

/**
 * The template for every component docs page: header, short description, main example, props table
 * (from the component manifest) and the other stories. Components with usage guidance have their own
 * MDX page that uses the same blocks plus a Usage section.
 */
export function ComponentDocsPage() {
  return (
    <>
      <ComponentHeader />
      <Description />
      <Primary />
      <Controls />
      <Stories title="Examples" />
    </>
  );
}
