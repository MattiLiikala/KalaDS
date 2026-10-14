import { View, type ViewProps } from 'react-native';
import { icons, type IconName } from '@kalads/icons/native';
import { IconDefaults, type IconColor, type IconSize, type IconSpec } from '@kalads/spec';
import { c, useTokens } from '../internal/theme.js';

export interface IconProps extends Omit<IconSpec, 'name'>, ViewProps {
  /** Icon name, e.g. "search" or "chevron-down". */
  name: IconName;
}

const SIZE: Record<IconSize, number> = { sm: c.icon.sizeSm, md: c.icon.sizeMd, lg: c.icon.sizeLg };

/**
 * Any KalaDS icon by name, with token-based size and colour. `inherit` takes the surrounding IconContext
 * colour (set by Button, Chip and other components), else the default text colour. Decorative without a
 * `label`. To import a single icon, use @kalads/icons/native.
 */
export function Icon({ name, size = IconDefaults.size, color = IconDefaults.color, label, ...rest }: IconProps) {
  const k = useTokens().c.icon;
  const colors: Record<Exclude<IconColor, 'inherit'>, string> = {
    subtle: k.colorSubtle,
    muted: k.colorMuted,
    brand: k.colorBrand,
    danger: k.colorDanger,
    warning: k.colorWarning,
    success: k.colorSuccess,
  };
  const Glyph = icons[name];
  if (!Glyph) return null;
  return (
    <View {...rest}>
      <Glyph label={label} size={SIZE[size]} color={color === 'inherit' ? undefined : colors[color]} />
    </View>
  );
}

