import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Inputs/Input',
  component: 'kds-input',
  parameters: {
    docs: {
      description: {
        component: `
Single-line text field with a visible label, optional helper text and an error message. It wraps a native
\`<input>\` but isn't part of form submission yet: read the value from the \`kds-input\` (every keystroke)
or \`kds-change\` (when committed, e.g. on blur) events, both with \`detail.value\`.
`,
      },
    },
  },
  // Fields fill their container; keep examples at a realistic form width.
  decorators: [(story) => html`<div style="max-width: var(--kds-semantic-size-xl)">${story()}</div>`],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
  },
  args: {
    label: 'Email address',
    placeholder: 'name@example.com',
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
    <kds-input
      label=${args.label}
      placeholder=${args.placeholder}
      type=${args.type}
      helper=${args.helper}
      error=${args.error}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></kds-input>
  `,
};

export const WithHelper: Story = {
  render: () => html`<kds-input label="Username" helper="3 to 20 characters: letters and numbers only"></kds-input>`,
};

export const WithError: Story = {
  render: () => html`
    <kds-input label="Email" type="email" value="anna@" error="Enter a full email address, like name@example.com."></kds-input>
  `,
};

export const Disabled: Story = {
  render: () => html`<kds-input label="Account ID" value="KDS-20931" disabled></kds-input>`,
};

export const Required: Story = {
  render: () => html`<kds-input label="Full name" required></kds-input>`,
};
