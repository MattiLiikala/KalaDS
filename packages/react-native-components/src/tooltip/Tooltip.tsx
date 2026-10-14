import { cloneElement, useEffect, useRef, useState, type ReactElement } from 'react';
import { Text, View } from 'react-native';
import { TooltipDefaults, type TooltipSpec } from '@kalads/spec';
import { useTokens } from '../internal/theme.js';
import { typeStyle } from '../internal/text.js';
import { Popup } from '../internal/Popup.js';

const SHOW_DELAY_MS = 300;
const HIDE_AFTER_MS = 1500;

export interface TooltipProps extends TooltipSpec {
  /** Tooltip text. */
  content: string;
  /** The trigger: one pressable element, e.g. an IconButton. */
  children: ReactElement;
}

type TriggerProps = {
  onLongPress?: (...args: unknown[]) => void;
  onHoverIn?: (...args: unknown[]) => void;
  onHoverOut?: (...args: unknown[]) => void;
  onFocus?: (...args: unknown[]) => void;
  onBlur?: (...args: unknown[]) => void;
  accessibilityHint?: string;
};

/**
 * Short text label for a trigger. On touch screens it shows on long press and hides after a moment; with a
 * pointer or keyboard it shows on hover and focus, like the web component. The text is also the trigger's
 * accessibility hint, so screen readers announce it. Icon buttons still need their own `label`.
 */
export function Tooltip({ content, placement = TooltipDefaults.placement, disabled, children }: TooltipProps) {
  const { c } = useTokens();
  const [open, setOpen] = useState(false);
  const anchor = useRef<View>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const k = c.tooltip;
  const trigger = children as ReactElement<TriggerProps>;
  const p = trigger.props;

  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = () => !disabled && content && setOpen(true);
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <View ref={anchor} collapsable={false} style={{ alignSelf: 'flex-start' }}>
      {cloneElement(trigger, {
        accessibilityHint: [p.accessibilityHint, content].filter(Boolean).join('. '),
        onLongPress: (...args: unknown[]) => {
          p.onLongPress?.(...args);
          show();
          later(hide, HIDE_AFTER_MS);
        },
        onHoverIn: (...args: unknown[]) => {
          p.onHoverIn?.(...args);
          later(show, SHOW_DELAY_MS);
        },
        onHoverOut: (...args: unknown[]) => {
          p.onHoverOut?.(...args);
          hide();
        },
        onFocus: (...args: unknown[]) => {
          p.onFocus?.(...args);
          show();
        },
        onBlur: (...args: unknown[]) => {
          p.onBlur?.(...args);
          hide();
        },
      })}
      <Popup anchorRef={anchor} open={open} placement={placement} gap={k.offset} onDismiss={hide}>
        <View
          role="tooltip"
          style={{ maxWidth: k.maxWidth, paddingVertical: k.paddingY, paddingHorizontal: k.paddingX, borderRadius: k.radius, backgroundColor: k.bg }}
        >
          <Text style={[typeStyle('label-sm'), { color: k.text }]}>{content}</Text>
        </View>
      </Popup>
    </View>
  );
}
