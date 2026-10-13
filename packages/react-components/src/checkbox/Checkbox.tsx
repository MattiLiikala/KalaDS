import { useEffect, useRef, type ChangeEvent, type ComponentPropsWithRef } from 'react';
import { CheckboxDefaults, type CheckboxSpec } from '@kalads/spec';
import { CheckIcon, MinusIcon } from '@kalads/icons/react';
import { cx, flag } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import { mergeRefs } from '../internal/refs.js';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends CheckboxSpec,
    Omit<ComponentPropsWithRef<'input'>, keyof CheckboxSpec | 'onChange' | 'type' | 'defaultChecked'> {
  defaultChecked?: boolean;
  /** When the user toggles the checkbox (the web component's `kds-change`). */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Class for the outer label. */
  className?: string;
}

/**
 * Binary choice, or a mixed state for "select all" (`indeterminate`, cleared by the parent when the user
 * toggles). Wraps a native checkbox, so keyboard, label clicks and forms work as usual. There's no error
 * state on a single checkbox: show errors on the CheckboxGroup.
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate,
  disabled,
  required,
  name,
  value = CheckboxDefaults.value,
  onChange,
  className,
  children,
  hidden,
  ref,
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [on, setOn] = useControllable(checked, defaultChecked);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <label
      className={cx(styles.root, className)}
      data-checked={flag(on || indeterminate)}
      data-disabled={flag(disabled)}
      hidden={hidden}
    >
      <span className={styles.control}>
        <input
          ref={mergeRefs(inputRef, ref)}
          className={styles.input}
          type="checkbox"
          checked={on}
          disabled={disabled}
          required={required}
          name={name || undefined}
          value={value}
          onChange={(e) => {
            setOn(e.target.checked);
            onChange?.(e.target.checked, e);
          }}
          {...rest}
        />
        <span className={styles.box} aria-hidden="true">
          {indeterminate ? <MinusIcon /> : on ? <CheckIcon /> : null}
        </span>
      </span>
      <span className={styles.text}>{children}</span>
    </label>
  );
}
