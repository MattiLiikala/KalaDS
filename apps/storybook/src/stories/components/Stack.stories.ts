import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const tile = (label: string) => html`<kds-box bg="muted" padding="md" radius="md"><kds-typography variant="label">${label}</kds-typography></kds-box>`;

const meta: Meta = {
  title: 'Components/Layout/Stack',
  component: 'kds-stack',
  parameters: {
    docs: {
      description: {
        component: `
Lays children out in a column or row. \`gap\` takes a spacing token name (\`none\`, \`xs\` … \`2xl\`), so
layouts never need raw values or inline styles.
`,
      },
    },
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['column', 'row'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap: { control: 'boolean' },
  },
  args: { direction: 'row', gap: 'md', align: 'center', justify: 'start', wrap: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-stack direction=${args.direction} gap=${args.gap} align=${args.align} justify=${args.justify} ?wrap=${args.wrap}>
      ${tile('One')} ${tile('Two')} ${tile('Three')}
    </kds-stack>
  `,
};

export const Column: Story = {
  render: () => html`<kds-stack gap="sm">${tile('First')} ${tile('Second')} ${tile('Third')}</kds-stack>`,
};

export const SpaceBetween: Story = {
  render: () => html`
    <kds-stack direction="row" justify="between" align="center">
      <kds-typography variant="h4">Projects</kds-typography>
      <kds-button size="sm">New project</kds-button>
    </kds-stack>
  `,
};
