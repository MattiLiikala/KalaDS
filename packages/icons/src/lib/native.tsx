import { createContext, useContext, type ComponentType } from 'react';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect, type SvgProps } from 'react-native-svg';
import { tokens } from '@kalads/tokens/native';
import type { IconData } from './icon-data.js';

export interface IconProps extends Omit<SvgProps, 'children' | 'width' | 'height' | 'viewBox'> {
  /** Accessible name. Leave empty for decorative icons (hidden from assistive technology). */
  label?: string;
  /** Size in density-independent pixels. Defaults to the surrounding IconContext, then icon size-md. */
  size?: number;
  /** Colour. Defaults to the surrounding IconContext, then the default text colour. */
  color?: string;
}

/**
 * React Native has no CSS inheritance, so components that contain icons (buttons, chips, notifications)
 * pass their text colour and icon size down through this context.
 */
export const IconContext = createContext<{ color?: string; size?: number }>({});

const SHAPES: Record<string, ComponentType<Record<string, unknown>>> = {
  path: Path,
  circle: Circle,
  ellipse: Ellipse,
  line: Line,
  polygon: Polygon,
  polyline: Polyline,
  rect: Rect,
} as never;

/** Builds a React Native icon component (react-native-svg) from generated icon data. */
export function createIcon(displayName: string, data: IconData) {
  function Icon({ label = '', size, color, ...rest }: IconProps) {
    const context = useContext(IconContext);
    const px = size ?? context.size ?? tokens.component.icon.sizeMd;
    const fill = color ?? context.color ?? tokens.semantic.text.default;
    return (
      <Svg
        viewBox={data.viewBox}
        width={px}
        height={px}
        fill={fill}
        accessible={Boolean(label)}
        accessibilityRole={label ? 'image' : undefined}
        accessibilityLabel={label || undefined}
        importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
        accessibilityElementsHidden={!label}
        {...rest}
      >
        {data.nodes.map(([tag, props], i) => {
          const Shape = SHAPES[tag];
          if (!Shape) throw new Error(`@kalads/icons: unsupported SVG element <${tag}>`);
          return <Shape key={i} {...props} />;
        })}
      </Svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}
