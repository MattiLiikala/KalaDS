import { useId, type ReactNode } from 'react';
import { Animated, I18nManager, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CloseIcon } from '@kalads/icons/native';
import { DrawerDefaults, type CloseReason, type DrawerSpec } from '@kalads/spec';
import { c, s } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { hasContent, isText } from '../internal/children.js';
import { useModal } from '../internal/modal.js';
import { IconButton } from '../icon-button/IconButton.js';

export interface DrawerProps extends DrawerSpec {
  defaultOpen?: boolean;
  /** Actions pinned to the bottom (the web component's `footer` slot). */
  footer?: ReactNode;
  /** After the drawer opens (the web component's `kds-open`). */
  onOpen?: () => void;
  /** When the drawer asks to close, with why (the web component's `kds-close`). Set `open` to false. */
  onClose?: (reason: CloseReason) => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const WIDTH = { sm: c.drawer.widthSm, md: c.drawer.widthMd, lg: c.drawer.widthLg };

/**
 * Full-height panel that slides in from the side, for navigation or secondary tasks. Modal like Dialog:
 * the Android back button ('escape') and the backdrop close it, unless `persistent`. `start` and `end`
 * follow the layout direction.
 */
export function Drawer({
  open,
  defaultOpen = false,
  heading,
  placement = DrawerDefaults.placement,
  size = DrawerDefaults.size,
  persistent = false,
  closeLabel = DrawerDefaults.closeLabel,
  footer,
  onOpen,
  onClose,
  children,
  style,
}: DrawerProps) {
  const id = useId();
  const screen = useWindowDimensions();
  const { visible, progress, requestClose } = useModal({ open, defaultOpen, persistent, onOpen, onClose, duration: 200 });
  const k = c.drawer;
  const width = Math.min(WIDTH[size], screen.width);
  const atRight = (placement === 'end') !== I18nManager.isRTL;
  const border = { borderColor: k.border, [atRight ? 'borderLeftWidth' : 'borderRightWidth']: k.borderWidth };
  return (
    <Modal transparent visible={visible} onRequestClose={() => requestClose('escape')} animationType="none" statusBarTranslucent>
      <SafeAreaProvider>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: k.backdrop, opacity: Animated.multiply(progress, k.backdropOpacity) }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => requestClose('backdrop')} accessible={false} />
        </Animated.View>
        <Animated.View
          role="dialog"
          aria-modal
          aria-labelledby={`${id}-heading`}
          accessibilityViewIsModal
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              [atRight ? 'right' : 'left']: 0,
              width,
              backgroundColor: k.bg,
              ...border,
              transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [atRight ? width : -width, 0] }) }],
            },
            style,
          ]}
        >
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: k.gap, paddingHorizontal: k.padding, paddingTop: k.padding, paddingBottom: k.gap }}>
              <Text nativeID={`${id}-heading`} role="heading" style={[typeStyle('h4'), { flex: 1, color: k.text }]}>
                {heading}
              </Text>
              {!persistent && (
                <IconButton size="sm" label={closeLabel} onPress={() => requestClose('close-button')} style={{ marginTop: -s.spacing.xs, marginRight: -s.spacing.xs }}>
                  <CloseIcon />
                </IconButton>
              )}
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: k.padding }}>
              {isText(children) ? <Text style={[typeStyle('body'), { color: k.text }]}>{children}</Text> : children}
            </ScrollView>
            {hasContent(footer) ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: s.spacing.sm, paddingHorizontal: k.padding, paddingTop: k.gap, paddingBottom: k.padding }}>
                {footer}
              </View>
            ) : null}
          </SafeAreaView>
        </Animated.View>
      </SafeAreaProvider>
    </Modal>
  );
}
