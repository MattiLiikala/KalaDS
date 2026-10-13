import { Text, View, type ViewProps } from 'react-native';
import { DividerDefaults, type DividerSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { hasContent } from '../internal/children.js';
import { typeStyle } from '../internal/text.js';

export interface DividerProps extends DividerSpec, ViewProps {}

/**
 * Thin line separating groups of content, horizontally or vertically. Children become a label in the
 * middle of a horizontal divider ("or"). Decorative dividers are hidden from assistive technology.
 */
export function Divider({ orientation = DividerDefaults.orientation, flush, decorative, style, children, ...rest }: DividerProps) {
  const vertical = orientation === 'vertical';
  const line = vertical
    ? { width: c.divider.width, flex: 1, backgroundColor: c.divider.color }
    : { flex: 1, height: c.divider.width, backgroundColor: c.divider.color };
  const spacing = flush ? 0 : c.divider.spacing;
  const labelled = !vertical && hasContent(children);
  return (
    <View
      style={[
        vertical ? { alignSelf: 'stretch', marginHorizontal: spacing } : { marginVertical: spacing, flexDirection: 'row', alignItems: 'center', gap: c.divider.labelGap },
        style,
      ]}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative || undefined}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      {...rest}
    >
      <View style={line} />
      {labelled && (
        <>
          <Text style={[typeStyle('body-sm'), { color: c.divider.labelText }]}>{children}</Text>
          <View style={line} />
        </>
      )}
    </View>
  );
}
