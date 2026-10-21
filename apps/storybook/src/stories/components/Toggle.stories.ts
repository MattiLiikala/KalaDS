import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Inputs/Toggle',
  component: 'kds-toggle',
  parameters: {
    docs: {
      description: {
        component: `
On/off switch for settings that take effect immediately (role="switch"). Off is an outlined track in the
control colour; on fills the track with the brand colour. Use a checkbox when the choice only applies
after a form is submitted.
`,
      },
    },
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { checked: false, disabled: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<kds-toggle ?checked=${args.checked} ?disabled=${args.disabled}>Dark mode</kds-toggle>`,
};

export const States: Story = {
  render: () => html`
    <kds-stack gap="md">
      <kds-toggle>Off</kds-toggle>
      <kds-toggle checked>On</kds-toggle>
      <kds-toggle disabled>Disabled, off</kds-toggle>
      <kds-toggle disabled checked>Disabled, on</kds-toggle>
    </kds-stack>
  `,
};

export const SettingsList: Story = {
  render: () => html`
    <kds-paper>
      <kds-stack gap="md">
        <kds-toggle checked>Wi-Fi</kds-toggle>
        <kds-divider flush decorative></kds-divider>
        <kds-toggle>Bluetooth</kds-toggle>
        <kds-divider flush decorative></kds-divider>
        <kds-toggle checked>Location services</kds-toggle>
      </kds-stack>
    </kds-paper>
  `,
};
