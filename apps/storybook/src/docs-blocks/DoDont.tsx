import React, { type ReactNode } from 'react';

interface ExampleProps {
  /** One sentence: what to do, or what not to do and why. */
  caption: string;
  /** The example, built with KalaDS components. */
  children: ReactNode;
}

function Example({ kind, caption, children }: ExampleProps & { kind: 'do' | 'dont' }) {
  return (
    <figure className={`kds-docs-example kds-docs-example--${kind}`}>
      <div className="kds-docs-example-canvas">{children}</div>
      <figcaption>
        <span className="kds-docs-example-label">
          {kind === 'do' ? <kds-icon-check-circle></kds-icon-check-circle> : <kds-icon-error></kds-icon-error>}
          {kind === 'do' ? 'Do' : "Don't"}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
}

/** A recommended usage example (green label). */
export const Do = (props: ExampleProps) => <Example kind="do" {...props} />;

/** A usage example to avoid (red label). */
export const Dont = (props: ExampleProps) => <Example kind="dont" {...props} />;

/** Side-by-side Do / Don't examples. Wraps to one column on narrow pages. */
export function DoDont({ children }: { children: ReactNode }) {
  return <div className="kds-docs-dodont">{children}</div>;
}
