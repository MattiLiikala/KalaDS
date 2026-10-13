import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { DrawerDefaults, type CloseReason, type DrawerSpec } from '@kalads/spec';
import { CloseIcon } from '@kalads/icons/react';
import { cx } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import { useModal } from '../internal/modal.js';
import { mergeRefs } from '../internal/refs.js';
import { IconButton } from '../icon-button/IconButton.js';
import styles from './Drawer.module.css';

export interface DrawerProps
  extends DrawerSpec,
    Omit<ComponentPropsWithRef<'dialog'>, keyof DrawerSpec | 'onClose' | 'onCancel'> {
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  /** Actions pinned to the bottom (the web component's `footer` slot). */
  footer?: ReactNode;
  /** After the drawer opens (the web component's `kds-open`). */
  onOpen?: () => void;
  /** When the drawer asks to close, with why (the web component's `kds-close`). Set `open` to false. */
  onClose?: (reason: CloseReason) => void;
}

/**
 * Full-height panel that slides in from the side, for navigation or secondary tasks. Modal like Dialog:
 * focus is contained, the page behind is inert, Escape closes it and focus returns to the opener.
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
  className,
  children,
  ref,
  ...rest
}: DrawerProps) {
  const id = useId();
  const { dialogRef, requestClose, dialogProps } = useModal({ open, defaultOpen, persistent, onOpen, onClose });
  return (
    <dialog
      ref={mergeRefs(dialogRef, ref)}
      className={cx(styles.dialog, className)}
      data-placement={placement}
      data-size={size}
      aria-labelledby={`${id}-heading`}
      {...dialogProps}
      {...rest}
    >
      <div className={styles.header}>
        <h2 id={`${id}-heading`} className={styles.heading}>
          {heading}
        </h2>
        {!persistent && (
          <span className={styles.close}>
            <IconButton size="sm" label={closeLabel} onClick={() => requestClose('close-button')}>
              <CloseIcon />
            </IconButton>
          </span>
        )}
      </div>
      <div className={styles.body}>{children}</div>
      {hasContent(footer) && <div className={styles.footer}>{footer}</div>}
    </dialog>
  );
}
