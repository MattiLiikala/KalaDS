import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { computePlacement, type Placement, type Side } from '@kalads/spec';

type Measurable = { measureInWindow(cb: (x: number, y: number, width: number, height: number) => void): void };

interface PopupProps {
  anchorRef: RefObject<Measurable | null>;
  open: boolean;
  placement: Placement;
  /** Gap between anchor and popup, from the component's offset token. */
  gap: number;
  /** Makes the popup as wide as its anchor (listboxes). */
  matchWidth?: boolean;
  /** Tapping outside or the Android back button. */
  onDismiss: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode | ((side: Side) => ReactNode);
}

/**
 * A floating surface next to its anchor (menu, select and autocomplete lists, tooltip), shown in a
 * transparent Modal above everything, as the web components use the browser's top layer. Placed with
 * computePlacement from @kalads/spec: the preferred side, flipped when there isn't room, kept on screen.
 */
export function Popup({ anchorRef, open, placement, gap, matchWidth, onDismiss, style, children }: PopupProps) {
  const viewport = useWindowDimensions();
  const [anchor, setAnchor] = useState<{ x: number; y: number; width: number; height: number }>();
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    if (!open) {
      setAnchor(undefined);
      setSize(undefined);
      return;
    }
    anchorRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
  }, [open, anchorRef, viewport.width, viewport.height]);

  const placed = anchor && size ? computePlacement({ anchor, popup: size, viewport, placement, gap }) : undefined;

  return (
    <Modal transparent visible={open} onRequestClose={onDismiss} animationType="none" supportedOrientations={['portrait', 'landscape']}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} accessible={false} />
      {/* Rendered at once (invisible until placed), so the content exists while it's measured. */}
      {open && (
        <View
          onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
          style={[
            { position: 'absolute', top: placed?.top ?? 0, left: placed?.left ?? 0, opacity: placed ? 1 : 0 },
            matchWidth && anchor ? { width: anchor.width } : null,
            style,
          ]}
        >
          {typeof children === 'function' ? children(placed?.side ?? (placement.split('-')[0] as Side)) : children}
        </View>
      )}
    </Modal>
  );
}
