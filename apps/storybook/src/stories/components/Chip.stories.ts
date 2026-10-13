import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Data Display/Chip',
  component: 'kds-chip',
  parameters: {
    docs: {
      description: {
        component: `
Compact element for filters, choices and entered values. Outlined like \`kds-badge\`, but pill-shaped
like buttons because chips are interactive:

- **Static**: plain text (like a badge, but pill-shaped).
- **\`selectable\`**: a toggle button (aria-pressed). Hover previews the selected look in a lighter tint.
- **\`removable\`**: adds a remove button named "Remove <chip text>".

\`variant\` sets the colour: **neutral** (default) is grey at rest and uses primary on hover and when
selected; **primary**, **secondary**, **danger**, **warning**, **success** and **info** show their colour
at rest too.
`,
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'primary', 'secondary', 'danger', 'warning', 'success', 'info'] },
    selectable: { control: 'boolean' },
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'neutral', selectable: true, selected: false, removable: false, disabled: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-chip variant=${args.variant} ?selectable=${args.selectable} ?selected=${args.selected} ?removable=${args.removable} ?disabled=${args.disabled}>
      Vegetarian
    </kds-chip>
  `,
};

const VARIANTS = ['neutral', 'primary', 'secondary', 'danger', 'warning', 'success', 'info'];

/** Each row: at rest, selected, static, and removable. Hover the first chip to see the hover tint. */
export const Variants: Story = {
  render: () => html`
    <kds-stack gap="sm">
      ${VARIANTS.map(
        (v) => html`
          <kds-stack direction="row" gap="sm" wrap>
            <kds-chip variant=${v} selectable>${v}</kds-chip>
            <kds-chip variant=${v} selectable selected>Selected</kds-chip>
            <kds-chip variant=${v}>Static</kds-chip>
            <kds-chip variant=${v} removable>Removable</kds-chip>
          </kds-stack>
        `,
      )}
    </kds-stack>
  `,
};

export const FilterChips: Story = {
  render: () => html`
    <kds-stack direction="row" gap="sm" wrap>
      <kds-chip selectable selected>All</kds-chip>
      <kds-chip selectable>Open</kds-chip>
      <kds-chip selectable>In review</kds-chip>
      <kds-chip selectable>Closed</kds-chip>
      <kds-chip selectable disabled>Archived</kds-chip>
    </kds-stack>
  `,
};

export const RemovableTags: Story = {
  render: () => {
    const remove = (e: Event) => (e.target as HTMLElement).remove();
    return html`
      <kds-stack direction="row" gap="sm" wrap @kds-remove=${remove}>
        <kds-chip removable>Design</kds-chip>
        <kds-chip removable>Accessibility</kds-chip>
        <kds-chip removable>Web components</kds-chip>
        <kds-chip removable disabled>Locked</kds-chip>
      </kds-stack>
    `;
  },
};

export const WithIcon: Story = {
  render: () => html`
    <kds-stack direction="row" gap="sm">
      <kds-chip><kds-icon-check-circle slot="start"></kds-icon-check-circle>Verified</kds-chip>
      <kds-chip selectable selected><kds-icon-search slot="start"></kds-icon-search>Saved search</kds-chip>
    </kds-stack>
  `,
};
