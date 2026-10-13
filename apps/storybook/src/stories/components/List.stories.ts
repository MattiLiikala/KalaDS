import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Data Display/List',
  component: 'kds-list',
  subcomponents: { 'kds-list-item': 'kds-list-item' },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Vertical list of **\`kds-list-item\`** rows. Each row has primary text, optional \`secondary\` text and
\`start\`/\`end\` slots for icons, avatars, badges or actions. Rows are static by default; \`href\` makes a
row a link and \`interactive\` makes it a button (fires \`kds-select\`). Put a \`kds-list\` in an item's
\`nested\` slot for an indented sub-list. No divider lines: rows are separated by spacing.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Simple: Story = {
  render: () => html`
    <kds-list label="Team">
      <kds-list-item>Alex Rivera</kds-list-item>
      <kds-list-item>Sam Lee</kds-list-item>
      <kds-list-item>Jordan Kim</kds-list-item>
    </kds-list>
  `,
};

export const WithSecondaryAndSlots: Story = {
  render: () => html`
    <kds-list label="Files">
      <kds-list-item>
        <kds-icon slot="start" name="info" color="brand"></kds-icon>
        Quarterly report
        <span slot="secondary">PDF · 2.4 MB</span>
        <kds-badge slot="end" variant="success">Shared</kds-badge>
      </kds-list-item>
      <kds-list-item>
        <kds-icon slot="start" name="warning" color="warning"></kds-icon>
        Budget draft
        <span slot="secondary">Spreadsheet · edited 2 hours ago</span>
        <kds-badge slot="end" variant="warning">Draft</kds-badge>
      </kds-list-item>
    </kds-list>
  `,
};

export const Navigation: Story = {
  render: () => html`
    <kds-list label="Sections">
      <kds-list-item href="#" selected><kds-icon slot="start" name="menu"></kds-icon>Dashboard</kds-list-item>
      <kds-list-item href="#"><kds-icon slot="start" name="search"></kds-icon>Search</kds-list-item>
      <kds-list-item interactive><kds-icon slot="start" name="plus"></kds-icon>New project</kds-list-item>
      <kds-list-item interactive disabled><kds-icon slot="start" name="close"></kds-icon>Archive (disabled)</kds-list-item>
    </kds-list>
  `,
};

export const Nested: Story = {
  render: () => html`
    <kds-list label="Settings">
      <kds-list-item href="#">General</kds-list-item>
      <kds-list-item href="#">
        Account
        <kds-list slot="nested">
          <kds-list-item href="#">Profile</kds-list-item>
          <kds-list-item href="#" selected>Security</kds-list-item>
          <kds-list-item href="#">Billing</kds-list-item>
        </kds-list>
      </kds-list-item>
      <kds-list-item href="#">Notifications</kds-list-item>
    </kds-list>
  `,
};

export const Dense: Story = {
  render: () => html`
    <kds-list dense label="Recent">
      <kds-list-item interactive>design-tokens.json</kds-list-item>
      <kds-list-item interactive>kds-button.ts</kds-list-item>
      <kds-list-item interactive>README.md</kds-list-item>
    </kds-list>
  `,
};
