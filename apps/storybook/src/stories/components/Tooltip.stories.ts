import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Data Display/Tooltip',
  component: 'kds-tooltip',
  parameters: {
    docs: {
      description: {
        component: `
Short text shown when the trigger is hovered or focused. Wrap the trigger:
\`<kds-tooltip content="…"><trigger></kds-tooltip>\`.

- Linked to the trigger with aria-describedby, so it's announced with it.
- Can be hovered without closing and closes on **Escape** (WCAG 1.4.13).
- Shown in the browser's top layer, so it's never clipped; flips side when there isn't room.
- Keep it to a few words, and never put links or buttons in a tooltip.
`,
      },
    },
  },
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
  },
  args: { content: 'Search the catalogue', placement: 'top' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-box padding="2xl">
      <kds-tooltip content=${args.content} placement=${args.placement}>
        <kds-icon-button label="Search" variant="secondary"><kds-icon-search></kds-icon-search></kds-icon-button>
      </kds-tooltip>
    </kds-box>
  `,
};

export const Placements: Story = {
  render: () => html`
    <kds-box padding="2xl">
      <kds-stack direction="row" gap="lg" justify="center">
        ${(['top', 'bottom', 'left', 'right'] as const).map(
          (p) => html`<kds-tooltip content="Tooltip on ${p}" placement=${p}>
            <kds-button variant="secondary">${p}</kds-button>
          </kds-tooltip>`,
        )}
      </kds-stack>
    </kds-box>
  `,
};

export const OnText: Story = {
  render: () => html`
    <kds-typography>
      Your changes are saved to the
      <kds-tooltip content="Kept for 30 days"><kds-link href="#">recycle bin</kds-link></kds-tooltip>.
    </kds-typography>
  `,
};
