import React from 'react';
import { getTokens } from './tokens';

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
 * Table of every token in a group, generated from the token build (@kalads/tokens/json), so it can't
 * drift from the source. Columns: token path, CSS variable, resolved value, and an optional preview.
 */
export function TokenTable({ path, preview = 'none', pairUnits = false, only }: Props) {
  const rows = getTokens(path, { pairUnits }).filter((r) => !only || only.includes(r.path.split('.').pop()!));
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
