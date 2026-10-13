import { useContext, type ComponentPropsWithRef } from 'react';
import type { RadioSpec } from '@kalads/spec';
import { cx, flag } from '../internal/cx.js';
import { RadioGroupContext } from '../radio-group/context.js';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<RadioSpec, 'checked'>, Omit<ComponentPropsWithRef<'input'>, keyof RadioSpec | 'type'> {
  /** Class for the outer label. */
  className?: string;
}

/**
 * One option in a RadioGroup. Always use inside a RadioGroup: the group owns the selection. A native
 * radio input, so arrow keys move and select within the group and Tab enters and leaves it.
 */
export function Radio({ value = '', disabled, className, children, hidden, ...rest }: RadioProps) {
  const group = useContext(RadioGroupContext);
  const checked = group?.value === value;
  const off = Boolean(disabled || group?.disabled);
  return (
    <label className={cx(styles.root, className)} data-checked={flag(checked)} data-disabled={flag(off)} hidden={hidden}>
      <span className={styles.control}>
        <input
          className={styles.input}
          type="radio"
          name={group?.name}
          value={value}
          checked={checked}
          disabled={off}
          required={group?.required}
          onChange={() => group?.select(value)}
          {...rest}
        />
        <span className={styles.circle} aria-hidden="true" />
      </span>
      <span className={styles.text}>{children}</span>
    </label>
  );
}
