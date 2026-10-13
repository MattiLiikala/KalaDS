import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Feedback/Notification',
  component: 'kds-notification',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Message about the status of something, tinted with the variant's palette: a subtle background, a border
and icon in the strong status colour, and a crisp shadow in the variant colour. \`elevation\` sets the
shadow distance (1 low, 2 medium, 3 high, the default).

**Danger** and **warning** use role="alert" (announced immediately); **info** and **success** use
role="status" (announced politely). Insert the element when the message should be announced.
`,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
    elevation: { control: 'inline-radio', options: [1, 2, 3] },
    heading: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: { variant: 'info', elevation: 3, heading: 'Update available', dismissible: true },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-notification variant=${args.variant} elevation=${args.elevation} heading=${args.heading} ?dismissible=${args.dismissible}>
      A new version of the app is ready. Reload to get the latest features.
    </kds-notification>
  `,
};

export const Variants: Story = {
  render: () => html`
    <kds-stack gap="lg">
      <kds-notification variant="info" heading="Heads up">Maintenance is scheduled for Sunday at 02:00.</kds-notification>
      <kds-notification variant="success" heading="Saved">Your profile has been updated.</kds-notification>
      <kds-notification variant="warning" heading="Storage almost full">You've used 90% of your space.</kds-notification>
      <kds-notification variant="danger" heading="Payment failed">We couldn't charge your card. Check the details and try again.</kds-notification>
    </kds-stack>
  `,
};

export const Elevations: Story = {
  render: () => html`
    <kds-stack gap="xl">
      ${[1, 2, 3].map(
        (e) => html`<kds-notification elevation=${e} heading="Elevation ${e}">Crisp shadow level ${e}.</kds-notification>`,
      )}
    </kds-stack>
  `,
};

export const WithActions: Story = {
  render: () => html`
    <kds-notification variant="warning" heading="Unsaved changes" dismissible>
      You have changes that haven't been published yet.
      <kds-button slot="actions" size="sm">Publish</kds-button>
      <kds-button slot="actions" size="sm" variant="ghost">Discard</kds-button>
    </kds-notification>
  `,
};

export const MessageOnly: Story = {
  render: () => html`<kds-notification variant="success">Link copied to clipboard.</kds-notification>`,
};
