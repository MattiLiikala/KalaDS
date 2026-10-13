import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

type Openable = HTMLElement & { show(): void; close(reason?: string): void };
const open = (id: string) => (document.getElementById(id) as Openable).show();
const close = (id: string) => (document.getElementById(id) as Openable).close();

const meta: Meta = {
  title: 'Components/Feedback/Dialog',
  component: 'kds-dialog',
  parameters: {
    docs: {
      description: {
        component: `
Modal window for focused tasks and confirmations, built on the native \`<dialog>\` with \`showModal()\`:

- focus moves into the dialog and can't leave it; the page behind is inert;
- **Escape**, the close button and a backdrop click close it, unless it's \`persistent\`;
- focus returns to the element that opened it.

1px border and the high soft shadow (\`semantic.shadow.soft.3\`). \`heading\` is required: it's the accessible name.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kds-button @click=${() => open('dialog-default')}>Open dialog</kds-button>
    <kds-dialog id="dialog-default" heading="Share project">
      <kds-stack gap="md">
        <kds-typography>Anyone with the link can view this project.</kds-typography>
        <kds-input label="Invite by email" placeholder="name@example.com"></kds-input>
      </kds-stack>
      <kds-button slot="footer" variant="ghost" @click=${() => close('dialog-default')}>Cancel</kds-button>
      <kds-button slot="footer" @click=${() => close('dialog-default')}>Send invite</kds-button>
    </kds-dialog>
  `,
};

export const Confirmation: Story = {
  render: () => html`
    <kds-button variant="danger" @click=${() => open('dialog-confirm')}>Delete project</kds-button>
    <kds-dialog id="dialog-confirm" heading="Delete project?" size="sm">
      <kds-typography>This permanently deletes the project and its files. You can't undo this.</kds-typography>
      <kds-button slot="footer" variant="ghost" @click=${() => close('dialog-confirm')}>Cancel</kds-button>
      <kds-button slot="footer" variant="danger" @click=${() => close('dialog-confirm')}>Delete</kds-button>
    </kds-dialog>
  `,
};

export const Persistent: Story = {
  render: () => html`
    <kds-button variant="secondary" @click=${() => open('dialog-required')}>Open required step</kds-button>
    <kds-dialog id="dialog-required" heading="Accept the terms" persistent>
      <kds-typography>You need to accept the updated terms to continue. Escape and backdrop clicks do nothing here.</kds-typography>
      <kds-button slot="footer" @click=${() => close('dialog-required')}>Accept</kds-button>
    </kds-dialog>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <kds-stack direction="row" gap="sm">
      ${(['sm', 'md', 'lg'] as const).map(
        (s) => html`
          <kds-button variant="secondary" @click=${() => open(`dialog-${s}`)}>Size ${s}</kds-button>
          <kds-dialog id="dialog-${s}" heading="Size ${s}" size=${s}>
            <kds-typography>Dialog content for the ${s} size.</kds-typography>
          </kds-dialog>
        `,
      )}
    </kds-stack>
  `,
};
