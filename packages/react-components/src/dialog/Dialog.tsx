import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { DialogDefaults, type CloseReason, type DialogSpec } from '@kalads/spec';
import { CloseIcon } from '@kalads/icons/react';
import { cx } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import { useModal } from '../internal/modal.js';
import { mergeRefs } from '../internal/refs.js';
import { IconButton } from '../icon-button/IconButton.js';
import styles from './Dialog.module.css';

export interface DialogProps
  extends DialogSpec,
    Omit<ComponentPropsWithRef<'dialog'>, keyof DialogSpec | 'onClose' | 'onCancel'> {
  /** Initial state when uncontrolled. */
  defaultOpen?: boolean;
  /** Actions, e.g. Cancel and Confirm buttons, right-aligned (the web component's `footer` slot). */
  footer?: ReactNode;
  /** After the dialog opens (the web component's `kds-open`). */
  onOpen?: () => void;
  /** When the dialog asks to close, with why (the web component's `kds-close`). Set `open` to false. */
  onClose?: (reason: CloseReason) => void;
}

/**
 * Modal window for focused tasks and confirmations. Built on the native <dialog> with showModal(): focus
 * moves into the dialog and stays there, the page behind is inert, and Escape closes it. Focus returns to
 * the element that opened it.
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
  className,
  children,
  ref,
  ...rest
}: DialogProps) {
  const id = useId();
  const { dialogRef, requestClose, dialogProps } = useModal({ open, defaultOpen, persistent, onOpen, onClose });
  return (
    <dialog
      ref={mergeRefs(dialogRef, ref)}
      className={cx(styles.dialog, className)}
      data-size={size}
      aria-labelledby={`${id}-heading`}
      {...dialogProps}
      {...rest}
    >
      <div className={styles.surface}>
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
      </div>
    </dialog>
  );
}
