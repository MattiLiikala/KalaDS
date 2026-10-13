import React from 'react';
import { contrast, getTokens, tokenValue } from './tokens';

interface Props {
  /** Palette path, e.g. "color.primary". */
  path: string;
}

/**
 * One palette as a row of swatches, generated from the token build. Each swatch is a colour block with its
 * step, hex value and what it can be used for on the default page background (bg-default) below it:
 * "Text" at 4.5:1 or more, "UI" (borders, icons, large text) at 3:1 or more.
 *
 * The labels sit on the page background, not on the colour, so they are readable for every step.
 */
export function ColorScale({ path }: Props) {
  const page = tokenValue('semantic.bg.default');
  return (
    <div className="kds-docs-scale">
      <div className="kds-docs-scale-name">{path.split('.').pop()}</div>
      <div className="kds-docs-scale-swatches">
        {getTokens(path).map((row) => {
          // Semi-transparent colours (e.g. neutral-alpha) depend on what's behind them: no usage label.
          const opaque = /^#[0-9a-f]{6}$/i.test(row.value);
          const ratio = opaque ? contrast(row.value, page) : 0;
          const usage = ratio >= 4.5 ? 'Text' : ratio >= 3 ? 'UI' : '';
          return (
            <div key={row.path} className="kds-docs-swatch">
              <span className="kds-docs-swatch-color" style={{ backgroundColor: row.css }} />
              <span className="kds-docs-swatch-step">{row.path.split('.').pop()}</span>
              <span className="kds-docs-swatch-hex">{row.value}</span>
              {usage && <span className="kds-docs-swatch-usage">{usage}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
