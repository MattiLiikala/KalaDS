import { useState, type ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { CheckCircleIcon, CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from '@kalads/icons/native';
import { NotificationDefaults, type NotificationSpec, type NotificationVariant } from '@kalads/spec';
import { c, s } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { hasContent, isText } from '../internal/children.js';
import { ButtonBase } from '../button/Button.js';

const ICONS: Record<NotificationVariant, typeof InfoIcon> = { info: InfoIcon, success: CheckCircleIcon, warning: WarningIcon, danger: ErrorIcon };
const OFFSET = { 1: c.notification.offset1, 2: c.notification.offset2, 3: c.notification.offset3 };

export interface NotificationProps extends NotificationSpec {
  /** Buttons or links shown below the message (the web component's `actions` slot). */
  actions?: ReactNode;
  /** When the close button is pressed. The notification hides itself; return `false` to keep it. */
  onClose?: () => void | boolean;
  /** Message. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const body = typeStyle('body');

/**
 * Message about the status of something: info, success, warning or error. Danger and warning are
 * announced immediately (role alert, assertive); info and success politely (live region). Render the
 * notification when the message should be announced.
 */
export function Notification({
  variant = NotificationDefaults.variant,
  elevation = NotificationDefaults.elevation,
  heading,
  dismissible,
  closeLabel = NotificationDefaults.closeLabel,
  actions,
  onClose,
  children,
  style,
}: NotificationProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const k = c.notification;
  const v = k[variant];
  const urgent = variant === 'danger' || variant === 'warning';
  const Glyph = ICONS[variant] ?? InfoIcon;
  const offset = OFFSET[elevation] ?? k.offset3;
  return (
    <View
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: k.gap,
          padding: k.padding,
          backgroundColor: v.bg,
          borderWidth: k.borderWidth,
          borderColor: v.accent,
          borderRadius: k.radius,
          // A crisp shadow (semantic.shadow.crisp.*) in the variant's colour.
          boxShadow: [{ offsetX: offset, offsetY: offset, blurRadius: 0, spreadDistance: 0, color: v.shadowColor }],
        },
        style,
      ]}
    >
      <View style={{ height: body.lineHeight, justifyContent: 'center' }} aria-hidden>
        <Glyph size={s.spacing.lg} color={v.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: s.spacing.xs }}>
        {heading ? <Text style={[body, typeStyle('label'), { fontSize: body.fontSize, lineHeight: body.lineHeight, color: k.titleText }]}>{heading}</Text> : null}
        {isText(children) ? <Text style={[body, { color: k.text }]}>{children}</Text> : children}
        {hasContent(actions) ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: s.spacing.sm, marginTop: s.spacing.xs }}>{actions}</View> : null}
      </View>
      {dismissible ? (
        <View style={{ marginVertical: -s.spacing.xs }}>
          {/* A ghost icon button whose colours follow the variant, as the web component re-points its ghost tokens. */}
          <ButtonBase
            variant="ghost"
            size="sm"
            square
            iconSize={c.iconButton.iconSizeSm}
            aria-label={closeLabel}
            colors={{ text: v.close, bgHover: v.closeBgHover, bgActive: v.closeBgHover }}
            onPress={() => onClose?.() !== false && setDismissed(true)}
          >
            <CloseIcon />
          </ButtonBase>
        </View>
      ) : null}
    </View>
  );
}
