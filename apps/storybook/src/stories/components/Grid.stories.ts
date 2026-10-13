import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const tile = (label: string) => html`<kds-box bg="muted" padding="md" radius="md"><kds-typography variant="label">${label}</kds-typography></kds-box>`;

const meta: Meta = {
  title: 'Components/Layout/Grid',
  component: 'kds-grid',
  subcomponents: { 'kds-grid-item': 'kds-grid-item' },
  parameters: {
    docs: {
      description: {
        component: `
CSS grid. Set \`columns\` (1–12) for a fixed grid, or \`min\` (a size token name) for as many columns as
fit, each at least that wide: responsive without breakpoints. Wrap a child in **\`kds-grid-item\`** to
span several columns (\`span\`) or the full row (\`full\`).
`,
      },
    },
  },
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 12 } },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
  },
  args: { columns: 3, gap: 'md' },
};

export default meta;
type Story = StoryObj;

export const FixedColumns: Story = {
  render: (args) => html`
    <kds-grid columns=${args.columns} gap=${args.gap}>
      ${[1, 2, 3, 4, 5, 6].map((i) => tile(`Cell ${i}`))}
    </kds-grid>
  `,
};

export const Responsive: Story = {
  name: 'Responsive (min)',
  render: () => html`
    <kds-grid min="sm" gap="lg">
      ${[1, 2, 3, 4, 5].map((i) => html`<kds-card><kds-typography>Card ${i}</kds-typography></kds-card>`)}
    </kds-grid>
  `,
};

export const Spanning: Story = {
  render: () => html`
    <kds-grid columns="4" gap="md">
      <kds-grid-item full>${tile('Full row')}</kds-grid-item>
      <kds-grid-item span="3">${tile('Span 3')}</kds-grid-item>
      ${tile('1')}
      ${tile('1')}
      <kds-grid-item span="2">${tile('Span 2')}</kds-grid-item>
      ${tile('1')}
    </kds-grid>
  `,
};
