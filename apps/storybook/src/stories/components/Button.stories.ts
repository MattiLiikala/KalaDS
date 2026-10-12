import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Button',
  component: 'kds-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Buttons are fully rounded. Solid variants (\`primary\`, \`secondary\`, \`danger\`) render their label and icons as a
**knockout**: the text is cut out of the button fill with a mask, so the surface behind the button shows
through the letters. This works on any surface without the component needing to know its colour.

### On inverse surfaces: use \`on-inverse\`

Add the \`on-inverse\` attribute when a button sits on an inverse surface (\`bg-inverse\`). It works with every variant.
The name is relative to the theme, not to lightness: in the light theme the inverse surface is dark, so \`on-inverse\`
uses the light fills (the 300 step, getting lighter on hover and press) and the knocked-out text still has strong contrast.
A dark theme would swap these tokens, so the same markup keeps working.

\`\`\`html
<kds-button variant="primary" on-inverse>Save</kds-button>
\`\`\`

### Contrast rule: the button fill must contrast with the surface behind it

Because knockout text *is* the surface colour, text legibility depends entirely on the contrast between
the button fill and the surface the button sits on.

- The surface directly behind a solid button **must have at least 4.5:1 contrast** with the button fill
  in every state: default, hover and active (\`bg\`, \`bg-hover\`, \`bg-active\`).
- On light surfaces use the default fills. On inverse surfaces (\`bg-inverse\`, and other surfaces as dark as neutral 800–900) use \`on-inverse\`.
- Don't place solid buttons on images, gradients or patterned surfaces. Every pixel behind the label has to pass.
- Don't place solid buttons on a surface close to the button colour (for example a primary button on a primary-tinted panel).
- Mid-tone surfaces (around neutral 500–700) pass with neither fill set. Use a ghost button there, or change the surface.

**Default fills on light surfaces**

| Fill | white | \`bg-default\` | \`bg-subtle\` | \`bg-muted\` |
|---|---|---|---|---|
| primary \`bg\` / hover / active | 5.75 / 7.50 / 9.71 | 5.50 / 7.17 / 9.29 | 5.32 / 6.93 / 8.97 | 4.65 / 6.06 / 7.85 |
| secondary \`bg\` / hover / active | 5.70 / 7.11 / 8.51 | 5.45 / 6.80 / 8.14 | 5.26 / 6.57 / 7.86 | 4.60 / 5.74 / 6.88 |
| danger \`bg\` / hover / active | 6.03 / 7.76 / 10.14 | 5.76 / 7.43 / 9.69 | 5.57 / 7.17 / 9.37 | 4.87 / 6.27 / 8.19 |

**\`on-inverse\` fills on inverse surfaces (light theme)**

| Fill | \`bg-inverse\` (neutral 900) | neutral 800 |
|---|---|---|
| primary \`bg\` / hover / active | 8.53 / 12.25 / 15.48 | 7.00 / 10.06 / 12.71 |
| secondary \`bg\` / hover / active | 7.49 / 11.40 / 15.14 | 6.15 / 9.35 / 12.42 |
| danger \`bg\` / hover / active | 8.57 / 12.27 / 15.49 | 7.04 / 10.07 / 12.71 |

The default fills fail on inverse surfaces (about 3:1 or lower), so never skip \`on-inverse\` there.
Ghost buttons use regular text. With \`on-inverse\` their text switches to primary 300 (8.53:1 on \`bg-inverse\`).
In Windows high-contrast (forced colours) mode, the knockout is turned off and the label uses the system button text colour.
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
 * Knockout text shows the surface behind the button. Check that the fill contrasts with every surface you
 * place a solid button on. The last row shows default fills on the inverse surface, which fails the contrast rule.
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

/** Use `on-inverse` whenever a button sits on an inverse surface (`bg-inverse`). */
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
