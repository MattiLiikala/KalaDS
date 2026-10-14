import { View, type ViewProps } from 'react-native';
import { ContainerDefaults, type ContainerSpec } from '@kalads/spec';
import { c, useTokens } from '../internal/theme.js';

export interface ContainerProps extends ContainerSpec, ViewProps {}

const MAX = { sm: c.container.maxWidthSm, md: c.container.maxWidthMd, lg: c.container.maxWidthLg, xl: c.container.maxWidthXl, full: undefined };

/** Centres content horizontally and limits its width. Layout only: no visuals of its own. */
export function Container({ size = ContainerDefaults.size, flush, style, ...rest }: ContainerProps) {
  const { c } = useTokens();
  return (
    <View
      style={[{ width: '100%', maxWidth: MAX[size], alignSelf: 'center', paddingHorizontal: flush ? 0 : c.container.paddingX }, style]}
      {...rest}
    />
  );
}
