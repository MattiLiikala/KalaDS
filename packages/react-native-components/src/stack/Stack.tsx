import { View, type FlexAlignType, type ViewProps, type ViewStyle } from 'react-native';
import { StackDefaults, type StackSpec } from '@kalads/spec';
import { space, useTokens } from '../internal/theme.js';

export interface StackProps extends StackSpec, ViewProps {}

const ALIGN: Record<NonNullable<StackSpec['align']>, FlexAlignType> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY: Record<NonNullable<StackSpec['justify']>, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

/** Lays children out in a column or row with token-based spacing. */
export function Stack({ direction = StackDefaults.direction, gap, align, justify, wrap, inline, style, ...rest }: StackProps) {
  const { c } = useTokens();
  const layout: ViewStyle = {
    flexDirection: direction,
    gap: space(gap) ?? c.stack.gap,
    ...(align ? { alignItems: ALIGN[align] } : {}),
    ...(justify ? { justifyContent: JUSTIFY[justify] } : {}),
    ...(wrap ? { flexWrap: 'wrap' } : {}),
    ...(inline ? { alignSelf: 'flex-start' } : {}),
  };
  return <View style={[layout, style]} {...rest} />;
}
