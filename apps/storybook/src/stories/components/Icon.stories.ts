import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const ICONS = [
  'arrow-left',
  'arrow-right',
  'check',
  'check-circle',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'error',
  'external-link',
  'info',
  'menu',
  'minus',
  'more-vertical',
  'plus',
  'search',
  'warning',
];

const meta: Meta = {
  title: 'Components/Data Display/Icon',
  component: 'kds-icon',
  parameters: {
    docs: {
      description: {
        component: `
Renders any KalaDS icon by name with token-based size and colour: \`<kds-icon name="search">\`.

Without a \`label\` the icon is decorative and hidden from assistive technology. With a \`label\` it's
announced as an image with that name. Use labels only for icons that carry meaning on their own.
`,
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: ICONS },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['inherit', 'subtle', 'muted', 'brand', 'danger', 'warning', 'success'] },
    label: { control: 'text' },
  },
  args: { name: 'search', size: 'md', color: 'inherit', label: '' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<kds-icon name=${args.name} size=${args.size} color=${args.color} label=${args.label}></kds-icon>`,
};

export const Sizes: Story = {
  render: () => html`
    <kds-stack direction="row" gap="lg" align="center">
      <kds-icon name="info" size="sm"></kds-icon>
      <kds-icon name="info" size="md"></kds-icon>
      <kds-icon name="info" size="lg"></kds-icon>
    </kds-stack>
  `,
};

export const Colors: Story = {
  render: () => html`
    <kds-stack direction="row" gap="lg" align="center">
      ${['inherit', 'subtle', 'muted', 'brand', 'danger', 'warning', 'success'].map(
        (c) => html`<kds-icon name="check-circle" color=${c} label=${c}></kds-icon>`,
      )}
    </kds-stack>
  `,
};

export const AllIcons: Story = {
  render: () => html`
    <kds-grid min="xs" gap="lg">
      ${ICONS.map(
        (name) => html`
          <kds-stack gap="xs" align="center">
            <kds-icon name=${name} size="lg"></kds-icon>
            <kds-typography variant="caption" color="subtle">${name}</kds-typography>
          </kds-stack>
        `,
      )}
    </kds-grid>
  `,
};
