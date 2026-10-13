/**
 * Placement maths for floating elements (tooltip, menu, select and autocomplete popups), shared by the
 * platforms that position popups themselves. Mirrors positionPopup() in the web components'
 * shared/popover.ts: try the preferred side, flip when there isn't room, then keep it in the viewport.
 */

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${'start' | 'end'}`;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlacementInput {
  /** The anchor in viewport coordinates. */
  anchor: Rect;
  /** The popup's measured size. */
  popup: { width: number; height: number };
  /** The viewport size. */
  viewport: { width: number; height: number };
  placement?: Placement;
  /** Gap between anchor and popup, also kept as the margin to the viewport edges. */
  gap?: number;
}

export interface PlacementResult {
  top: number;
  left: number;
  /** The side used after flipping, for side-specific styling (e.g. a tooltip arrow). */
  side: Side;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

export function computePlacement({ anchor: a, popup, viewport, placement = 'bottom-start', gap = 0 }: PlacementInput): PlacementResult {
  const [preferred, alignPart] = placement.split('-') as [Side, 'start' | 'end' | undefined];
  const align: Align = alignPart ?? 'center';
  const right = a.x + a.width;
  const bottom = a.y + a.height;

  const space: Record<Side, number> = {
    top: a.y - gap,
    bottom: viewport.height - bottom - gap,
    left: a.x - gap,
    right: viewport.width - right - gap,
  };
  const needed = preferred === 'top' || preferred === 'bottom' ? popup.height : popup.width;
  const side = space[preferred] >= needed || space[preferred] >= space[OPPOSITE[preferred]] ? preferred : OPPOSITE[preferred];

  let top: number;
  let left: number;
  if (side === 'top' || side === 'bottom') {
    top = side === 'bottom' ? bottom + gap : a.y - gap - popup.height;
    left = align === 'start' ? a.x : align === 'end' ? right - popup.width : a.x + (a.width - popup.width) / 2;
  } else {
    left = side === 'right' ? right + gap : a.x - gap - popup.width;
    top = align === 'start' ? a.y : align === 'end' ? bottom - popup.height : a.y + (a.height - popup.height) / 2;
  }

  left = Math.min(Math.max(left, gap), Math.max(gap, viewport.width - popup.width - gap));
  top = Math.min(Math.max(top, gap), Math.max(gap, viewport.height - popup.height - gap));
  return { top: Math.round(top), left: Math.round(left), side };
}
