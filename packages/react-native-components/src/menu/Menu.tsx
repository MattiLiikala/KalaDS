import { cloneElement, useRef, type ReactElement, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { MenuDefaults, type MenuSpec } from '@kalads/spec';
import { c } from '../internal/theme.js';
import { textOf } from '../internal/children.js';
import { useControllable } from '../internal/controllable.js';
import { Popup } from '../internal/Popup.js';
import { MenuContext } from './context.js';

type TriggerProps = { onPress?: (...args: unknown[]) => void; label?: string; children?: ReactNode };

export interface MenuProps extends MenuSpec {
  defaultOpen?: boolean;
  /** The button that opens the menu, e.g. a Button or IconButton (the web component's `trigger` slot). */
  trigger: ReactElement<TriggerProps>;
  /** When the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** When an item is picked (the web component's `kds-select`). */
  onSelect?: (value: string) => void;
  /** MenuItem (and Divider) elements. */
  children?: ReactNode;
}

/**
 * List of actions that opens from a trigger button. Pressing the trigger opens the menu next to it;
 * picking an item or tapping outside closes it (also the Android back button).
 */
export function Menu({ open, defaultOpen = false, label, placement = MenuDefaults.placement, trigger, onOpenChange, onSelect, children }: MenuProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen);
  const anchor = useRef<View>(null);
  const k = c.menu;
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  const p = trigger.props;
  return (
    <View ref={anchor} collapsable={false} style={{ alignSelf: 'flex-start' }}>
      {cloneElement(trigger, {
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        onPress: (...args: unknown[]) => {
          p.onPress?.(...args);
          change(!isOpen);
        },
      } as Partial<TriggerProps>)}
      <Popup anchorRef={anchor} open={isOpen} placement={placement} gap={k.popupOffset} onDismiss={() => change(false)}>
        <View
          role="menu"
          aria-label={label || textOf(p.children) || p.label}
          style={{
            minWidth: k.minWidth,
            maxHeight: k.popupMaxHeight,
            padding: k.popupPadding,
            backgroundColor: k.popupBg,
            borderWidth: k.popupBorderWidth,
            borderColor: k.popupBorder,
            borderRadius: k.popupRadius,
            boxShadow: k.popupShadow as never,
          }}
        >
          <ScrollView>
            <MenuContext.Provider
              value={{
                pick: (value) => {
                  onSelect?.(value);
                  change(false);
                },
              }}
            >
              {children}
            </MenuContext.Provider>
          </ScrollView>
        </View>
      </Popup>
    </View>
  );
}
