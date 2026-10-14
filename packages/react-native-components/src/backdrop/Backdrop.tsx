import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import type { BackdropSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { SurfaceContext } from '../internal/surface.js';
import { useReducedMotion } from '../internal/motion.js';

export interface BackdropProps extends BackdropSpec {
  /** When the overlay is tapped (the web component's `kds-close`), or the Android back button is pressed. */
  onClose?: () => void;
  /** Content centred above the overlay, e.g. a loading message. Typography inside uses inverse text. */
  children?: ReactNode;
}

/**
 * Dims the screen behind temporary content, e.g. while something loads. Fades in over 150 ms. For
 * anything the user must interact with, use Dialog.
 */
export function Backdrop({ open = false, onClose, children }: BackdropProps) {
  const { c } = useTokens();
  const opacity = useRef(new Animated.Value(0)).current;
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return opacity.setValue(0);
    if (reduce) opacity.setValue(c.backdrop.opacity);
    else Animated.timing(opacity, { toValue: c.backdrop.opacity, duration: 150, useNativeDriver: true }).start();
  }, [open, reduce, opacity]);
  return (
    <Modal transparent visible={open} onRequestClose={() => onClose?.()} animationType="none" statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: c.backdrop.bg, opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => onClose?.()} accessible={false} />
      </Animated.View>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="box-none">
        <SurfaceContext.Provider value="inverse">{children}</SurfaceContext.Provider>
      </View>
    </Modal>
  );
}
