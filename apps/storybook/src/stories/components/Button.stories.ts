import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Inputs/Button',
  component: 'kds-button',
  parameters: {
    docs: {
      description: {
        component: `
Fully rounded button. Solid variants (\`primary\`, \`secondary\`, \`danger\`) have a filled background;
\`ghost\` has none. On inverse surfaces, add \`on-inverse\`.
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    onInverse: {
      name: 'on-inverse',
      control: 'boolean',
      description: 'Use fills made for inverse surfaces (bg-inverse)',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    onInverse: false,
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: { variant: 'primary' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?on-inverse=${args.onInverse}>
      Button
    </kds-button>`,
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?on-inverse=${args.onInverse}>
      Button
    </kds-button>`,
};

export const Danger: Story = {
  args: { variant: 'danger' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?on-inverse=${args.onInverse}>
      Delete
    </kds-button>`,
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  render: (args) =>
    html`<kds-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?on-inverse=${args.onInverse}>
      Cancel
    </kds-button>`,
};

export const AllVariants: Story = {
  render: () => html`
    <kds-stack direction="row" gap="md" align="center" wrap>
      <kds-button variant="primary">Primary</kds-button>
      <kds-button variant="secondary">Secondary</kds-button>
      <kds-button variant="danger">Danger</kds-button>
      <kds-button variant="ghost">Ghost</kds-button>
    </kds-stack>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <kds-stack direction="row" gap="md" align="center" wrap>
      <kds-button size="sm">Small</kds-button>
      <kds-button size="md">Medium</kds-button>
      <kds-button size="lg">Large</kds-button>
    </kds-stack>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <kds-stack direction="row" gap="md" align="center" wrap>
      <kds-button disabled variant="primary">Primary</kds-button>
      <kds-button disabled variant="secondary">Secondary</kds-button>
      <kds-button disabled variant="danger">Danger</kds-button>
      <kds-button disabled variant="ghost">Ghost</kds-button>
    </kds-stack>
  `,
};

/** Icons next to a label are decorative: they don't need a `label` of their own. */
export const WithIcons: Story = {
  render: () => html`
    <kds-stack direction="row" gap="md" align="center" wrap>
      <kds-button variant="primary">
        <kds-icon-plus slot="start"></kds-icon-plus>
        Add item
      </kds-button>
      <kds-button variant="secondary">
        Next
        <kds-icon-arrow-right slot="end"></kds-icon-arrow-right>
      </kds-button>
    </kds-stack>
  `,
};

type Surface = 'default' | 'subtle' | 'muted' | 'inverse';

const surface = (bg: Surface, label: string, onInverse = false) => html`
  <kds-box bg=${bg} padding="lg" radius="lg" ?border=${bg === 'default'}>
    <kds-stack direction="row" gap="md" align="center" wrap>
      <kds-button variant="primary" ?on-inverse=${onInverse}>
        <kds-icon-plus slot="start"></kds-icon-plus>
        Primary
      </kds-button>
      <kds-button variant="secondary" ?on-inverse=${onInverse}>Secondary</kds-button>
      <kds-button variant="danger" ?on-inverse=${onInverse}>Danger</kds-button>
      <kds-button variant="ghost" ?on-inverse=${onInverse}>Ghost</kds-button>
      <kds-typography variant="caption" color=${bg === 'inverse' ? 'inverse' : 'subtle'}>${label}</kds-typography>
    </kds-stack>
  </kds-box>
`;

/**
 * A solid button needs a surface its fill stands out from. The last row fails: the default fills blend
 * into the inverse surface. The full rules are in **Guidelines/Buttons and Surfaces**.
 */
export const OnSurfaces: Story = {
  render: () => html`
    <kds-stack gap="md">
      ${surface('default', 'bg-default')}
      ${surface('subtle', 'bg-subtle')}
      ${surface('muted', 'bg-muted')}
      ${surface('inverse', 'bg-inverse with on-inverse', true)}
      ${surface('inverse', 'bg-inverse without on-inverse: fails')}
    </kds-stack>
  `,
};

/**
 * Add `on-inverse` whenever a button sits on an inverse surface (`bg-inverse`); it works with every
 * variant and switches to the light fills.
 */
export const OnInverse: Story = {
  render: () => html`
    <kds-stack gap="md">
      ${surface('inverse', 'on-inverse', true)}
      <kds-box bg="inverse" padding="lg" radius="lg">
        <kds-stack direction="row" gap="md" align="center" wrap>
          <kds-button variant="primary" on-inverse disabled>Disabled</kds-button>
          <kds-button variant="secondary" on-inverse size="sm">Small</kds-button>
          <kds-button variant="primary" on-inverse size="lg">Large</kds-button>
        </kds-stack>
      </kds-box>
    </kds-stack>
  `,
};
