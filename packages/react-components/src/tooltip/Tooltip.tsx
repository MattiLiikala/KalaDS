import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactElement,
} from 'react';
import { TooltipDefaults, type TooltipSpec } from '@kalads/spec';
import { cx } from '../internal/cx.js';
import { usePopup } from '../internal/popup.js';
import popup from '../internal/Popup.module.css';
import styles from './Tooltip.module.css';

const SHOW_DELAY_MS = 300;
const HIDE_DELAY_MS = 100;

export interface TooltipProps extends TooltipSpec, Omit<ComponentPropsWithRef<'span'>, keyof TooltipSpec | 'content'> {
  /** Tooltip text. */
  content: string;
  /** The trigger: one element, e.g. an IconButton. */
  children: ReactElement;
}

/**
 * Short text label shown when its trigger is hovered or focused. The text is linked to the trigger with
 * aria-describedby, can be hovered without closing, and closes on Escape (WCAG 1.4.13). Keep it short and
 * never put interactive content in it. Icon buttons still need their own `label` (the accessible name).
 */
export function Tooltip({ content, placement = TooltipDefaults.placement, disabled, className, children, ...rest }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timers = useRef({ show: 0, hide: 0 });
  const side = usePopup(anchorRef, bubbleRef, open && !disabled && Boolean(content), placement);

  const clear = () => {
    clearTimeout(timers.current.show);
    clearTimeout(timers.current.hide);
  };
  const showNow = () => {
    clear();
    setOpen(true);
  };
  const hideNow = () => {
    clear();
    setOpen(false);
  };
  const scheduleShow = () => {
    clear();
    timers.current.show = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
  };
  const scheduleHide = () => {
    clear();
    timers.current.hide = window.setTimeout(() => setOpen(false), HIDE_DELAY_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hideNow();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => clear, []);

  const trigger = Children.only(children);
  const describedBy = [(trigger.props as { 'aria-describedby'?: string })['aria-describedby'], id].filter(Boolean).join(' ');

  return (
    <span
      ref={anchorRef}
      className={cx(styles.root, className)}
      onMouseEnter={scheduleShow}
      onMouseLeave={scheduleHide}
      onFocus={showNow}
      onBlur={hideNow}
      {...rest}
    >
      {isValidElement(trigger) ? cloneElement(trigger as ReactElement<Record<string, unknown>>, { 'aria-describedby': describedBy }) : trigger}
      <div
        ref={bubbleRef}
        className={cx(popup.popup, styles.tooltip)}
        popover="manual"
        hidden
        data-side={side}
        onMouseEnter={showNow}
        onMouseLeave={scheduleHide}
      >
        <span id={id} role="tooltip">
          {content}
        </span>
      </div>
    </span>
  );
}
