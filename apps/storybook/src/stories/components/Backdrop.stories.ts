import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

type Backdrop = HTMLElement & { open: boolean };

const meta: Meta = {
  title: 'Components/Feedback/Backdrop',
  component: 'kds-backdrop',
  parameters: {
    docs: {
      description: {
        component: `
Dims the page behind temporary content, for example while something loads. Covers the viewport with the
overlay colour at the overlay opacity, in the browser's top layer. Slotted content is centred above it.

It doesn't trap focus. For anything the user has to interact with, use \`kds-dialog\` or \`kds-drawer\`,
which have their own backdrop.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Loading: Story = {
  render: () => {
    const show = () => {
      const backdrop = document.getElementById('backdrop-loading') as Backdrop;
      backdrop.open = true;
      setTimeout(() => (backdrop.open = false), 2000);
    };
    return html`
      <kds-button @click=${show}>Show for 2 seconds</kds-button>
      <kds-backdrop id="backdrop-loading">
        <kds-paper elevation="2">
          <kds-stack gap="sm" align="center">
            <kds-skeleton variant="circle"></kds-skeleton>
            <kds-typography variant="label">Loading…</kds-typography>
          </kds-stack>
        </kds-paper>
      </kds-backdrop>
    `;
  },
};

export const ClickToClose: Story = {
  render: () => html`
    <kds-button variant="secondary" @click=${() => ((document.getElementById('backdrop-close') as Backdrop).open = true)}>
      Open backdrop
    </kds-button>
    <kds-backdrop id="backdrop-close" @kds-close=${(e: Event) => ((e.currentTarget as Backdrop).open = false)}>
      <kds-paper><kds-typography>Click anywhere outside to close.</kds-typography></kds-paper>
    </kds-backdrop>
  `,
};
