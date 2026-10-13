import { useId, useMemo, type ComponentPropsWithRef } from 'react';
import { RadioGroupDefaults, type RadioGroupSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import { groupVars } from '../internal/group-vars.js';
import styles from '../internal/Group.module.css';
import { RadioGroupContext } from './context.js';

export interface RadioGroupProps
  extends RadioGroupSpec,
    Omit<ComponentPropsWithRef<'div'>, keyof RadioGroupSpec | 'onChange' | 'defaultValue'> {
  defaultValue?: string;
  /** When the user selects an option (the web component's `kds-change`). */
  onChange?: (value: string) => void;
}

/**
 * Group of Radio options where exactly one can be selected. Handles selection, keyboard navigation (arrow
 * keys move and select, Tab enters and leaves the group) and the form value.
 */
export function RadioGroup({
  label,
  value,
  defaultValue = '',
  name,
  orientation = RadioGroupDefaults.orientation,
  helper,
  error,
  required,
  disabled,
  onChange,
  className,
  style,
  children,
  id,
  ...rest
}: RadioGroupProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const [current, setCurrent] = useControllable(value, defaultValue);
  const context = useMemo(
    () => ({
      name: name || baseId,
      value: current,
      disabled: Boolean(disabled),
      required: Boolean(required),
      select: (next: string) => {
        if (next === current) return;
        setCurrent(next);
        onChange?.(next);
      },
    }),
    [name, baseId, current, disabled, required, setCurrent, onChange],
  );
  const describedBy = error ? `${baseId}-error` : helper ? `${baseId}-helper` : undefined;
  return (
    <div className={cx(styles.root, className)} style={groupVars('radio-group', style)} data-orientation={orientation} {...rest}>
      {label && (
        <span className={styles.label} id={`${baseId}-label`}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
      )}
      <div
        className={styles.options}
        role="radiogroup"
        aria-labelledby={label ? `${baseId}-label` : undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-orientation={orientation}
      >
        <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
      </div>
      {error ? (
        <span className={styles.error} id={`${baseId}-error`}>
          {error}
        </span>
      ) : helper ? (
        <span className={styles.helper} id={`${baseId}-helper`}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}
