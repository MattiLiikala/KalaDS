import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Inputs/Icon Button',
  component: 'kds-icon-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Round button with only an icon. **\`label\` is required**: it's the button's accessible name.

Built on \`kds-button\`, so it has every variant, \`on-inverse\` and the knockout effect: on solid variants
the icon is cut out of the fill. Defaults to \`ghost\`. Wrap in \`kds-tooltip\` to show the label on hover.
`,
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'ghost', size: 'md', disabled: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-icon-button label="Search" variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      <kds-icon-search></kds-icon-search>
    </kds-icon-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <kds-stack direction="row" gap="md" align="center">
      <kds-icon-button label="Add" variant="primary"><kds-icon-plus></kds-icon-plus></kds-icon-button>
      <kds-icon-button label="Next" variant="secondary"><kds-icon-arrow-right></kds-icon-arrow-right></kds-icon-button>
      <kds-icon-button label="Close" variant="danger"><kds-icon-close></kds-icon-close></kds-icon-button>
      <kds-icon-button label="More options"><kds-icon-more-vertical></kds-icon-more-vertical></kds-icon-button>
    </kds-stack>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <kds-stack direction="row" gap="md" align="center">
      <kds-icon-button label="Add" variant="primary" size="sm"><kds-icon-plus></kds-icon-plus></kds-icon-button>
      <kds-icon-button label="Add" variant="primary" size="md"><kds-icon-plus></kds-icon-plus></kds-icon-button>
      <kds-icon-button label="Add" variant="primary" size="lg"><kds-icon-plus></kds-icon-plus></kds-icon-button>
    </kds-stack>
  `,
};

export const OnInverse: Story = {
  render: () => html`
    <kds-box bg="inverse" padding="lg" radius="lg">
      <kds-stack direction="row" gap="md" align="center">
        <kds-icon-button label="Add" variant="primary" on-inverse><kds-icon-plus></kds-icon-plus></kds-icon-button>
        <kds-icon-button label="Next" variant="secondary" on-inverse><kds-icon-arrow-right></kds-icon-arrow-right></kds-icon-button>
        <kds-icon-button label="Menu" on-inverse><kds-icon-menu></kds-icon-menu></kds-icon-button>
      </kds-stack>
    </kds-box>
  `,
};

export const WithTooltip: Story = {
  render: () => html`
    <kds-box padding-y="xl">
      <kds-tooltip content="Copy link">
        <kds-icon-button label="Copy link" variant="secondary"><kds-icon-external-link></kds-icon-external-link></kds-icon-button>
      </kds-tooltip>
    </kds-box>
  `,
};
