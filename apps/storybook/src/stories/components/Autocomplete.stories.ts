import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Lime', 'Mango', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry', 'Strawberry', 'Watermelon'];

const meta: Meta = {
  title: 'Components/Inputs/Autocomplete',
  component: 'kds-autocomplete',
  parameters: {
    docs: {
      description: {
        component: `
Text field that suggests matching options as you type (WAI-ARIA combobox). Typing filters the
\`<option>\` children; **↓/↑** move through matches, **Enter** picks, **Escape** closes the list (or clears
the text when it's already closed). Leaving the field restores the selected option's label unless the
text exactly matches another option.

The list opens in the browser's top layer, so it's never clipped by \`overflow: hidden\` parents.
`,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: { label: 'Favourite fruit', placeholder: 'Start typing…', disabled: false, error: '' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-autocomplete label=${args.label} placeholder=${args.placeholder} ?disabled=${args.disabled} error=${args.error}>
      ${fruits.map((f) => html`<option value=${f.toLowerCase()}>${f}</option>`)}
    </kds-autocomplete>
  `,
};

export const Preselected: Story = {
  render: () => html`
    <kds-autocomplete label="Favourite fruit" value="mango" helper="Includes a disabled option.">
      ${fruits.map((f) => html`<option value=${f.toLowerCase()} ?disabled=${f === 'Lime'}>${f}</option>`)}
    </kds-autocomplete>
  `,
};
