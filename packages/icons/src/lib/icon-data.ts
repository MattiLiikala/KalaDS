import type { ICON_NAMES } from '../data/names.js';

/** Every icon name, e.g. "search" or "chevron-down". */
export type IconName = (typeof ICON_NAMES)[number];

/** One shape element of an icon: its tag (path, circle, rect…) and attributes in camelCase. */
export type IconNode = readonly [tag: string, props: Readonly<Record<string, string>>];

/** An icon as data, generated from src/svgs by scripts/build-icons.mjs. */
export interface IconData {
  readonly viewBox: string;
  readonly nodes: readonly IconNode[];
}
