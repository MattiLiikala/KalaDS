import { useContext, useEffect, useId, useLayoutEffect, useRef, type ComponentPropsWithRef, type MouseEvent } from 'react';
import type { AccordionItemSpec } from '@kalads/spec';
import { ChevronDownIcon } from '@kalads/icons/react';
import { cx, flag } from '../internal/cx.js';
import { useControllable } from '../internal/controllable.js';
import { AccordionContext } from '../accordion/context.js';
import styles from './AccordionItem.module.css';

export interface AccordionItemProps
  extends AccordionItemSpec,
    Omit<ComponentPropsWithRef<'div'>, keyof AccordionItemSpec | 'onToggle'> {
  defaultOpen?: boolean;
  /** When the user expands or collapses the section (the web component's `kds-toggle`). */
  onToggle?: (open: boolean) => void;
}

/**
 * One expandable section of an Accordion. Built on native <details> / <summary>, so it's keyboard
 * operable and announced as expandable. Opening and closing animate the height (skipped with
 * prefers-reduced-motion). `heading` takes text or rich content.
 */
export function AccordionItem({
  heading,
  open,
  defaultOpen = false,
  disabled,
  onToggle,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const id = useId();
  const accordion = useContext(AccordionContext);
  const [isOpen, setOpen] = useControllable(open, defaultOpen);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation>(undefined);
  const firstRender = useRef(true);

  const change = (next: boolean) => {
    setOpen(next);
    onToggle?.(next);
    if (next) accordion?.opened(id);
  };

  // Without `multiple`, opening another item in the same Accordion closes this one.
  useEffect(() => {
    if (accordion && !accordion.multiple && accordion.lastOpened && accordion.lastOpened !== id && isOpen) change(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accordion?.lastOpened]);

  /*
   * Animates the panel height to open or closed. <details> is opened first (so the content renders and can
   * be measured) and only closed once the closing animation ends. Reversing mid-way starts from the
   * current height.
   */
  useLayoutEffect(() => {
    const details = detailsRef.current;
    const panel = panelRef.current;
    if (!details || !panel) return;
    if (firstRender.current) {
      firstRender.current = false;
      details.open = isOpen;
      return;
    }
    if (!animation.current && details.open === isOpen) return;
    const from = animation.current ? panel.getBoundingClientRect().height : details.open ? panel.scrollHeight : 0;
    animation.current?.cancel();
    animation.current = undefined;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof panel.animate !== 'function') {
      delete panel.dataset.animating;
      details.open = isOpen;
      return;
    }
    details.open = true;
    const to = isOpen ? panel.scrollHeight : 0;
    panel.dataset.animating = '';
    const current = panel.animate({ height: [`${from}px`, `${to}px`] }, { duration: 200, easing: 'ease' });
    animation.current = current;
    current.finished
      .then(() => {
        if (animation.current !== current) return;
        animation.current = undefined;
        delete panel.dataset.animating;
        if (!isOpen) details.open = false;
      })
      .catch(() => {
        // Cancelled by a newer toggle, which takes over.
      });
  }, [isOpen]);

  /** The summary click is handled here instead of natively, so opening and closing can animate. */
  const onSummaryClick = (e: MouseEvent) => {
    e.preventDefault();
    if (!disabled) change(!isOpen);
  };

  return (
    <div className={cx(styles.root, className)} data-open={flag(isOpen)} data-disabled={flag(disabled)} {...rest}>
      <details
        ref={detailsRef}
        // Syncs state when <details> is toggled some other way (for example find-in-page).
        onToggle={() => {
          const details = detailsRef.current;
          if (details && !animation.current && details.open !== isOpen) change(details.open);
        }}
      >
        <summary className={styles.summary} aria-disabled={disabled ? 'true' : 'false'} onClick={onSummaryClick}>
          <span>{heading}</span>
          <span className={styles.chevron} aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </summary>
        <div ref={panelRef} className={styles.panel}>
          <div className={styles.content}>{children}</div>
        </div>
      </details>
    </div>
  );
}
