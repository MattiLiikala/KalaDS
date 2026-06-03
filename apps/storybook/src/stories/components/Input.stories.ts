import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Input',
  component: 'kds-input',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Visible label text' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    value: { control: 'text', description: 'Current value' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'Input type',
    },
    helper: { control: 'text', description: 'Helper text below the input' },
    error: { control: 'text', description: 'Error message (sets error state when non-empty)' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    label: 'Email address',
    placeholder: 'Enter your email',
    type: 'email',
    helper: '',
    error: '',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width: 400px;">
      <kds-input
        label=${args.label}
        placeholder=${args.placeholder}
        type=${args.type}
        helper=${args.helper}
        error=${args.error}
        ?disabled=${args.disabled}
        ?required=${args.required}
      ></kds-input>
    </div>
  `,
};

export const WithHelper: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <kds-input
        label="Username"
        placeholder="Enter username"
        helper="Must be 3-20 characters, letters and numbers only"
      ></kds-input>
    </div>
  `,
};

export const WithError: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <kds-input
        label="Email"
        value="invalid-email"
        error="Please enter a valid email address"
      ></kds-input>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <kds-input
        label="Read-only field"
        value="Cannot be changed"
        disabled
      ></kds-input>
    </div>
  `,
};

export const Required: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <kds-input
        label="Full name"
        placeholder="Required field"
        required
      ></kds-input>
    </div>
  `,
};
