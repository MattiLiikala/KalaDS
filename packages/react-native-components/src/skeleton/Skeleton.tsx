import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { SkeletonDefaults, type SkeletonSpec } from '@kalads/spec';
import { c, s } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';

export interface SkeletonProps extends Omit<SkeletonSpec, 'width' | 'height'> {
  /** Width in dp or a percentage string ("60%"). Default: full width; circle: spacing.2xl. */
  width?: DimensionValue;
  /** Height in dp (rect and circle). */
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
}

const k = c.skeleton;
const lineHeight = typeStyle('body').lineHeight!;

/** A shimmering shape: the highlight sweeps across every 1.4 s, or stays still with reduced motion. */
function Shape({ style, shimmer }: { style: StyleProp<ViewStyle>; shimmer: Animated.Value | null }) {
  const [width, setWidth] = useState(0);
  return (
    <View style={[{ backgroundColor: k.bg, overflow: 'hidden' }, style]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {shimmer && width > 0 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width,
            transform: [{ translateX: shimmer.interpolate({ inputRange: [0, 1], outputRange: [-width, width] }) }],
          }}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id="kds-skeleton" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={k.highlight} stopOpacity={0} />
                <Stop offset="0.5" stopColor={k.highlight} stopOpacity={1} />
                <Stop offset="1" stopColor={k.highlight} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width="100%" height="100%" fill="url(#kds-skeleton)" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * Placeholder shape shown while content loads. Hidden from assistive technology: mark the loading region
 * with aria-busy. Text lines are one body line tall; the last of several is shorter.
 */
export function Skeleton({ variant = SkeletonDefaults.variant, lines = 1, width, height, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) return;
      setAnimate(true);
      loop = Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
      loop.start();
    });
    return () => loop?.stop();
  }, [shimmer]);

  const sweep = animate ? shimmer : null;
  let body;
  if (variant === 'circle') {
    const size = width ?? height ?? s.spacing['2xl'];
    body = <Shape shimmer={sweep} style={{ width: size, aspectRatio: 1, borderRadius: s.radius.full }} />;
  } else if (variant === 'rect') {
    body = <Shape shimmer={sweep} style={{ width: width ?? '100%', height: height ?? s.size.xs, borderRadius: k.radius }} />;
  } else {
    const count = Math.max(1, Math.floor(lines));
    body = (
      <View style={{ gap: k.gap, width: width ?? '100%', height }}>
        {Array.from({ length: count }, (_, i) => (
          <Shape
            key={i}
            shimmer={sweep}
            style={{ height: lineHeight, borderRadius: k.radiusText, width: count > 1 && i === count - 1 ? '60%' : '100%' }}
          />
        ))}
      </View>
    );
  }
  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants" style={[variant === 'circle' ? { alignItems: 'flex-start' } : null, style]}>
      {body}
    </View>
  );
}
