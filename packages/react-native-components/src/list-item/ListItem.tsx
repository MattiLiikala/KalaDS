import { useContext, useState, type ReactNode } from 'react';
import { Linking, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ListItemSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { hasContent, isText } from '../internal/children.js';
import { ring, useFocusVisible } from '../internal/focus.js';
import { ListContext, NestedListContext } from '../list/context.js';

export interface ListItemProps extends Omit<ListItemSpec, 'target'> {
  /** Primary text. */
  children?: ReactNode;
  /** Secondary (description) text. */
  secondary?: ReactNode;
  /** Leading content: icon, avatar, checkbox. */
  start?: ReactNode;
  /** Trailing content: meta text, badge, action. */
  end?: ReactNode;
  /** A nested List. */
  nested?: ReactNode;
  /** When an interactive row is activated (the web component's `kds-select`). With `href`, replaces opening the URL (router links). */
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
}

const body = typeStyle('body');
const small = typeStyle('body-sm');

/**
 * One row in a List: primary text, optional secondary text, leading and trailing content. Static by
 * default; with `href` the row is a link (opened with Linking unless onSelect handles it), with
 * `interactive` a button that calls onSelect.
 */
export function ListItem({ href, interactive, selected, disabled, children, secondary, start, end, nested, onSelect, style }: ListItemProps) {
  const { c, s } = useTokens();
  const { dense } = useContext(ListContext);
  const [hovered, setHovered] = useState(false);
  const focus = useFocusVisible();
  const k = c.listItem;
  const pressable = Boolean(href) || Boolean(interactive);
  const color = disabled && !href ? k.textDisabled : selected ? k.textSelected : k.text;

  const row = (pressed: boolean): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: k.gap,
    paddingVertical: dense ? s.spacing.xs : k.paddingY,
    paddingHorizontal: k.paddingX,
    borderRadius: k.radius,
    backgroundColor: selected ? k.bgSelected : pressable && pressed ? k.bgActive : pressable && hovered && !disabled ? k.bgHover : 'transparent',
  });

  const content = (
    <>
      {start ? <View style={{ flexShrink: 0 }}>{start}</View> : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        {isText(children) ? <Text style={[body, { color }]}>{children}</Text> : children}
        {hasContent(secondary) &&
          (isText(secondary) ? <Text style={[small, { color: selected ? color : k.secondaryText }]}>{secondary}</Text> : secondary)}
      </View>
      {end ? <View style={{ flexShrink: 0 }}>{end}</View> : null}
    </>
  );

  return (
    <View role="listitem" style={style}>
      {pressable ? (
        <Pressable
          role={href ? 'link' : 'button'}
          aria-current={selected ? (href ? 'page' : true) : undefined}
          aria-selected={selected}
          aria-disabled={disabled && !href}
          disabled={disabled && !href}
          onPress={() => (onSelect ? onSelect() : href ? void Linking.openURL(href) : undefined)}
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          onFocus={focus.onFocus}
          onBlur={focus.onBlur}
          style={({ pressed }) => [row(pressed), focus.focusVisible ? ring(k.ringFocus, k.ringWidth, k.ringOffset) : null]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={row(false)}>{content}</View>
      )}
      {nested ? <NestedListContext.Provider value>{nested}</NestedListContext.Provider> : null}
    </View>
  );
}
