import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { NotificationDefaults, type NotificationSpec, type NotificationVariant } from '@kalads/spec';
import { CheckCircleIcon, CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from '@kalads/icons/react';
import { cx } from '../internal/cx.js';
import { hasContent } from '../internal/children.js';
import { IconButton } from '../icon-button/IconButton.js';
import styles from './Notification.module.css';

const ICONS: Record<NotificationVariant, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  danger: ErrorIcon,
};

export interface NotificationProps extends NotificationSpec, Omit<ComponentPropsWithRef<'div'>, keyof NotificationSpec> {
  /** Buttons or links shown below the message (the web component's `actions` slot). */
  actions?: ReactNode;
  /**
   * When the close button is pressed (the web component's `kds-close`). The notification hides itself;
   * return `false` to keep it visible (the web component's preventDefault()).
   */
  onClose?: () => void | boolean;
}

/**
 * Message about the status of something: info, success, warning or error. Danger and warning use
 * role="alert" (announced immediately); info and success use role="status" (announced politely). Render
 * the notification when the message should be announced.
 */
export function Notification({
  variant = NotificationDefaults.variant,
  elevation = NotificationDefaults.elevation,
  heading,
  dismissible,
  closeLabel = NotificationDefaults.closeLabel,
  actions,
  onClose,
  className,
  children,
  hidden,
  ...rest
}: NotificationProps) {
  const [dismissed, setDismissed] = useState(false);
  const urgent = variant === 'danger' || variant === 'warning';
  const Glyph = ICONS[variant] ?? InfoIcon;
  return (
    <div className={cx(styles.root, className)} data-variant={variant} data-elevation={elevation} hidden={hidden || dismissed} {...rest}>
      <div className={styles.notification} role={urgent ? 'alert' : 'status'}>
        <span className={styles.icon} aria-hidden="true">
          <Glyph />
        </span>
        <div className={styles.content}>
          {heading && <span className={styles.heading}>{heading}</span>}
          <div>{children}</div>
          {hasContent(actions) && <div className={styles.actions}>{actions}</div>}
        </div>
        {dismissible && (
          <span className={styles.close}>
            <IconButton size="sm" label={closeLabel} onClick={() => onClose?.() !== false && setDismissed(true)}>
              <CloseIcon />
            </IconButton>
          </span>
        )}
      </div>
    </div>
  );
}
