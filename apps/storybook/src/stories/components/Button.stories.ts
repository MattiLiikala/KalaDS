import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Inputs/Button',
  component: 'kds-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Fully rounded button. Solid variants (\`primary\`, \`secondary\`, \`danger\`) cut their label out of the fill
(**knockout**), so the surface behind the button shows through the text. Check where you place them: see
**Knockout on surfaces** below.
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
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button variant="primary">Primary</kds-button>
      <kds-button variant="secondary">Secondary</kds-button>
      <kds-button variant="danger">Danger</kds-button>
      <kds-button variant="ghost">Ghost</kds-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button size="sm">Small</kds-button>
      <kds-button size="md">Medium</kds-button>
      <kds-button size="lg">Large</kds-button>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button disabled variant="primary">Primary</kds-button>
      <kds-button disabled variant="secondary">Secondary</kds-button>
      <kds-button disabled variant="danger">Danger</kds-button>
      <kds-button disabled variant="ghost">Ghost</kds-button>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
      <kds-button variant="primary">
        <kds-icon-plus slot="start" label="add"></kds-icon-plus>
        Add item
      </kds-button>
      <kds-button variant="secondary">
        Next
        <kds-icon-arrow-right slot="end" label="next"></kds-icon-arrow-right>
      </kds-button>
    </div>
  `,
};

const surface = (bg: string, label: string, onInverse = false) => html`
  <div
    style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap; padding: var(--kds-semantic-padding-lg); border-radius: var(--kds-semantic-radius-lg); background: var(${bg}); color: var(--kds-semantic-text-${bg.includes('inverse') ? 'muted' : 'subtle'}); font-family: var(--kds-font-family-base); font-size: var(--kds-font-size-100);"
  >
    <kds-button variant="primary" ?on-inverse=${onInverse}>
      <kds-icon-plus slot="start" label="add"></kds-icon-plus>
      Primary
    </kds-button>
    <kds-button variant="secondary" ?on-inverse=${onInverse}>Secondary</kds-button>
    <kds-button variant="danger" ?on-inverse=${onInverse}>Danger</kds-button>
    <kds-button variant="ghost" ?on-inverse=${onInverse}>Ghost</kds-button>
    <span>${label}</span>
  </div>
`;

/**
 * The knockout label *is* the surface colour, so a solid button is only readable on a surface that
 * contrasts with its fill in every state.
 *
 * | Surface | Default fills | `on-inverse` fills |
 * |---|---|---|
 * | white, `bg-default`, `bg-subtle`, `bg-muted` | ✅ | ❌ |
 * | `bg-inverse`, neutral 800–900 | ❌ | ✅ |
 * | neutral 500–700, primary/secondary-tinted panels | ❌ | ❌ use `ghost` |
 * | images, gradients, patterns | ❌ | ❌ |
 *
 * Ghost buttons use regular text and work on any light surface (with `on-inverse` on inverse ones).
 * In forced-colours mode the knockout is turned off and the label uses the system button text colour.
 */
export const KnockoutOnSurfaces: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:1rem;">
      ${surface('--kds-semantic-bg-default', 'bg-default')}
      ${surface('--kds-semantic-bg-subtle', 'bg-subtle')}
      ${surface('--kds-semantic-bg-muted', 'bg-muted')}
      ${surface('--kds-semantic-bg-inverse', 'bg-inverse with on-inverse', true)}
      ${surface('--kds-semantic-bg-inverse', 'bg-inverse without on-inverse ❌ fails the contrast rule')}
    </div>
  `,
};

/**
 * Add `on-inverse` whenever a button sits on an inverse surface (`bg-inverse`); it works with every
 * variant and switches to the light fills. The name is theme-relative, so a dark theme can swap the
 * tokens and the same markup keeps working.
 *
 * ```html
 * <kds-button variant="primary" on-inverse>Save</kds-button>
 * ```
 */
export const OnInverse: Story = {
  render: () => html`
    <div style="display:flex; flex-direction:column; gap:1rem;">
      ${surface('--kds-semantic-bg-inverse', 'on-inverse', true)}
      <div
        style="display:flex; gap:1rem; align-items:center; padding: var(--kds-semantic-padding-lg); border-radius: var(--kds-semantic-radius-lg); background: var(--kds-semantic-bg-inverse);"
      >
        <kds-button variant="primary" on-inverse disabled>Disabled</kds-button>
        <kds-button variant="secondary" on-inverse size="sm">Small</kds-button>
        <kds-button variant="primary" on-inverse size="lg">Large</kds-button>
      </div>
    </div>
  `,
};
