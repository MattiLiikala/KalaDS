import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react';
import type { CloseReason } from '@kalads/spec';
import { useControllable } from './controllable.js';

export interface ModalOptions {
  open: boolean | undefined;
  defaultOpen: boolean;
  persistent: boolean;
  onOpen?: () => void;
  onClose?: (reason: CloseReason) => void;
}

/**
 * Shared behaviour of Dialog and Drawer, as the web components' KdsModalElement: built on the native
 * <dialog> with showModal(), which gives focus containment, inert page content and the top layer. Focus
 * returns to the element that opened it.
 *
 * Closing always goes through `onClose(reason)` ('close-button', 'escape', 'backdrop'), so a controlled
 * `open` stays the single source of truth: Escape is intercepted and only closes once the state changes.
 */
export function useModal({ open, defaultOpen, persistent, onOpen, onClose }: ModalOptions) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [isOpen, setOpen] = useControllable(open, defaultOpen);

  const requestClose = (reason: CloseReason) => {
    setOpen(false);
    onClose?.(reason);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal?.();
      onOpen?.();
    } else if (!isOpen && dialog.open) {
      dialog.close();
      returnFocus.current?.focus?.();
      returnFocus.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return {
    dialogRef,
    isOpen,
    requestClose,
    dialogProps: {
      // Escape: keep the dialog open until the state says otherwise.
      onCancel: (e: SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        if (!persistent) requestClose('escape');
      },
      // A click whose target is the <dialog> itself landed on the backdrop, outside the inner surface.
      onClick: (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current && !persistent) requestClose('backdrop');
      },
    },
  };
}
