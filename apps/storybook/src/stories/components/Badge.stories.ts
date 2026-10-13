import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Data Display/Badge',
  component: 'kds-badge',
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
    <kds-stack direction="row" gap="sm" align="center" wrap>
      <kds-badge variant="default">Default</kds-badge>
      <kds-badge variant="primary">Primary</kds-badge>
      <kds-badge variant="danger">Danger</kds-badge>
      <kds-badge variant="warning">Warning</kds-badge>
      <kds-badge variant="success">Success</kds-badge>
    </kds-stack>
  `,
};

const STATUSES = [
  ['Server status', 'success', 'Online'],
  ['Deployment', 'warning', 'Pending'],
  ['Build', 'danger', 'Failed'],
  ['Version', 'primary', 'v2.4.1'],
];

export const StatusExamples: Story = {
  render: () => html`
    <kds-stack gap="md">
      ${STATUSES.map(
        ([label, variant, value]) => html`
          <kds-stack direction="row" gap="sm" align="center">
            <kds-typography>${label}</kds-typography>
            <kds-badge variant=${variant}>${value}</kds-badge>
          </kds-stack>
        `,
      )}
    </kds-stack>
  `,
};
