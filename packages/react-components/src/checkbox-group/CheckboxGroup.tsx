import { useId, type ComponentPropsWithRef } from 'react';
import { CheckboxGroupDefaults, type CheckboxGroupSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { groupVars } from '../internal/group-vars.js';
import styles from '../internal/Group.module.css';

export interface CheckboxGroupProps extends CheckboxGroupSpec, Omit<ComponentPropsWithRef<'div'>, keyof CheckboxGroupSpec> {}

/**
 * Labelled group of related Checkboxes: a shared label (announced as a group), shared helper or error
 * text, and the layout. Each checkbox keeps its own name, value and state.
 */
export function CheckboxGroup({
  label,
  orientation = CheckboxGroupDefaults.orientation,
  helper,
  error,
  required,
  className,
  style,
  children,
  id,
  ...rest
}: CheckboxGroupProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const describedBy = error ? `${baseId}-error` : helper ? `${baseId}-helper` : undefined;
  return (
    <div
      className={cx(styles.root, className)}
      style={groupVars('checkbox-group', style)}
      data-orientation={orientation}
      role="group"
      aria-labelledby={label ? `${baseId}-label` : undefined}
      aria-describedby={describedBy}
      {...rest}
    >
      {label && (
        <span className={styles.label} id={`${baseId}-label`}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
      )}
      <div className={styles.options}>{children}</div>
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
