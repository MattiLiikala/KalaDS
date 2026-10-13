import { useId, type ChangeEvent, type ComponentPropsWithRef } from 'react';
import { InputDefaults, type InputSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import styles from './Input.module.css';

export interface InputProps
  extends InputSpec,
    Omit<ComponentPropsWithRef<'input'>, keyof InputSpec | 'onChange' | 'defaultValue'> {
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** On every change to the text (the web component's `kds-input`). */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** When the value is committed: on blur or Enter (the web component's `kds-change`). */
  onCommit?: (value: string) => void;
  /** Class for the outer wrapper (label, field and messages). */
  className?: string;
}

/** Text input field with label, helper text and error state. */
export function Input({
  label,
  value,
  defaultValue = '',
  placeholder,
  type = InputDefaults.type,
  helper,
  error,
  disabled,
  required,
  onChange,
  onCommit,
  className,
  hidden,
  id,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [current, setCurrent] = useControllable(value, defaultValue);
  const describedBy = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;
  return (
    <div className={cx(styles.root, className)} hidden={hidden}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={styles.wrapper}>
        <input
          id={inputId}
          className={styles.input}
          type={type}
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          onChange={(e) => {
            setCurrent(e.target.value);
            onChange?.(e.target.value, e);
          }}
          // React's onChange fires per keystroke; the native change event (commit) arrives as onBlur/Enter.
          onBlur={(e) => {
            rest.onBlur?.(e);
            onCommit?.(e.target.value);
          }}
          onKeyDown={(e) => {
            rest.onKeyDown?.(e);
            if (e.key === 'Enter') onCommit?.(e.currentTarget.value);
          }}
          {...omit(rest, 'onBlur', 'onKeyDown')}
        />
      </div>
      {error ? (
        <span id={`${inputId}-error`} className={styles.error}>
          {error}
        </span>
      ) : helper ? (
        <span id={`${inputId}-helper`} className={styles.helper}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}

function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const out = { ...obj };
  for (const key of keys) delete out[key];
  return out;
}
