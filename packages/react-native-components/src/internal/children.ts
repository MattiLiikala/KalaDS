import { Children, isValidElement, type ReactNode } from 'react';

/** Whether children render anything visible: not empty, null, false or whitespace-only text. */
export function hasContent(children: ReactNode): boolean {
  return Children.toArray(children).some((child) =>
    typeof child === 'string' ? child.trim() !== '' : typeof child === 'number' || isValidElement(child),
  );
}

/** Whether children are only text (strings and numbers), which React Native must render inside <Text>. */
export function isText(children: ReactNode): boolean {
  const list = Children.toArray(children);
  return list.length > 0 && list.every((child) => typeof child === 'string' || typeof child === 'number');
}

/** The plain text of children (for accessible names built from a label, e.g. "Remove Design"). */
export function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? String(child)
        : isValidElement(child)
          ? textOf((child.props as { children?: ReactNode }).children)
          : '',
    )
    .join('')
    .trim();
}
