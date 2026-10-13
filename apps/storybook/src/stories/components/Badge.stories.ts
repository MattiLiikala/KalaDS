import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Data Display/Badge',
  component: 'kds-badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Small outlined label for status or metadata: no fill, and a 1px border in the text colour.

The text sits directly on the surface, so use badges on light surfaces only: every variant passes on
white, \`bg-default\`, \`bg-subtle\` and \`bg-muted\`. None pass on \`bg-inverse\`.
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger', 'warning', 'success'],
      description: 'Visual style variant',
    },
  },
  args: {
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<kds-badge variant=${args.variant}>Badge</kds-badge>`,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex; gap: var(--kds-semantic-spacing-sm); flex-wrap:wrap; align-items:center;">
      <kds-badge variant="default">Default</kds-badge>
      <kds-badge variant="primary">Primary</kds-badge>
      <kds-badge variant="danger">Danger</kds-badge>
      <kds-badge variant="warning">Warning</kds-badge>
      <kds-badge variant="success">Success</kds-badge>
    </div>
  `,
};

export const StatusExamples: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap: var(--kds-semantic-spacing-md);">
      <div style="display:flex; align-items:center; gap: var(--kds-semantic-spacing-sm);">
        <span style="font-family: var(--kds-font-family-base); color: var(--kds-semantic-text-default);">Server status</span>
        <kds-badge variant="success">Online</kds-badge>
      </div>
      <div style="display:flex; align-items:center; gap: var(--kds-semantic-spacing-sm);">
        <span style="font-family: var(--kds-font-family-base); color: var(--kds-semantic-text-default);">Deployment</span>
        <kds-badge variant="warning">Pending</kds-badge>
      </div>
      <div style="display:flex; align-items:center; gap: var(--kds-semantic-spacing-sm);">
        <span style="font-family: var(--kds-font-family-base); color: var(--kds-semantic-text-default);">Build</span>
        <kds-badge variant="danger">Failed</kds-badge>
      </div>
      <div style="display:flex; align-items:center; gap: var(--kds-semantic-spacing-sm);">
        <span style="font-family: var(--kds-font-family-base); color: var(--kds-semantic-text-default);">Version</span>
        <kds-badge variant="primary">v2.4.1</kds-badge>
      </div>
    </div>
  `,
};
