import { useState, type ReactNode } from 'react';
import { Linking, Text, View, type TextProps } from 'react-native';
import { ExternalLinkIcon } from '@kalads/icons/native';
import { LinkDefaults, type LinkSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { useFocusVisible, ring } from '../internal/focus.js';

export interface LinkProps extends Omit<LinkSpec, 'rel' | 'download'>, Omit<TextProps, 'onPress' | 'role'> {
  /** Link text. */
  children?: ReactNode;
  /**
   * Handles the press instead of opening `href` with Linking, e.g. for in-app (router) navigation. Return
   * nothing; the URL isn't opened when this is set.
   */
  onPress?: () => void;
}

/**
 * Text link for navigation (use Button for actions). Underlined so it's recognisable without colour, and
 * a Text, so it flows inside a Typography paragraph. `target="_blank"` marks it as leaving the app: it gets
 * the external icon and the screen-reader note, and opens in the browser.
 */
export function Link({ href, target, variant = LinkDefaults.variant, newTabLabel = LinkDefaults.newTabLabel, onPress, style, children, ...rest }: LinkProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const focus = useFocusVisible();
  const k = c.link;
  const external = target === '_blank';
  const color = pressed ? k.textActive : variant === 'subtle' ? (hovered ? k.textSubtleHover : k.textSubtle) : hovered ? k.textHover : k.text;
  return (
    <Text
      role="link"
      accessibilityHint={external ? newTabLabel : undefined}
      onPress={() => (onPress ? onPress() : href ? void Linking.openURL(href) : undefined)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      // Text has no focus or pointer props in its types, but react-native-web (keyboard focus, hover) uses them.
      {...({ onPointerEnter: () => setHovered(true), onPointerLeave: () => setHovered(false), onFocus: focus.onFocus, onBlur: focus.onBlur } as object)}
      style={[
        { color, textDecorationLine: 'underline', textDecorationColor: color },
        focus.focusVisible ? [{ borderRadius: k.radius }, ring(k.ringFocus, k.ringWidth, k.ringOffset)] : null,
        style,
      ]}
      {...rest}
    >
      {children}
      {external ? (
        <View aria-hidden style={{ paddingLeft: k.iconGap }}>
          <ExternalLinkIcon size={k.iconSize} color={color} />
        </View>
      ) : null}
    </Text>
  );
}
