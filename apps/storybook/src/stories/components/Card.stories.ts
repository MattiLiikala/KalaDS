import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Surfaces/Card',
  component: 'kds-card',
  parameters: {
    docs: {
      description: {
        component: `
Surface for grouping related content: 1px border and a crisp offset shadow. \`elevation\` sets the shadow
distance (1 low, 2 medium, 3 high, the default). Interactive cards press down into their shadow on hover,
moving by the same distance.
`,
      },
    },
  },
  argTypes: {
    elevation: { control: 'inline-radio', options: [1, 2, 3] },
    interactive: { control: 'boolean' },
  },
  args: {
    elevation: 3,
    interactive: false,
  },
};

export default meta;
type Story = StoryObj;

// Cards fill their container; keep examples at a realistic card width.
const narrow = (content: unknown) => html`<div style="max-width: var(--kds-semantic-size-xl)">${content}</div>`;

export const Default: Story = {
  render: (args) =>
    narrow(html`
      <kds-card elevation=${args.elevation} ?interactive=${args.interactive}>
        <kds-typography>Card content goes here. Cards group related information on one surface.</kds-typography>
      </kds-card>
    `),
};

export const Elevations: Story = {
  render: () => html`
    <kds-grid min="xs" gap="xl">
      ${[1, 2, 3].map(
        (e) => html`<kds-card elevation=${e} interactive><kds-typography variant="label">Elevation ${e}</kds-typography></kds-card>`,
      )}
    </kds-grid>
  `,
};

export const WithHeaderAndFooter: Story = {
  render: () =>
    narrow(html`
      <kds-card>
        <kds-typography slot="header" variant="h4" as="h3">Invite your team</kds-typography>
        <kds-typography color="subtle">Members can view and edit every project in this workspace.</kds-typography>
        <kds-stack slot="footer" direction="row" gap="sm" justify="end">
          <kds-button variant="ghost">Not now</kds-button>
          <kds-button variant="primary">Send invites</kds-button>
        </kds-stack>
      </kds-card>
    `),
};

/**
 * Interactive cards press down into their shadow on hover. The card itself can't take focus, so wrap it
 * in a link (like the cards on the Introduction page) to make it reachable with the keyboard.
 */
export const Interactive: Story = {
  render: () => html`
    <kds-grid columns="3" gap="md">
      ${['Reports', 'Projects', 'Team'].map(
        (title) => html`
          <kds-card interactive>
            <kds-typography variant="label" gutter>${title}</kds-typography>
            <kds-typography variant="body-sm" color="subtle">Open ${title.toLowerCase()}</kds-typography>
          </kds-card>
        `,
      )}
    </kds-grid>
  `,
};
