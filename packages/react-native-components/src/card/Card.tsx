import { useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { CardDefaults, type CardSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { hasContent } from '../internal/children.js';
import { useReducedMotion } from '../internal/motion.js';

export interface CardProps extends CardSpec {
  /** Card header area (the web component's `header` slot). */
  header?: ReactNode;
  /** Card footer area (the web component's `footer` slot). */
  footer?: ReactNode;
  /**
   * Makes an interactive card pressable (role link). On the web, cards get a link wrapper instead; React
   * Native has no wrapping link, so the card takes the press itself.
   */
  onPress?: () => void;
  /** Accessible name when the card is pressable. */
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SHADOW = { 1: c.card.shadow1, 2: c.card.shadow2, 3: c.card.shadow3 };
const OFFSET = { 1: c.card.offsetHover1, 2: c.card.offsetHover2, 3: c.card.offsetHover3 };

/**
 * Surface container for grouping related content: a 1px border and a crisp offset shadow set by
 * `elevation`. Header, body and footer are separated by spacing only. An interactive card presses down
 * into its shadow when hovered or pressed.
 */
export function Card({ elevation = CardDefaults.elevation, interactive, header, footer, onPress, accessibilityLabel, children, style }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const k = c.card;
  const surface = (down: boolean): ViewStyle => ({
    gap: k.gap,
    padding: k.padding,
    backgroundColor: down ? k.bgHover : k.bg,
    borderWidth: k.borderWidth,
    borderColor: k.border,
    borderRadius: k.radius,
    boxShadow: (down ? k.shadowHover : SHADOW[elevation]) as ViewStyle['boxShadow'],
    ...(down && !reduce ? { transform: [{ translateX: OFFSET[elevation] }, { translateY: OFFSET[elevation] }] } : {}),
  });
  const content = (
    <>
      {hasContent(header) ? <View>{header}</View> : null}
      <View>{children}</View>
      {hasContent(footer) ? <View>{footer}</View> : null}
    </>
  );
  if (!interactive) return <View style={[surface(false), style]}>{content}</View>;
  return (
    <Pressable
      role={onPress ? 'link' : undefined}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={style}
    >
      {({ pressed }) => <View style={surface(pressed || hovered)}>{content}</View>}
    </Pressable>
  );
}
