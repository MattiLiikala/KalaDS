import { useId, type ChangeEvent, type ComponentPropsWithRef } from 'react';
import type { SelectSpec } from '@kalads/spec';
import { ChevronDownIcon } from '@kalads/icons/react';
import { cx, flag } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import { fieldVars } from '../internal/field-vars.js';
import field from '../internal/Field.module.css';
import styles from './Select.module.css';

export interface SelectProps
  extends SelectSpec,
    Omit<ComponentPropsWithRef<'select'>, keyof SelectSpec | 'onChange' | 'defaultValue' | 'multiple'> {
  defaultValue?: string;
  /** When the user picks an option (the web component's `kds-change`). */
  onChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;
  /** Class for the outer wrapper. */
  className?: string;
}

/**
 * Pick one option from a list. Styled like Input, built on a native <select>: children are regular
 * <option> and <optgroup> elements, so the native picker (including on mobile) and keyboard behaviour
 * are kept. For long lists or type-to-filter, use Autocomplete.
 */
export function Select({
  label,
  value,
  defaultValue = '',
  placeholder,
  name,
  helper,
  error,
  disabled,
  required,
  onChange,
  className,
  style,
  hidden,
  id,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const [current, setCurrent] = useControllable(value, defaultValue);
  const describedBy = error ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined;
  return (
    <div className={cx(field.root, className)} style={fieldVars('select', style)} hidden={hidden}>
      {label && (
        <label className={field.label} htmlFor={selectId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={field.control}>
        <select
          id={selectId}
          name={name || undefined}
          className={cx(field.field, styles.select)}
          data-placeholder={flag(Boolean(placeholder) && !current)}
          value={current}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          onChange={(e) => {
            setCurrent(e.target.value);
            onChange?.(e.target.value, e);
          }}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <span className={cx(field.icon, styles.icon)} aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </div>
      {error ? (
        <span id={`${selectId}-error`} className={field.error}>
          {error}
        </span>
      ) : helper ? (
        <span id={`${selectId}-helper`} className={field.helper}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}
