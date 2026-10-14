import { useId, type ReactNode } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { CloseIcon } from '@kalads/icons/native';
import { DialogDefaults, type CloseReason, type DialogSpec } from '@kalads/spec';
import { c, useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { hasContent, isText } from '../internal/children.js';
import { useModal } from '../internal/modal.js';
import { IconButton } from '../icon-button/IconButton.js';

export interface DialogProps extends DialogSpec {
  defaultOpen?: boolean;
  /** Actions, e.g. Cancel and Confirm buttons, right-aligned (the web component's `footer` slot). */
  footer?: ReactNode;
  /** After the dialog opens (the web component's `kds-open`). */
  onOpen?: () => void;
  /** When the dialog asks to close, with why (the web component's `kds-close`). Set `open` to false. */
  onClose?: (reason: CloseReason) => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const WIDTH = { sm: c.dialog.widthSm, md: c.dialog.widthMd, lg: c.dialog.widthLg };

/**
 * Modal window for focused tasks and confirmations, over a dimmed backdrop. Accessibility focus moves into
 * the dialog and the page behind is hidden from assistive technology; the Android back button closes it
 * ('escape'), and so does tapping the backdrop, unless `persistent`.
 */
export function Dialog({
  open,
  defaultOpen = false,
  heading,
  size = DialogDefaults.size,
  persistent = false,
  closeLabel = DialogDefaults.closeLabel,
  footer,
  onOpen,
  onClose,
  children,
  style,
}: DialogProps) {
  const { c, s } = useTokens();
  const id = useId();
  const screen = useWindowDimensions();
  const { visible, progress, requestClose } = useModal({ open, defaultOpen, persistent, onOpen, onClose, duration: 150 });
  const k = c.dialog;
  const margin = s.spacing.md;
  return (
    <Modal transparent visible={visible} onRequestClose={() => requestClose('escape')} animationType="none" statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: k.backdrop, opacity: Animated.multiply(progress, k.backdropOpacity) }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => requestClose('backdrop')} accessible={false} />
      </Animated.View>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', padding: margin }]} pointerEvents="box-none">
        <Animated.View
          role="dialog"
          aria-modal
          aria-labelledby={`${id}-heading`}
          accessibilityViewIsModal
          style={[
            {
              width: Math.min(WIDTH[size], screen.width - margin * 2),
              maxHeight: screen.height - margin * 2,
              gap: k.gap,
              padding: k.padding,
              backgroundColor: k.bg,
              borderWidth: k.borderWidth,
              borderColor: k.border,
              borderRadius: k.radius,
              boxShadow: k.shadow as ViewStyle['boxShadow'],
              opacity: progress,
              transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [s.spacing.sm, 0] }) }],
            },
            style,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: k.gap }}>
            <Text nativeID={`${id}-heading`} role="heading" style={[typeStyle('h4'), { flex: 1, color: k.text }]}>
              {heading}
            </Text>
            {!persistent && (
              <IconButton size="sm" label={closeLabel} onPress={() => requestClose('close-button')} style={{ marginTop: -s.spacing.xs, marginRight: -s.spacing.xs }}>
                <CloseIcon />
              </IconButton>
            )}
          </View>
          <ScrollView style={{ flexGrow: 0 }}>{isText(children) ? <Text style={[typeStyle('body'), { color: k.text }]}>{children}</Text> : children}</ScrollView>
          {hasContent(footer) ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: s.spacing.sm }}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
}
