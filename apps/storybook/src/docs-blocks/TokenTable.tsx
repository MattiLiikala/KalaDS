import React from 'react';
import { getTokens, paletteName } from './tokens';

export type PreviewKind =
  | 'color'
  | 'size'
  | 'radius'
  | 'shadow'
  | 'border-width'
  | 'font-size'
  | 'font-weight'
  | 'font-family'
  | 'line-height'
  | 'none';

/** The CSS property each preview sets to the token. Previews use the CSS variable, so they show the live value. */
const PREVIEW_PROPERTY: Record<Exclude<PreviewKind, 'none'>, string> = {
  color: 'backgroundColor',
  size: 'width',
  radius: 'borderRadius',
  shadow: 'boxShadow',
  'border-width': 'borderTopWidth',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'font-family': 'fontFamily',
  'line-height': 'lineHeight',
};

const TEXT_PREVIEWS: PreviewKind[] = ['font-size', 'font-weight', 'font-family', 'line-height'];

interface Props {
  /** Token group to list, e.g. "semantic.spacing" or "size". */
  path: string;
  preview?: PreviewKind;
  /** Show core size steps (rem + px) as one row each. */
  pairUnits?: boolean;
  /** Only rows whose last path segment is in this list. */
  only?: string[];
}

/**
 * A value, with the palette step it comes from when it's a palette colour ("neutral.900", "#20160e"),
 * and a swatch of that step.
 */
function Value({ value, swatch }: { value: string; swatch?: boolean }) {
  const name = paletteName(value);
  if (!name) return <>{value}</>;
  return (
    <span className="kds-docs-value">
      {swatch && <span className="kds-docs-preview kds-docs-preview--color kds-docs-preview--small" style={{ backgroundColor: `var(--kds-color-${name.replace('.', '-')})` }} />}
      <span>
        <code>{name}</code>
        <br />
        {value}
      </span>
    </span>
  );
}

/**
 * Table of every token in a group, generated from the token build (@kalads/tokens/json), so it can't
 * drift from the source. Columns: token path, CSS variable, resolved value and an optional preview.
 * Groups whose values change with the theme (semantic colours) show the path and variable in one column,
 * then the light and the dark value, each with its palette step and a swatch.
 */
export function TokenTable({ path, preview = 'none', pairUnits = false, only }: Props) {
  const rows = getTokens(path, { pairUnits }).filter((r) => !only || only.includes(r.path.split('.').pop()!));
  const themed = rows.some((r) => r.dark !== undefined);
  if (themed) {
    return (
      <table className="kds-docs-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Light</th>
            <th>Dark</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.path}>
              <td>
                <code>{row.path}</code>
                <br />
                <code>{row.cssVar}</code>
              </td>
              <td>
                <Value value={row.value} swatch={preview === 'color'} />
              </td>
              <td>
                <Value value={row.dark ?? row.value} swatch={preview === 'color'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <table className="kds-docs-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>CSS variable</th>
          <th>Value</th>
          {preview !== 'none' && <th>Preview</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.path}>
            <td>
              <code>{row.path}</code>
            </td>
            <td>
              {/* Paired size steps list the rem and the px variable, one per line. */}
              {row.cssVar.split(' / ').map((v, i) => (
                <React.Fragment key={v}>
                  {i > 0 && <br />}
                  <code>{v}</code>
                </React.Fragment>
              ))}
            </td>
            <td>{row.value}</td>
            {preview !== 'none' && (
              <td>
                {TEXT_PREVIEWS.includes(preview) ? (
                  <span className="kds-docs-preview-text" style={{ [PREVIEW_PROPERTY[preview]]: row.css }}>
                    {preview === 'line-height' ? 'Two lines of text\nshow the line height' : 'Design systems'}
                  </span>
                ) : (
                  <span
                    className={`kds-docs-preview kds-docs-preview--${preview}`}
                    style={{ [PREVIEW_PROPERTY[preview as Exclude<PreviewKind, 'none'>]]: row.css }}
                  />
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
