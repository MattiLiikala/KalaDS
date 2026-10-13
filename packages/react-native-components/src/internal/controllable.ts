import { useCallback, useState } from 'react';

/**
 * State that is controlled when `value` is defined and uncontrolled otherwise (starting at
 * `defaultValue`), like React's own form elements. The setter updates internal state only when
 * uncontrolled; callers always get notified through their onChange.
 */
export function useControllable<T>(value: T | undefined, defaultValue: T): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
    },
    [controlled],
  );
  return [controlled ? value : internal, set];
}
