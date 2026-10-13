import { useLayoutEffect, useRef, type ComponentPropsWithRef } from 'react';
import type { BackdropSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import popup from '../internal/Popup.module.css';
import styles from './Backdrop.module.css';

export interface BackdropProps extends BackdropSpec, Omit<ComponentPropsWithRef<'div'>, keyof BackdropSpec | 'onClose'> {
  /** When the overlay is clicked (the web component's `kds-close`). */
  onClose?: () => void;
}

/**
 * Dims the page behind temporary content, e.g. while something loads. Children are centred above the
 * overlay. Shown in the browser's top layer, so it covers everything without z-index. It doesn't trap
 * focus: for anything the user must interact with, use Dialog.
 */
export function Backdrop({ open = false, onClose, className, children, ...rest }: BackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current as (HTMLDivElement & { showPopover?: () => void; hidePopover?: () => void }) | null;
    if (!el) return;
    const supported = typeof el.showPopover === 'function';
    if (open) {
      el.hidden = false;
      if (supported && !el.matches(':popover-open')) el.showPopover!();
    } else {
      if (supported && el.matches(':popover-open')) el.hidePopover!();
      el.hidden = true;
    }
  }, [open]);
  return (
    <div ref={ref} className={cx(popup.popup, styles.backdrop, className)} popover="manual" hidden {...rest}>
      <div className={styles.overlay} onClick={() => onClose?.()} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
