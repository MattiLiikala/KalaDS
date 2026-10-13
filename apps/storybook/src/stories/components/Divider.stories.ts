import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Data Display/Divider',
  component: 'kds-divider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Thin 1px line in the default border colour, separating groups of content. Horizontal dividers can carry
a short label. Set \`decorative\` when the line is purely visual, to hide it from assistive technology.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Horizontal: Story = {
  render: () => html`
    <kds-box>
      <kds-typography>Content above the divider.</kds-typography>
      <kds-divider></kds-divider>
      <kds-typography>Content below the divider.</kds-typography>
    </kds-box>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <kds-stack gap="none">
      <kds-button variant="secondary">Continue with email</kds-button>
      <kds-divider>or</kds-divider>
      <kds-button variant="ghost">Continue as guest</kds-button>
    </kds-stack>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <kds-stack direction="row" align="stretch" gap="none">
      <kds-link href="#">Profile</kds-link>
      <kds-divider orientation="vertical"></kds-divider>
      <kds-link href="#">Settings</kds-link>
      <kds-divider orientation="vertical"></kds-divider>
      <kds-link href="#">Sign out</kds-link>
    </kds-stack>
  `,
};
