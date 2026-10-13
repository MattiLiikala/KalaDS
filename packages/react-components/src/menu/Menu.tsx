import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { MenuDefaults, type MenuSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { textOf } from '../internal/children.js';
import { useControllable } from '../internal/controllable.js';
import { usePopup } from '../internal/popup.js';
import popup from '../internal/Popup.module.css';
import styles from './Menu.module.css';

type TriggerProps = {
  onClick?: (e: MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  label?: string;
  children?: ReactNode;
};

export interface MenuProps extends MenuSpec, Omit<ComponentPropsWithRef<'span'>, keyof MenuSpec | 'onSelect'> {
  defaultOpen?: boolean;
  /** The button that opens the menu, e.g. a Button or IconButton (the web component's `trigger` slot). */
  trigger: ReactElement<TriggerProps>;
  /** When the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** When an item is picked (the web component's `kds-select`). */
  onSelect?: (value: string) => void;
}

const ITEM = '[role="menuitem"]';

/**
 * List of actions that opens from a trigger button (WAI-ARIA menu button). The trigger opens the menu
 * (also ArrowDown); arrow keys, Home and End move between MenuItems; Enter or Space picks one; Escape,
 * Tab and clicking outside close it and return focus to the trigger. A Divider can separate groups.
 */
export function Menu({
  open,
  defaultOpen = false,
  label,
  placement = MenuDefaults.placement,
  trigger,
  onOpenChange,
  onSelect,
  className,
  children,
  ...rest
}: MenuProps) {
  const id = useId();
  const [isOpen, setOpen] = useControllable(open, defaultOpen);
  const rootRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef<'first' | 'last'>('first');
  usePopup(rootRef, menuRef, isOpen, placement);

  const items = () => [...(menuRef.current?.querySelectorAll<HTMLElement>(ITEM) ?? [])].filter((i) => !i.hidden);
  const focusItem = (index: number) => {
    const list = items();
    if (list.length) list[(index + list.length) % list.length].focus();
  };
  const triggerEl = () => rootRef.current?.firstElementChild as HTMLElement | null;

  const change = (next: boolean, returnFocus = false) => {
    setOpen(next);
    onOpenChange?.(next);
    if (!next && returnFocus) triggerEl()?.focus();
  };

  useLayoutEffect(() => {
    if (isOpen) focusItem(focusOnOpen.current === 'last' ? -1 : 0);
    focusOnOpen.current = 'first';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) change(false);
    };
    document.addEventListener('pointerdown', onPointer, true);
    return () => document.removeEventListener('pointerdown', onPointer, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const pick = (item: HTMLElement) => {
    if (item.getAttribute('aria-disabled') === 'true') return;
    onSelect?.(item.dataset.value ?? '');
    change(false, true);
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const list = items();
    const current = list.indexOf(document.activeElement as HTMLElement);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(current + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(current - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(-1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (current >= 0) pick(list[current]);
        break;
      case 'Escape':
        e.preventDefault();
        change(false, true);
        break;
      case 'Tab':
        change(false);
        break;
    }
  };

  const triggerProps = trigger.props;
  const triggerText = textOf(triggerProps.children) || triggerProps.label || '';

  return (
    <span ref={rootRef} className={cx(styles.root, className)} {...rest}>
      {cloneElement(trigger, {
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': id,
        onClick: (e: MouseEvent) => {
          triggerProps.onClick?.(e);
          change(!isOpen);
        },
        onKeyDown: (e: KeyboardEvent) => {
          triggerProps.onKeyDown?.(e);
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            focusOnOpen.current = e.key === 'ArrowUp' ? 'last' : 'first';
            if (isOpen) focusItem(e.key === 'ArrowUp' ? -1 : 0);
            else change(true);
          }
        },
      } as Partial<TriggerProps>)}
      <div
        ref={menuRef}
        className={cx(popup.popup, styles.menu)}
        id={id}
        role="menu"
        aria-label={label || triggerText || undefined}
        popover="manual"
        hidden
        onKeyDown={onMenuKeyDown}
        onClick={(e) => {
          const item = (e.target as HTMLElement).closest<HTMLElement>(ITEM);
          if (item) pick(item);
        }}
      >
        {children}
      </div>
    </span>
  );
}
