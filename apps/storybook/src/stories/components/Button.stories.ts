import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Button',
  component: 'kds-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: { variant: 'primary' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      Button
    </kds-button>`,
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      Button
    </kds-button>`,
};

export const Danger: Story = {
  args: { variant: 'danger' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      Delete
    </kds-button>`,
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      Cancel
    </kds-button>`,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button variant="primary">Primary</kds-button>
      <kds-button variant="secondary">Secondary</kds-button>
      <kds-button variant="danger">Danger</kds-button>
      <kds-button variant="ghost">Ghost</kds-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button size="sm">Small</kds-button>
      <kds-button size="md">Medium</kds-button>
      <kds-button size="lg">Large</kds-button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button disabled variant="primary">Primary</kds-button>
      <kds-button disabled variant="secondary">Secondary</kds-button>
      <kds-button disabled variant="danger">Danger</kds-button>
      <kds-button disabled variant="ghost">Ghost</kds-button>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button variant="primary">
        <kds-icon-plus slot="start" label="add"></kds-icon-plus>
        Add item
      </kds-button>
      <kds-button variant="secondary">
        Next
        <kds-icon-arrow-right slot="end" label="next"></kds-icon-arrow-right>
      </kds-button>
    </div>
  `,
};
