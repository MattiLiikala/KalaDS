import React from 'react';

/** Icon names from the icon sources at build time, so new icons appear here without editing the docs. */
const ICON_NAMES = Object.keys(import.meta.glob('../../../../packages/icons/src/svgs/*.svg'))
  .map((path) => path.split('/').pop()!.replace(/\.svg$/, ''))
  .sort();

const pascal = (name: string) => name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

/** Every icon, each rendered with kds-icon and labelled with its web element and its React / React Native name. */
export function IconGallery() {
  return (
    <div className="kds-docs-icons">
      {ICON_NAMES.map((name) => (
        <figure key={name} className="kds-docs-icon">
          <kds-icon name={name} size="lg"></kds-icon>
          <figcaption>
            <code>{`kds-icon-${name}`}</code>
            <code>{`${pascal(name)}Icon`}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
