import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Inputs/Radio Group',
  component: 'kds-radio-group',
  subcomponents: { 'kds-radio': 'kds-radio' },
  parameters: {
    docs: {
      description: {
        component: `
Choose exactly one option. **\`kds-radio\`** elements always go inside a **\`kds-radio-group\`**, which owns
the selection, the form value and keyboard behaviour: Tab moves into and out of the group, arrow keys
move between options and select them.

Native radios can't be used inside separate shadow roots (they wouldn't group), so the radios use
role="radio" and the group manages a roving tabindex.
`,
      },
    },
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: { orientation: 'vertical', disabled: false, error: '' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-radio-group
      label="Shipping"
      name="shipping"
      value="standard"
      helper="Express arrives the next working day."
      orientation=${args.orientation}
      ?disabled=${args.disabled}
      error=${args.error}
    >
      <kds-radio value="standard">Standard (free)</kds-radio>
      <kds-radio value="express">Express (€9)</kds-radio>
      <kds-radio value="pickup" disabled>Store pickup (unavailable)</kds-radio>
    </kds-radio-group>
  `,
};

export const Horizontal: Story = {
  render: () => html`
    <kds-radio-group label="Size" value="m" orientation="horizontal">
      <kds-radio value="s">Small</kds-radio>
      <kds-radio value="m">Medium</kds-radio>
      <kds-radio value="l">Large</kds-radio>
    </kds-radio-group>
  `,
};

export const WithError: Story = {
  render: () => html`
    <kds-radio-group label="Payment method" required error="Choose a payment method.">
      <kds-radio value="card">Card</kds-radio>
      <kds-radio value="invoice">Invoice</kds-radio>
    </kds-radio-group>
  `,
};
