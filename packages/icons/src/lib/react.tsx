import { createContext, createElement, useContext, type SVGProps } from 'react';
import type { IconData } from './icon-data.js';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'fill'> {
  /** Accessible name. Leave empty for decorative icons (hidden from assistive technology). */
  label?: string;
}

/**
 * Lets a component style the icons inside it, as CSS inheritance does for the web components. Unused on
 * the web, where icons take the text colour and `--kds-icon-size`; kept so both platforms share one API.
 */
export const IconContext = createContext<{ color?: string; size?: number | string }>({});

/**
 * Builds an icon component from generated icon data. Takes the text colour (`currentColor`) and is sized
 * by `--kds-icon-size`, like the `<kds-icon-*>` web components.
 */
export function createIcon(displayName: string, data: IconData) {
  function Icon({ label = '', style, ...rest }: IconProps) {
    const context = useContext(IconContext);
    const size = context.size ?? 'var(--kds-icon-size, var(--kds-component-icon-size-md))';
    return (
      <svg
        viewBox={data.viewBox}
        fill="currentColor"
        focusable="false"
        {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
        style={{ width: size, height: size, flexShrink: 0, display: 'inline-block', color: context.color, ...style }}
        {...rest}
      >
        {data.nodes.map(([tag, props], i) => createElement(tag, { key: i, ...props }))}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
