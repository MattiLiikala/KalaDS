import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';
import '@kalads/icons';

const meta: Meta = {
  title: 'Components/Navigation/Menu',
  component: 'kds-menu',
  subcomponents: { 'kds-menu-item': 'kds-menu-item' },
  parameters: {
    docs: {
      description: {
        component: `
List of actions opened from a trigger button (WAI-ARIA menu button). Put a \`kds-button\` or
\`kds-icon-button\` in the \`trigger\` slot and **\`kds-menu-item\`** elements inside.

**Keyboard:** the trigger opens the menu (also **↓**); **↑/↓**, **Home** and **End** move between items;
**Enter** or **Space** picks one; **Escape**, **Tab** or a click outside closes it and returns focus to
the trigger. The menu opens in the top layer and flips upward when there isn't room below.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const log = (e: CustomEvent) => console.log('kds-select', e.detail.value);

export const Default: Story = {
  render: () => html`
    <kds-box padding-y="md">
      <kds-menu @kds-select=${log}>
        <kds-button slot="trigger" variant="secondary">
          Actions
          <kds-icon-chevron-down slot="end"></kds-icon-chevron-down>
        </kds-button>
        <kds-menu-item value="edit">Edit</kds-menu-item>
        <kds-menu-item value="duplicate">Duplicate</kds-menu-item>
        <kds-menu-item value="share">Share</kds-menu-item>
        <kds-divider flush decorative></kds-divider>
        <kds-menu-item value="delete" variant="danger">Delete</kds-menu-item>
      </kds-menu>
    </kds-box>
  `,
};

export const IconTrigger: Story = {
  render: () => html`
    <kds-box padding-y="md">
      <kds-menu placement="bottom-end" label="Row actions" @kds-select=${log}>
        <kds-icon-button slot="trigger" label="More options"><kds-icon-more-vertical></kds-icon-more-vertical></kds-icon-button>
        <kds-menu-item value="open"><kds-icon slot="start" name="external-link"></kds-icon>Open in new tab</kds-menu-item>
        <kds-menu-item value="add"><kds-icon slot="start" name="plus"></kds-icon>Add to collection</kds-menu-item>
        <kds-menu-item value="archive" disabled><kds-icon slot="start" name="close"></kds-icon>Archive</kds-menu-item>
      </kds-menu>
    </kds-box>
  `,
};

export const WithShortcuts: Story = {
  render: () => html`
    <kds-box padding-y="md">
      <kds-menu @kds-select=${log}>
        <kds-button slot="trigger" variant="ghost">Edit</kds-button>
        <kds-menu-item value="undo">Undo<span slot="end">⌘Z</span></kds-menu-item>
        <kds-menu-item value="redo">Redo<span slot="end">⇧⌘Z</span></kds-menu-item>
        <kds-divider flush decorative></kds-divider>
        <kds-menu-item value="cut">Cut<span slot="end">⌘X</span></kds-menu-item>
        <kds-menu-item value="copy">Copy<span slot="end">⌘C</span></kds-menu-item>
        <kds-menu-item value="paste">Paste<span slot="end">⌘V</span></kds-menu-item>
      </kds-menu>
    </kds-box>
  `,
};
