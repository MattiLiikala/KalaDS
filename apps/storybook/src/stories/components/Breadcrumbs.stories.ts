import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: 'kds-breadcrumbs',
  subcomponents: { 'kds-breadcrumb-item': 'kds-breadcrumb-item' },
  parameters: {
    docs: {
      description: {
        component: `
Shows where the current page sits in the hierarchy. A navigation landmark containing a list of
**\`kds-breadcrumb-item\`** elements, separated by chevrons. The last item (or any item with \`current\`
or without \`href\`) is the current page and gets aria-current="page".
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <kds-breadcrumbs>
      <kds-breadcrumb-item href="#">Home</kds-breadcrumb-item>
      <kds-breadcrumb-item href="#">Projects</kds-breadcrumb-item>
      <kds-breadcrumb-item href="#">KalaDS</kds-breadcrumb-item>
      <kds-breadcrumb-item>Settings</kds-breadcrumb-item>
    </kds-breadcrumbs>
  `,
};

export const Short: Story = {
  render: () => html`
    <kds-breadcrumbs>
      <kds-breadcrumb-item href="#">Docs</kds-breadcrumb-item>
      <kds-breadcrumb-item>Getting started</kds-breadcrumb-item>
    </kds-breadcrumbs>
  `,
};
