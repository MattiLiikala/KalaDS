import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const meta: Meta = {
  title: 'Components/Layout/Container',
  component: 'kds-container',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The container centres your content horizontally. It's the most basic layout element: no background,
border or shadow, just a maximum width (\`sm\` 640px, \`md\` 768px, \`lg\` 1024px by default, \`xl\` 1280px,
or \`full\`) and side padding so content never touches the viewport edge. \`flush\` removes the padding.
`,
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', 'full'] },
  },
  args: { size: 'md' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-container size=${args.size}>
      <kds-typography variant="h4" gutter>Container: ${args.size}</kds-typography>
      <kds-typography gutter>
        This text is centred and stops growing at the container's maximum width. Resize the canvas to see the
        side padding keep it off the edges on narrow screens.
      </kds-typography>
      <kds-typography color="subtle">
        Use a container once per page section, and put cards, grids and other surfaces inside it.
      </kds-typography>
    </kds-container>
  `,
};
