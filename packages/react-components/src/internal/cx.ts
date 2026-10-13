/** Joins class names, skipping falsy ones. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}

/** A boolean prop as a data attribute: present when true, absent otherwise (`[data-inline]`). */
export function flag(value: boolean | undefined): '' | undefined {
  return value ? '' : undefined;
}
