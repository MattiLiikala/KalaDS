// Theme: wrap the app root in KalaThemeProvider for dark mode (scheme="dark" or "auto"); light without it.
export { KalaThemeProvider, useTokens, type KalaScheme, type KalaThemeProviderProps } from './internal/theme.js';
// Fonts: call useKalaFonts() once at the app root and render KalaDS components after it returns true.
export { useKalaFonts, fontFamily } from './internal/fonts.js';
export { typeStyle, type TypeVariant } from './internal/text.js';
// Select and Autocomplete take Option children (React Native has no <option>).
export { Option, type OptionProps } from './internal/options.js';

// Layout
export { Box, type BoxProps } from './box/Box.js';
export { Stack, type StackProps } from './stack/Stack.js';
export { Grid, type GridProps } from './grid/Grid.js';
export { GridItem, type GridItemProps } from './grid-item/GridItem.js';
export { Container, type ContainerProps } from './container/Container.js';
export { Divider, type DividerProps } from './divider/Divider.js';
export { Typography, type TypographyProps } from './typography/Typography.js';

// Inputs
export { Button, type ButtonProps } from './button/Button.js';
export { IconButton, type IconButtonProps } from './icon-button/IconButton.js';
export { Input, type InputProps } from './input/Input.js';
export { Select, type SelectProps } from './select/Select.js';
export { Autocomplete, type AutocompleteProps } from './autocomplete/Autocomplete.js';
export { Checkbox, type CheckboxProps } from './checkbox/Checkbox.js';
export { CheckboxGroup, type CheckboxGroupProps } from './checkbox-group/CheckboxGroup.js';
export { Radio, type RadioProps } from './radio/Radio.js';
export { RadioGroup, type RadioGroupProps } from './radio-group/RadioGroup.js';
export { Toggle, type ToggleProps } from './toggle/Toggle.js';

// Data display
export { Badge, type BadgeProps } from './badge/Badge.js';
export { Chip, type ChipProps } from './chip/Chip.js';
export { List, type ListProps } from './list/List.js';
export { ListItem, type ListItemProps } from './list-item/ListItem.js';
export { Icon, type IconProps } from './icon/Icon.js';
export { Tooltip, type TooltipProps } from './tooltip/Tooltip.js';
export { Skeleton, type SkeletonProps } from './skeleton/Skeleton.js';

// Feedback and surfaces
export { Notification, type NotificationProps } from './notification/Notification.js';
export { Card, type CardProps } from './card/Card.js';
export { Paper, type PaperProps } from './paper/Paper.js';
export { Accordion, type AccordionProps } from './accordion/Accordion.js';
export { AccordionItem, type AccordionItemProps } from './accordion-item/AccordionItem.js';
export { Dialog, type DialogProps } from './dialog/Dialog.js';
export { Drawer, type DrawerProps } from './drawer/Drawer.js';
export { Backdrop, type BackdropProps } from './backdrop/Backdrop.js';

// Navigation
export { Tabs, type TabsProps } from './tabs/Tabs.js';
export { Tab, type TabProps } from './tab/Tab.js';
export { TabPanel, type TabPanelProps } from './tab-panel/TabPanel.js';
export { Menu, type MenuProps } from './menu/Menu.js';
export { MenuItem, type MenuItemProps } from './menu-item/MenuItem.js';
export { Link, type LinkProps } from './link/Link.js';
export { Breadcrumbs, type BreadcrumbsProps } from './breadcrumbs/Breadcrumbs.js';
export { BreadcrumbItem, type BreadcrumbItemProps } from './breadcrumb-item/BreadcrumbItem.js';

// Shared API types (variants, defaults) from @kalads/spec.
export type * from '@kalads/spec';
