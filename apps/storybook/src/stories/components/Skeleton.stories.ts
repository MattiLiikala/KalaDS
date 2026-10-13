import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Feedback/Skeleton',
  component: 'kds-skeleton',
  parameters: {
    docs: {
      description: {
        component: `
Placeholder shapes shown while content loads. Skeletons are hidden from assistive technology: mark the
loading region with \`aria-busy="true"\` instead. The shimmer stops when the user prefers reduced motion.
`,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    lines: { control: { type: 'number', min: 1, max: 6 } },
  },
  args: { variant: 'text', lines: 3 },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<kds-skeleton variant=${args.variant} lines=${args.lines}></kds-skeleton>`,
};

export const CardPlaceholder: Story = {
  render: () => html`
    <kds-grid min="md" gap="lg" aria-busy="true">
      ${[1, 2].map(
        () => html`
          <kds-paper>
            <kds-stack gap="md">
              <kds-stack direction="row" gap="md" align="center">
                <kds-skeleton variant="circle"></kds-skeleton>
                <kds-skeleton width="50%"></kds-skeleton>
              </kds-stack>
              <kds-skeleton variant="rect"></kds-skeleton>
              <kds-skeleton lines="3"></kds-skeleton>
            </kds-stack>
          </kds-paper>
        `,
      )}
    </kds-grid>
  `,
};
