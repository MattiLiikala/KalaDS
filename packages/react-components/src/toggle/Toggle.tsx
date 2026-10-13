import type { ChangeEvent, ComponentPropsWithRef } from 'react';
import { ToggleDefaults, type ToggleSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import styles from './Toggle.module.css';

export interface ToggleProps
  extends ToggleSpec,
    Omit<ComponentPropsWithRef<'input'>, keyof ToggleSpec | 'onChange' | 'type' | 'defaultChecked'> {
  defaultChecked?: boolean;
  /** When the user flips the switch (the web component's `kds-change`). */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Class for the outer label. */
  className?: string;
}

/**
 * On/off switch for settings that take effect immediately: a native checkbox with role="switch". Use a
 * Checkbox instead when the choice only applies after a form is submitted.
 */
export function Toggle({
  checked,
  defaultChecked = false,
  disabled,
  name,
  value = ToggleDefaults.value,
  onChange,
  className,
  children,
  hidden,
  ...rest
}: ToggleProps) {
  const [on, setOn] = useControllable(checked, defaultChecked);
  return (
    <label className={cx(styles.root, className)} data-checked={flag(on)} data-disabled={flag(disabled)} hidden={hidden}>
      <span className={styles.control}>
        <input
          className={styles.input}
          type="checkbox"
          role="switch"
          checked={on}
          aria-checked={on}
          disabled={disabled}
          name={name || undefined}
          value={value}
          onChange={(e) => {
            setOn(e.target.checked);
            onChange?.(e.target.checked, e);
          }}
          {...rest}
        />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </span>
      <span className={styles.text}>{children}</span>
    </label>
  );
}
