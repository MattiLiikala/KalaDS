import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Layout/Box',
  component: 'kds-box',
  parameters: {
    docs: {
      description: {
        component: `
Generic block for spacing and simple surfaces without writing CSS. Every attribute takes a token name:
\`padding\`, \`padding-x\`, \`padding-y\` and \`margin-y\` take spacing names; \`bg\` takes a background name
(\`inverse\` also switches to inverse text); \`radius\` takes a radius name; \`border\` adds the default border.
`,
      },
    },
  },
  argTypes: {
    padding: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    bg: { control: 'select', options: ['default', 'subtle', 'muted', 'inverse'] },
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'full'] },
    border: { control: 'boolean' },
  },
  args: { padding: 'lg', bg: 'subtle', radius: 'md', border: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-box padding=${args.padding} bg=${args.bg} radius=${args.radius} ?border=${args.border}>
      <kds-typography color=${args.bg === 'inverse' ? 'inverse' : 'default'}>Content inside a box.</kds-typography>
    </kds-box>
  `,
};

export const Backgrounds: Story = {
  render: () => html`
    <kds-stack gap="sm">
      ${(['default', 'subtle', 'muted', 'inverse'] as const).map(
        (bg) => html`<kds-box bg=${bg} padding="md" radius="md" ?border=${bg === 'default'}>
          <kds-typography variant="label" color=${bg === 'inverse' ? 'inverse' : 'default'}>bg="${bg}"</kds-typography>
        </kds-box>`,
      )}
    </kds-stack>
  `,
};
