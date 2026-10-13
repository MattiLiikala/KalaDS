import { View, type ViewProps } from 'react-native';
import { icons, type IconName } from '@kalads/icons/native';
import { IconDefaults, type IconColor, type IconSize, type IconSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';

export interface IconProps extends Omit<IconSpec, 'name'>, ViewProps {
  /** Icon name, e.g. "search" or "chevron-down". */
  name: IconName;
}

const SIZE: Record<IconSize, number> = { sm: c.icon.sizeSm, md: c.icon.sizeMd, lg: c.icon.sizeLg };
const COLOR: Record<Exclude<IconColor, 'inherit'>, string> = {
  subtle: c.icon.colorSubtle,
  muted: c.icon.colorMuted,
  brand: c.icon.colorBrand,
  danger: c.icon.colorDanger,
  warning: c.icon.colorWarning,
  success: c.icon.colorSuccess,
};

/**
 * Any KalaDS icon by name, with token-based size and colour. `inherit` takes the surrounding IconContext
 * colour (set by Button, Chip and other components), else the default text colour. Decorative without a
 * `label`. To import a single icon, use @kalads/icons/native.
 */
export function Icon({ name, size = IconDefaults.size, color = IconDefaults.color, label, ...rest }: IconProps) {
  const Glyph = icons[name];
  if (!Glyph) return null;
  return (
    <View {...rest}>
      <Glyph label={label} size={SIZE[size]} color={color === 'inherit' ? undefined : COLOR[color]} />
    </View>
  );
}

