import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Inputs/Checkbox',
  component: 'kds-checkbox',
  parameters: {
    docs: {
      description: {
        component: `
A native checkbox with the KalaDS look: 2px control border, accent fill when checked. Supports the
indeterminate (mixed) state for "select all", and submits its \`value\` with forms when checked.

Group related checkboxes with **\`kds-checkbox-group\`**, which gives them a shared, announced label plus
helper or error text. Errors always go on the group, never on a single checkbox.
`,
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { checked: false, indeterminate: false, disabled: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-checkbox ?checked=${args.checked} ?indeterminate=${args.indeterminate} ?disabled=${args.disabled}>
      Email me about product updates
    </kds-checkbox>
  `,
};

export const States: Story = {
  render: () => html`
    <kds-stack gap="sm">
      <kds-checkbox>Unchecked</kds-checkbox>
      <kds-checkbox checked>Checked</kds-checkbox>
      <kds-checkbox indeterminate>Indeterminate</kds-checkbox>
      <kds-checkbox disabled>Disabled</kds-checkbox>
      <kds-checkbox disabled checked>Disabled, checked</kds-checkbox>
    </kds-stack>
  `,
};

export const Group: Story = {
  render: () => html`
    <kds-checkbox-group label="Notifications" helper="Choose how we contact you.">
      <kds-checkbox name="notify" value="email" checked>Email</kds-checkbox>
      <kds-checkbox name="notify" value="sms">Text message</kds-checkbox>
      <kds-checkbox name="notify" value="push">Push notification</kds-checkbox>
    </kds-checkbox-group>
  `,
};

export const HorizontalGroupWithError: Story = {
  render: () => html`
    <kds-checkbox-group label="Toppings" orientation="horizontal" error="Pick at least one topping." required>
      <kds-checkbox>Cheese</kds-checkbox>
      <kds-checkbox>Mushrooms</kds-checkbox>
      <kds-checkbox>Olives</kds-checkbox>
    </kds-checkbox-group>
  `,
};

/** The parent checkbox is indeterminate while only some children are checked. */
export const SelectAll: Story = {
  render: () => {
    const sync = (e: Event) => {
      const group = (e.currentTarget as HTMLElement);
      const all = group.querySelector<HTMLElement & { checked: boolean; indeterminate: boolean }>('#all')!;
      const items = [...group.querySelectorAll<HTMLElement & { checked: boolean }>('.item')];
      if ((e.target as HTMLElement).id === 'all') items.forEach((i) => (i.checked = all.checked));
      const count = items.filter((i) => i.checked).length;
      all.checked = count === items.length;
      all.indeterminate = count > 0 && count < items.length;
    };
    return html`
      <kds-checkbox-group label="Files" @kds-change=${sync}>
        <kds-checkbox id="all" indeterminate>Select all</kds-checkbox>
        <kds-box padding-x="lg">
          <kds-stack gap="sm">
            <kds-checkbox class="item" checked>report.pdf</kds-checkbox>
            <kds-checkbox class="item">notes.txt</kds-checkbox>
            <kds-checkbox class="item">photo.jpg</kds-checkbox>
          </kds-stack>
        </kds-box>
      </kds-checkbox-group>
    `;
  },
};
