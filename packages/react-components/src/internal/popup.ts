import { useLayoutEffect, useState, type RefObject } from 'react';
import { computePlacement, type Placement, type Side } from '@kalads/spec';

/*
 * Floating elements (tooltip, menu, autocomplete listbox), as in the web components' shared/popover.ts.
 * Popups are shown in the browser's top layer with the Popover API, so ancestors with `overflow: hidden`
 * or a `transform` can't clip or offset them, and positioned with `position: fixed` next to their anchor,
 * flipping to the opposite side when there isn't room (computePlacement in @kalads/spec).
 *
 * The anchor gap comes from a design token: popups declare it as `scroll-margin-top: var(--kds-…-offset)`,
 * which has no visual effect here but whose computed value is the token resolved to pixels.
 *
 * Popups render with both `popover="manual"` and `hidden`: `hidden` keeps them closed in browsers without
 * the Popover API.
 */

function supportsPopover(el: HTMLElement): el is HTMLElement & { showPopover(): void; hidePopover(): void } {
  return typeof (el as { showPopover?: unknown }).showPopover === 'function';
}

function show(el: HTMLElement) {
  el.hidden = false;
  if (supportsPopover(el) && !el.matches(':popover-open')) el.showPopover();
}

function hide(el: HTMLElement) {
  if (supportsPopover(el) && el.matches(':popover-open')) el.hidePopover();
  el.hidden = true;
}

function place(anchor: Element, popup: HTMLElement, placement: Placement): Side {
  const gap = parseFloat(getComputedStyle(popup).scrollMarginTop) || 0;
  const a = anchor.getBoundingClientRect();
  const { top, left, side } = computePlacement({
    anchor: { x: a.left, y: a.top, width: a.width, height: a.height },
    popup: { width: popup.offsetWidth, height: popup.offsetHeight },
    viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
    placement,
    gap,
  });
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  return side;
}

/**
 * Shows `popupRef` next to `anchorRef` while `open`, keeps it placed on scroll and resize, and returns the
 * side it ended up on. `matchWidth` makes the popup as wide as the anchor (listboxes).
 */
export function usePopup(
  anchorRef: RefObject<Element | null>,
  popupRef: RefObject<HTMLElement | null>,
  open: boolean,
  placement: Placement,
  { matchWidth = false }: { matchWidth?: boolean } = {},
): Side {
  const [side, setSide] = useState<Side>(placement.split('-')[0] as Side);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;
    if (!open) {
      hide(popup);
      return;
    }
    if (matchWidth) popup.style.width = `${(anchor as HTMLElement).offsetWidth}px`;
    show(popup);
    const update = () => setSide(place(anchor, popup, placement));
    update();
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
  }, [open, placement, matchWidth, anchorRef, popupRef]);

  return side;
}
