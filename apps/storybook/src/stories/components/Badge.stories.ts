import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'kds-badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Badges are outlined: no background fill, and a 1px border in the same colour as the text (the \`border\`
token references the variant's \`text\` token). The border is drawn inside the padding, so badges are the
same size as a filled badge would be.

Because there's no fill, the badge text sits directly on the surface behind it, and that surface must
contrast with the text (at least 4.5:1).

| Variant | white | \`bg-default\` | \`bg-subtle\` | \`bg-muted\` |
|---|---|---|---|---|
| default | 17.76 ✅ | 16.98 ✅ | 16.41 ✅ | 14.35 ✅ |
| primary | 9.71 ✅ | 9.29 ✅ | 8.97 ✅ | 7.85 ✅ |
| danger | 10.14 ✅ | 9.69 ✅ | 9.37 ✅ | 8.19 ✅ |
| warning | 8.05 ✅ | 7.70 ✅ | 7.43 ✅ | 6.50 ✅ |
| success | 9.55 ✅ | 9.13 ✅ | 8.82 ✅ | 7.72 ✅ |

All variants pass on every light surface. Don't place badges on inverse (dark) surfaces, where no variant passes.
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
