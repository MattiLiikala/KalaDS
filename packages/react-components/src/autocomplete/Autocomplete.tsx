import { useEffect, useId, useMemo, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent } from 'react';
import { AutocompleteDefaults, type AutocompleteSpec } from '@kalads/spec';
import { ChevronDownIcon } from '@kalads/icons/react';
import { cx, flag } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import { fieldVars } from '../internal/field-vars.js';
import { readOptions, type OptionData } from '../internal/options.js';
import { usePopup } from '../internal/popup.js';
import field from '../internal/Field.module.css';
import popup from '../internal/Popup.module.css';
import styles from './Autocomplete.module.css';

export interface AutocompleteProps
  extends AutocompleteSpec,
    Omit<ComponentPropsWithRef<'div'>, keyof AutocompleteSpec | 'onChange' | 'defaultValue'> {
  defaultValue?: string;
  /** When an option is picked or cleared (the web component's `kds-change`). */
  onChange?: (value: string) => void;
}

/**
 * Text field that suggests matching options as you type (WAI-ARIA combobox). Children are regular
 * <option> elements. Typing filters them; arrow keys move through the matches, Enter picks the highlighted
 * one and Escape closes the list (or clears the text when it's closed). Leaving the field restores the
 * selected option's label, unless the text exactly matches another option.
 */
export function Autocomplete({
  label,
  value,
  defaultValue = '',
  placeholder,
  name,
  helper,
  error,
  emptyText = AutocompleteDefaults.emptyText,
  disabled,
  required,
  onChange,
  className,
  style,
  children,
  id,
  ...rest
}: AutocompleteProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const options = useMemo(() => readOptions(children), [children]);
  const [current, setCurrent] = useControllable(value, defaultValue);
  const selectedLabel = options.find((o) => o.value === current)?.label ?? '';

  const [query, setQuery] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // While not editing, the text shows the selected option's label.
  useEffect(() => {
    if (!focused) setQuery(selectedLabel);
  }, [selectedLabel, focused]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Showing the selected label shouldn't filter the list down to that one option.
    if (!q || query === selectedLabel) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, selectedLabel]);

  usePopup(inputRef, listRef, open, 'bottom-start', { matchWidth: true });

  useEffect(() => {
    if (active >= 0) document.getElementById(`${baseId}-option-${active}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [active, baseId]);

  const commit = (option: OptionData | undefined) => {
    if (option?.disabled) return;
    const next = option?.value ?? '';
    setQuery(option?.label ?? '');
    setOpen(false);
    setActive(-1);
    if (next !== current) {
      setCurrent(next);
      onChange?.(next);
    }
  };

  const move = (step: number) => {
    if (!matches.length) return;
    let next = active;
    for (let i = 0; i < matches.length; i++) {
      next = (next + step + matches.length) % matches.length;
      if (!matches[next].disabled) break;
    }
    setActive(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        setOpen(true);
        move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
        if (open && active >= 0) {
          e.preventDefault();
          commit(matches[active]);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
          setActive(-1);
        } else if (query) {
          e.preventDefault();
          commit(undefined);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  const describedBy = error ? `${baseId}-error` : helper ? `${baseId}-helper` : undefined;
  const activeId = open && active >= 0 ? `${baseId}-option-${active}` : undefined;

  return (
    <div className={cx(field.root, className)} style={fieldVars('autocomplete', style)} {...rest}>
      {label && (
        <label className={field.label} htmlFor={baseId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={field.control}>
        <input
          ref={inputRef}
          id={baseId}
          className={cx(field.field, styles.input)}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${baseId}-listbox`}
          aria-activedescendant={activeId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => {
            const q = e.target.value;
            setQuery(q);
            setOpen(true);
            const q2 = q.trim().toLowerCase();
            const next = !q2 || q === selectedLabel ? options : options.filter((o) => o.label.toLowerCase().includes(q2));
            setActive(next.findIndex((o) => !o.disabled));
            if (!q) commit(undefined);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setOpen(false);
            setActive(-1);
            const exact = options.find((o) => !o.disabled && o.label.toLowerCase() === query.trim().toLowerCase());
            if (exact && exact.value !== current) commit(exact);
            else setQuery(selectedLabel);
          }}
          onClick={() => !disabled && setOpen(true)}
        />
        {name && <input type="hidden" name={name} value={current} />}
        <span className={field.icon} aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </div>
      <div
        ref={listRef}
        className={cx(popup.popup, styles.listbox)}
        id={`${baseId}-listbox`}
        role="listbox"
        aria-label={label || undefined}
        popover="manual"
        hidden
        // Keep focus in the input while clicking an option.
        onMouseDown={(e) => e.preventDefault()}
      >
        {matches.length ? (
          matches.map((o, i) => (
            <div
              key={`${o.value}-${i}`}
              className={styles.option}
              id={`${baseId}-option-${i}`}
              role="option"
              aria-selected={o.value === current}
              aria-disabled={o.disabled}
              data-active={flag(i === active)}
              onClick={() => commit(o)}
            >
              {o.label}
            </div>
          ))
        ) : (
          <div className={styles.empty} role="presentation">
            {emptyText}
          </div>
        )}
      </div>
      {error ? (
        <span id={`${baseId}-error`} className={field.error}>
          {error}
        </span>
      ) : helper ? (
        <span id={`${baseId}-helper`} className={field.helper}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}
