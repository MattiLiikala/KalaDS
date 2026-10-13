import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Navigation/Tabs',
  component: 'kds-tabs',
  subcomponents: { 'kds-tab': 'kds-tab', 'kds-tab-panel': 'kds-tab-panel' },
  parameters: {
    docs: {
      description: {
        component: `
Switch between related panels. **\`kds-tab\`** and **\`kds-tab-panel\`** children are matched by \`value\`.
The tab list is a single Tab stop; **←/→**, **Home** and **End** move between tabs and select them.
The selected tab gets the accent text colour and a 2px accent indicator.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kds-tabs label="Project" value="overview">
      <kds-tab value="overview">Overview</kds-tab>
      <kds-tab value="activity">Activity</kds-tab>
      <kds-tab value="settings">Settings</kds-tab>
      <kds-tab value="billing" disabled>Billing</kds-tab>
      <kds-tab-panel value="overview">A summary of the project and its recent progress.</kds-tab-panel>
      <kds-tab-panel value="activity">Everything that happened in the last 30 days.</kds-tab-panel>
      <kds-tab-panel value="settings">Name, visibility and collaborators.</kds-tab-panel>
      <kds-tab-panel value="billing">Invoices and payment methods.</kds-tab-panel>
    </kds-tabs>
  `,
};

export const ManyTabs: Story = {
  render: () => html`
    <kds-box>
      <kds-tabs label="Months">
        ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'].map(
          (m) => html`<kds-tab value=${m}>${m}</kds-tab><kds-tab-panel value=${m}>Report for ${m}.</kds-tab-panel>`,
        )}
      </kds-tabs>
    </kds-box>
  `,
};
