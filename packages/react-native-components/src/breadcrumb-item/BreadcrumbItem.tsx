import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { ChevronRightIcon } from '@kalads/icons/native';
import type { BreadcrumbItemSpec } from '@kalads/spec';
import { c, t } from '../internal/theme.js';
import { fontFamily } from '../internal/fonts.js';
import { typeStyle } from '../internal/text.js';
import { Link } from '../link/Link.js';

export interface BreadcrumbItemProps extends BreadcrumbItemSpec {
  /** Item text. */
  children?: ReactNode;
  /** Handles the press instead of opening `href` (router navigation). */
  onPress?: () => void;
  /** @internal Set by Breadcrumbs on its first item, which has no separator. */
  first?: boolean;
}

/**
 * One step in Breadcrumbs: a link when it has an `href` (or onPress), plain text marked as the current
 * page otherwise. A chevron separator comes before every item but the first.
 */
export function BreadcrumbItem({ href, current, onPress, first, children }: BreadcrumbItemProps) {
  const k = c.breadcrumbItem;
  const isCurrent = current || (!href && !onPress);
  const font = typeStyle('body-sm');
  return (
    <View role="listitem" style={{ flexDirection: 'row', alignItems: 'center', gap: k.gap }}>
      {!first ? (
        <View aria-hidden>
          <ChevronRightIcon size={k.separatorSize} color={k.separator} />
        </View>
      ) : null}
      {isCurrent ? (
        <Text aria-current="page" style={[font, { fontFamily: fontFamily(t.font.family.base, t.font.weight.bold), color: k.textCurrent }]}>
          {children}
        </Text>
      ) : (
        <Text style={font}>
          <Link href={href} onPress={onPress} variant="subtle">
            {children}
          </Link>
        </Text>
      )}
    </View>
  );
}
