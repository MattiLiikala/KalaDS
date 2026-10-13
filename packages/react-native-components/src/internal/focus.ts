import { useCallback, useState } from 'react';
import { Platform, type ViewStyle } from 'react-native';

/*
 * Focus rings show only for keyboard focus, like CSS :focus-visible. On the web (react-native-web) the
 * last input type is tracked on the document; on iOS and Android, focus only moves with a hardware
 * keyboard or switch control, where a ring is always wanted.
 */
let keyboard = Platform.OS !== 'web';
type Listenable = { addEventListener(type: string, listener: () => void, capture?: boolean): void };
const doc = (globalThis as { document?: Listenable }).document;
if (Platform.OS === 'web' && doc) {
  doc.addEventListener('keydown', () => (keyboard = true), true);
  doc.addEventListener('pointerdown', () => (keyboard = false), true);
}

/** Focus state for a focusable element, with `focusVisible` true only for keyboard focus. */
export function useFocusVisible() {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const onFocus = useCallback(() => {
    setFocused(true);
    setVisible(keyboard);
  }, []);
  const onBlur = useCallback(() => {
    setFocused(false);
    setVisible(false);
  }, []);
  return { focused, focusVisible: focused && visible, onFocus, onBlur };
}

/** An offset focus ring, as the web components draw it with outline + outline-offset. */
export function ring(color: string, width: number, offset: number): ViewStyle {
  return { outlineColor: color, outlineWidth: width, outlineOffset: offset, outlineStyle: 'solid' };
}

