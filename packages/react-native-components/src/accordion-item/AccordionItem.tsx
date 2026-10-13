import { useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronDownIcon } from '@kalads/icons/native';
import type { AccordionItemSpec } from '@kalads/spec';
import { c, s, t } from '../internal/theme.js';
import { textStyle, typeStyle } from '../internal/text.js';
import { isText } from '../internal/children.js';
import { useControllable } from '../internal/controllable.js';
import { ring, useFocusVisible } from '../internal/focus.js';
import { useReducedMotion } from '../internal/motion.js';
import { AccordionContext } from '../accordion/context.js';

export interface AccordionItemProps extends Omit<AccordionItemSpec, 'heading'> {
  /** Heading: text or rich content. */
  heading?: ReactNode;
  defaultOpen?: boolean;
  /** When the user expands or collapses the section (the web component's `kds-toggle`). */
  onToggle?: (open: boolean) => void;
  /** Section content. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DURATION = 200;

/**
 * One expandable section of an Accordion. The heading row is a button announced as expanded or collapsed;
 * opening and closing animate the height (skipped with reduced motion).
 */
export function AccordionItem({ heading, open, defaultOpen = false, disabled, onToggle, children, style }: AccordionItemProps) {
  const id = useId();
  const accordion = useContext(AccordionContext);
  const [isOpen, setOpen] = useControllable(open, defaultOpen);
  const [hovered, setHovered] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const focus = useFocusVisible();
  const reduce = useReducedMotion();
  const progress = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const k = c.accordionItem;

  const change = (next: boolean) => {
    setOpen(next);
    onToggle?.(next);
    if (next) accordion?.opened(id);
  };

  // Without `multiple`, opening another item in the same Accordion closes this one.
  useEffect(() => {
    if (accordion && !accordion.multiple && accordion.lastOpened && accordion.lastOpened !== id && isOpen) change(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accordion?.lastOpened]);

  useEffect(() => {
    if (reduce) progress.setValue(isOpen ? 1 : 0);
    else Animated.timing(progress, { toValue: isOpen ? 1 : 0, duration: DURATION, useNativeDriver: false }).start();
  }, [isOpen, reduce, progress]);

  const title = textStyle(t.semantic.type.label.family, t.semantic.type.body.size, t.semantic.type.label.weight, t.semantic.type.body.lineHeight);
  const body = typeStyle('body');

  return (
    <View style={[{ borderBottomWidth: k.borderWidth, borderBottomColor: k.border }, style]}>
      <Pressable
        role="button"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        disabled={disabled}
        onPress={() => change(!isOpen)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: s.spacing.md,
            paddingVertical: k.paddingY,
            paddingHorizontal: k.paddingX,
            borderRadius: k.radius,
            backgroundColor: hovered && !disabled ? k.bgHover : 'transparent',
          },
          focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null,
        ]}
      >
        <View style={{ flex: 1 }}>{isText(heading) ? <Text style={[title, { color: disabled ? s.text.muted : k.titleText }]}>{heading}</Text> : heading}</View>
        <Animated.View aria-hidden style={{ transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
          <ChevronDownIcon size={s.spacing.lg} color={k.icon} />
        </Animated.View>
      </Pressable>
      <Animated.View
        style={{ overflow: 'hidden', height: progress.interpolate({ inputRange: [0, 1], outputRange: [0, contentHeight] }) }}
        aria-hidden={!isOpen}
        importantForAccessibility={isOpen ? 'auto' : 'no-hide-descendants'}
      >
        {/* Measured at its natural height, outside the animated box's constraints. */}
        <View
          style={{ position: 'absolute', left: 0, right: 0, paddingHorizontal: k.paddingX, paddingBottom: k.paddingY }}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          {isText(children) ? <Text style={[body, { color: k.contentText }]}>{children}</Text> : children}
        </View>
      </Animated.View>
    </View>
  );
}
