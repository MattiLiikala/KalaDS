import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Inputs/Select',
  component: 'kds-select',
  parameters: {
    docs: {
      description: {
        component: `
Pick one option from a list. Looks like \`kds-input\` (same borders, focus and error states) and is built
on a native \`<select>\`, so the platform picker and keyboard behaviour are kept, including on mobile.
Write normal \`<option>\` and \`<optgroup>\` children. For long lists or type-to-filter, use
\`kds-autocomplete\`.
`,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helper: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: { label: 'Country', placeholder: 'Select a country', helper: '', error: '', disabled: false, required: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-box>
      <kds-select
        label=${args.label}
        placeholder=${args.placeholder}
        helper=${args.helper}
        error=${args.error}
        ?disabled=${args.disabled}
        ?required=${args.required}
      >
        <option value="fi">Finland</option>
        <option value="se">Sweden</option>
        <option value="no">Norway</option>
        <option value="dk">Denmark</option>
      </kds-select>
    </kds-box>
  `,
};

export const WithGroups: Story = {
  render: () => html`
    <kds-select label="Time zone" value="europe/helsinki">
      <optgroup label="Europe">
        <option value="europe/helsinki">Helsinki</option>
        <option value="europe/london">London</option>
      </optgroup>
      <optgroup label="America">
        <option value="america/new_york">New York</option>
        <option value="america/los_angeles">Los Angeles</option>
      </optgroup>
    </kds-select>
  `,
};

export const States: Story = {
  render: () => html`
    <kds-stack gap="lg">
      <kds-select label="With helper" helper="We use this for shipping estimates.">
        <option>Option one</option>
        <option>Option two</option>
      </kds-select>
      <kds-select label="With error" error="This field is required." placeholder="Choose…" required>
        <option>Option one</option>
      </kds-select>
      <kds-select label="Disabled" disabled>
        <option>Can't change this</option>
      </kds-select>
    </kds-stack>
  `,
};
