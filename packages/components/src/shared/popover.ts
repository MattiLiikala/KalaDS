import { unsafeCSS } from 'lit';

/**
 * Positioning for floating elements (tooltip, menu, autocomplete listbox).
 *
 * Popups are shown in the browser's top layer with the Popover API, so ancestors with `overflow: hidden`
 * or a `transform` (for example a pressed interactive card) can't clip or offset them. They are
 * positioned with `position: fixed` next to their anchor and flip to the opposite side when there
 * isn't room.
 *
 * The gap between anchor and popup comes from a design token. Popups declare it as
 * `scroll-margin-top: var(--kds-component-...-offset)`: scroll-margin has no visual effect here, but
 * its computed value is the token resolved to pixels, which is what the maths below needs.
 */

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${'start' | 'end'}`;

/** Base styles every popup element needs. Undo the UA popover centring and use fixed positioning. */
export const POPUP_RESET = unsafeCSS(`
  position: fixed;
  inset: auto;
  margin: 0;
  overflow: visible;
`);

export function supportsPopover(el: HTMLElement): boolean {
  return typeof (el as HTMLElement & { showPopover?: () => void }).showPopover === 'function';
}

/*
 * Popups are rendered with both `popover` and `hidden`: `hidden` keeps them closed in browsers without
 * the Popover API. Showing removes `hidden` first, because an open popover with `hidden` stays invisible.
 */
export function showPopup(el: HTMLElement) {
  el.hidden = false;
  if (supportsPopover(el) && !el.matches(':popover-open')) el.showPopover();
}

export function hidePopup(el: HTMLElement) {
  if (supportsPopover(el) && el.matches(':popover-open')) el.hidePopover();
  el.hidden = true;
}

export function isPopupOpen(el: HTMLElement): boolean {
  return supportsPopover(el) ? el.matches(':popover-open') : !el.hidden;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Places `popup` next to `anchor`. Returns the side actually used (after flipping), which callers can
 * reflect as an attribute for side-specific styling.
 */
export function positionPopup(anchor: Element, popup: HTMLElement, placement: Placement = 'bottom-start'): Side {
  const [preferred, alignPart] = placement.split('-') as [Side, 'start' | 'end' | undefined];
  const align: Align = alignPart ?? 'center';
  const gap = parseFloat(getComputedStyle(popup).scrollMarginTop) || 0;
  const a = anchor.getBoundingClientRect();
  const width = popup.offsetWidth;
  const height = popup.offsetHeight;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const space: Record<Side, number> = {
    top: a.top - gap,
    bottom: vh - a.bottom - gap,
    left: a.left - gap,
    right: vw - a.right - gap,
  };
  const needed = preferred === 'top' || preferred === 'bottom' ? height : width;
  const side = space[preferred] >= needed || space[preferred] >= space[OPPOSITE[preferred]] ? preferred : OPPOSITE[preferred];

  let top: number;
  let left: number;
  if (side === 'top' || side === 'bottom') {
    top = side === 'bottom' ? a.bottom + gap : a.top - gap - height;
    left = align === 'start' ? a.left : align === 'end' ? a.right - width : a.left + (a.width - width) / 2;
  } else {
    left = side === 'right' ? a.right + gap : a.left - gap - width;
    top = align === 'start' ? a.top : align === 'end' ? a.bottom - height : a.top + (a.height - height) / 2;
  }

  // Keep the popup inside the viewport, using the same gap as breathing room.
  left = Math.min(Math.max(left, gap), Math.max(gap, vw - width - gap));
  top = Math.min(Math.max(top, gap), Math.max(gap, vh - height - gap));

  popup.style.left = `${Math.round(left)}px`;
  popup.style.top = `${Math.round(top)}px`;
  return side;
}

/** Re-runs `update` whenever the page scrolls or resizes while a popup is open. Returns a cleanup function. */
export function autoUpdate(anchor: Element, popup: HTMLElement, update: () => void): () => void {
  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { capture: true, passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  const observer = new ResizeObserver(schedule);
  observer.observe(anchor);
  observer.observe(popup);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', schedule, { capture: true });
    window.removeEventListener('resize', schedule);
    observer.disconnect();
  };
}

let uid = 0;
/** Unique id for ARIA relationships between elements in the same tree. */
export function uniqueId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}
