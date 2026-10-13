import { useState, type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { IconContext } from '@kalads/icons/native';
import { ButtonDefaults, type ButtonSize, type ButtonSpec } from '@kalads/spec';
import { c, t } from '../internal/theme.js';
import { textStyle } from '../internal/text.js';
import { hasContent } from '../internal/children.js';
import { ring, useFocusVisible } from '../internal/focus.js';

/** Font size and padding per size. md uses the variant's padding tokens, as kds-button does. */
const SIZES: Record<ButtonSize, { fontSize: number; paddingY?: number; paddingX?: number }> = {
  sm: { fontSize: t.font.size['100'], paddingY: t.size['100'].rem, paddingX: t.size['300'].rem },
  md: { fontSize: t.font.size['200'] },
  lg: { fontSize: t.font.size['300'], paddingY: t.size['300'].rem, paddingX: t.size['600'].rem },
};

/** The 1px border every button has, as in kds-button. */
const BORDER = 1;

export interface ButtonProps
  extends ButtonSpec, Omit<PressableProps, 'children' | 'style' | 'disabled'> {
  /** Label text. */
  children?: ReactNode;
  /** Icon before the label (the web component's `start` slot). */
  start?: ReactNode;
  /** Icon after the label (the web component's `end` slot). */
  end?: ReactNode;
  /** Layout style for the button's outer box (margins, alignment, flex). */
  style?: StyleProp<ViewStyle>;
}

/**
 * Trigger actions. Solid variants (`primary`, `secondary`, `danger`) have a filled background with a label
 * colour that keeps 4.5:1 contrast in every state. On inverse surfaces set `onInverse`.
 */
export function Button(props: ButtonProps) {
  return <ButtonBase {...props} />;
}

/** @internal Shared by Button and IconButton. */
export function ButtonBase({
  variant = ButtonDefaults.variant,
  size = ButtonDefaults.size,
  disabled = false,
  onInverse,
  start,
  end,
  children,
  style,
  square,
  iconSize,
  colors,
  onHoverIn,
  onHoverOut,
  onFocus,
  onBlur,
  ...rest
}: ButtonProps & {
  square?: boolean;
  iconSize?: number;
  /** Overrides for the variant's colour tokens (Notification's close button follows the notification variant). */
  colors?: Partial<(typeof c.button)['ghost']>;
}) {
  const v = { ...(onInverse ? c.button[variant].onInverse : c.button[variant]), ...colors };
  const shape = c.button[variant];
  const { fontSize, paddingY = shape.paddingY, paddingX = shape.paddingX } = SIZES[size];
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const hasLabel = hasContent(children);

  const font = textStyle(
    t.font.family.label,
    fontSize,
    t.font.weight.bold,
    t.font.lineHeight.small,
  );
  const lineHeight = font.lineHeight ?? fontSize;
  const side = square ? lineHeight + 2 * paddingY : undefined;
  const textColor = disabled ? v.textDisabled : v.text;

  const slot = (node: ReactNode) => (node ? <View style={{ flexDirection: 'row' }}>{node}</View> : null);

  /*
   * Like the web component's host: the outer View takes part in the parent's layout (stretching in a
   * column, centring in a row), while the button itself keeps its content width.
   */
  return (
    <View style={[{ alignItems: 'flex-start' }, style]}>
      <Pressable
        role="button"
        disabled={disabled}
        aria-disabled={disabled}
        onHoverIn={(e) => {
          setHovered(true);
          onHoverIn?.(e);
        }}
        onHoverOut={(e) => {
          setHovered(false);
          onHoverOut?.(e);
        }}
        onFocus={(e) => {
          focus.onFocus();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          focus.onBlur();
          onBlur?.(e);
        }}
        style={({ pressed }) => {
          const bg = disabled ? v.bgDisabled : pressed ? v.bgActive : hovered ? v.bgHover : v.bg;
          const border = disabled
            ? v.borderDisabled
            : focus.focusVisible
              ? v.borderFocus
              : hovered
                ? v.borderHover
                : v.border;
          return [
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: t.size['200'].rem,
              borderWidth: BORDER,
              borderRadius: square ? c.iconButton.radius : shape.radius,
              borderColor: border,
              backgroundColor: bg,
              ...(square
                ? { width: side! + 2 * BORDER, height: side! + 2 * BORDER }
                : { paddingVertical: paddingY, paddingHorizontal: paddingX }),
              ...(focus.focusVisible
                ? ring(v.ringFocus, c.button.ringWidth, c.button.ringOffset)
                : {}),
            } satisfies ViewStyle,
          ];
        }}
        {...rest}
      >
        <IconContext.Provider value={{ color: textColor, size: iconSize }}>
          {slot(start)}
          {square
            ? slot(children)
            : hasLabel && (
                <Text numberOfLines={1} style={[font, { color: textColor }]}>
                  {children}
                </Text>
              )}
          {slot(end)}
        </IconContext.Provider>
      </Pressable>
    </View>
  );
}
