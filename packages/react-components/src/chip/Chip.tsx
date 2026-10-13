import type { ComponentPropsWithRef, ReactNode } from 'react';
import { ChipDefaults, type ChipSpec } from '@kalads/spec';
import { CloseIcon } from '@kalads/icons/react';
import { cx, flag } from '../internal/cx.js';
import { textOf } from '../internal/children.js';
import { useControllable } from '../internal/controllable.js';
import styles from './Chip.module.css';

export interface ChipProps extends ChipSpec, Omit<ComponentPropsWithRef<'span'>, keyof ChipSpec | 'onChange'> {
  defaultSelected?: boolean;
  /** Leading icon (the web component's `start` slot). */
  start?: ReactNode;
  /** When a selectable chip is toggled (the web component's `kds-change`). */
  onChange?: (selected: boolean) => void;
  /** When the remove button is pressed (the web component's `kds-remove`). */
  onRemove?: () => void;
}

/**
 * Compact element for filters, choices or entered values (tags). `selectable` makes it a toggle button
 * (aria-pressed) and `removable` adds a remove button; a chip that is neither is static text.
 */
export function Chip({
  variant = ChipDefaults.variant,
  selectable,
  selected,
  defaultSelected = false,
  removable,
  removeLabel = ChipDefaults.removeLabel,
  disabled,
  start,
  onChange,
  onRemove,
  className,
  children,
  ...rest
}: ChipProps) {
  const [on, setOn] = useControllable(selected, defaultSelected);
  const content = (
    <>
      {start && <span className={styles.start}>{start}</span>}
      {children}
    </>
  );
  return (
    <span
      className={cx(styles.root, className)}
      data-variant={variant}
      data-selectable={flag(selectable)}
      data-selected={flag(selectable && on)}
      data-removable={flag(removable)}
      data-disabled={flag(disabled)}
      {...rest}
    >
      {selectable ? (
        <button
          className={styles.body}
          type="button"
          aria-pressed={on}
          disabled={disabled}
          onClick={() => {
            setOn(!on);
            onChange?.(!on);
          }}
        >
          {content}
        </button>
      ) : (
        <span className={styles.body}>{content}</span>
      )}
      {removable && (
        <button
          className={styles.remove}
          type="button"
          aria-label={`${removeLabel} ${textOf(children)}`.trim()}
          disabled={disabled}
          onClick={() => onRemove?.()}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}
