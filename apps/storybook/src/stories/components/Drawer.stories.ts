import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';
import '@kalads/icons';

type Openable = HTMLElement & { show(): void; close(): void };
const open = (id: string) => (document.getElementById(id) as Openable).show();
const close = (id: string) => (document.getElementById(id) as Openable).close();

const meta: Meta = {
  title: 'Components/Navigation/Drawer',
  component: 'kds-drawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Full-height panel that slides in from the side, for navigation or secondary tasks. Modal like
\`kds-dialog\` (native \`<dialog>\`): focus is contained, the page behind is inert, **Escape** closes it and
focus returns to the opener. \`heading\` is required.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Navigation: Story = {
  render: () => html`
    <kds-icon-button label="Open navigation" variant="secondary" @click=${() => open('drawer-nav')}>
      <kds-icon-menu></kds-icon-menu>
    </kds-icon-button>
    <kds-drawer id="drawer-nav" heading="Menu" placement="start" size="sm">
      <kds-list label="Main">
        <kds-list-item href="#" selected>Dashboard</kds-list-item>
        <kds-list-item href="#">Projects</kds-list-item>
        <kds-list-item href="#">Team</kds-list-item>
        <kds-list-item href="#">Settings</kds-list-item>
      </kds-list>
    </kds-drawer>
  `,
};

export const FilterPanel: Story = {
  render: () => html`
    <kds-button variant="secondary" @click=${() => open('drawer-filters')}>Filters</kds-button>
    <kds-drawer id="drawer-filters" heading="Filters">
      <kds-stack gap="lg">
        <kds-checkbox-group label="Status">
          <kds-checkbox checked>Open</kds-checkbox>
          <kds-checkbox>In review</kds-checkbox>
          <kds-checkbox>Closed</kds-checkbox>
        </kds-checkbox-group>
        <kds-radio-group label="Sort by" value="newest">
          <kds-radio value="newest">Newest first</kds-radio>
          <kds-radio value="oldest">Oldest first</kds-radio>
        </kds-radio-group>
      </kds-stack>
      <kds-button slot="footer" variant="ghost" @click=${() => close('drawer-filters')}>Reset</kds-button>
      <kds-button slot="footer" @click=${() => close('drawer-filters')}>Apply</kds-button>
    </kds-drawer>
  `,
};
