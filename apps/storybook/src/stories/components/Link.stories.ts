import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Navigation/Link',
  component: 'kds-link',
  parameters: {
    docs: {
      description: {
        component: `
Text link for navigation (use \`kds-button\` for actions). Always underlined, so it's recognisable without
relying on colour; the underline thickens on hover. Links with \`target="_blank"\` get an icon, a
screen-reader note "(opens in new tab)" and rel="noopener noreferrer".
`,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'subtle'] },
  },
  args: { variant: 'default' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<kds-link href="#" variant=${args.variant}>Read the documentation</kds-link>`,
};

export const InText: Story = {
  render: () => html`
    <kds-typography>
      By continuing you agree to the <kds-link href="#">terms of service</kds-link> and the
      <kds-link href="#" variant="subtle">privacy policy</kds-link>.
    </kds-typography>
  `,
};

export const External: Story = {
  render: () => html`<kds-link href="https://lit.dev" target="_blank">Lit documentation</kds-link>`,
};
