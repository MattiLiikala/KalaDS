import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Surfaces/Paper',
  component: 'kds-paper',
  parameters: {
    docs: {
      description: {
        component: `
Plain surface: background, 1px border and a crisp offset shadow. \`elevation\` sets the shadow level:
0 none, 1 low (the default), 2 medium, 3 high (the card default).
Use \`kds-card\` when you need header, body and footer sections.
`,
      },
    },
  },
  argTypes: {
    elevation: { control: 'inline-radio', options: [0, 1, 2, 3] },
    variant: { control: 'inline-radio', options: ['outlined', 'flat'] },
    padding: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: { elevation: 1, variant: 'outlined', padding: 'lg' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-paper elevation=${args.elevation} variant=${args.variant} padding=${args.padding}>
      <kds-typography>Paper is a plain surface for grouping content.</kds-typography>
    </kds-paper>
  `,
};

export const Elevations: Story = {
  render: () => html`
    <kds-grid min="xs" gap="xl">
      ${[0, 1, 2, 3].map(
        (e) => html`<kds-paper elevation=${e}><kds-typography variant="label">Elevation ${e}</kds-typography></kds-paper>`,
      )}
    </kds-grid>
  `,
};

export const Flat: Story = {
  render: () => html`
    <kds-box bg="subtle" padding="lg" radius="lg">
      <kds-paper variant="flat" elevation="0"><kds-typography>Flat paper on a subtle surface.</kds-typography></kds-paper>
    </kds-box>
  `,
};
