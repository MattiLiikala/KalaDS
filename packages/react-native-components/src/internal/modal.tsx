import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type { CloseReason } from '@kalads/spec';
import { useControllable } from './controllable.js';
import { useReducedMotion } from './motion.js';

/**
 * Shared behaviour of Dialog and Drawer, as the web components' KdsModalElement: closing always goes
 * through onClose(reason) — 'close-button', 'escape' (Android back) or 'backdrop' — so a controlled `open`
 * stays the source of truth. Keeps the Modal mounted while the exit animation runs.
 */
export function useModal({
  open,
  defaultOpen,
  persistent,
  onOpen,
  onClose,
  duration,
}: {
  open: boolean | undefined;
  defaultOpen: boolean;
  persistent: boolean;
  onOpen?: () => void;
  onClose?: (reason: CloseReason) => void;
  duration: number;
}) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen);
  const [visible, setVisible] = useState(isOpen);
  const progress = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const reduce = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      onOpen?.();
    }
    const done = () => !isOpen && setVisible(false);
    if (reduce) {
      progress.setValue(isOpen ? 1 : 0);
      done();
    } else {
      Animated.timing(progress, { toValue: isOpen ? 1 : 0, duration, useNativeDriver: true }).start(done);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const requestClose = (reason: CloseReason) => {
    if (persistent && reason !== 'close-button') return;
    setOpen(false);
    onClose?.(reason);
  };

  return { visible, progress, requestClose };
}
