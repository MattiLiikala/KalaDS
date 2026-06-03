import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Card',
  component: 'kds-card',
  tags: ['autodocs'],
  argTypes: {
    interactive: {
      control: 'boolean',
      description: 'When true, shows hover styles (for clickable cards)',
    },
  },
  args: {
    interactive: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width: 400px;">
      <kds-card ?interactive=${args.interactive}>
        <p style="margin:0; color: var(--kds-semantic-text-default); font-family: var(--kds-font-family-base);">
          Card content goes here. This is a surface container for grouping related information.
        </p>
      </kds-card>
    </div>
  `,
};

export const WithHeaderAndFooter: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <kds-card>
        <div slot="header">
          <h3 style="margin:0; font-family: var(--kds-font-family-heading); font-size: var(--kds-font-size-400); color: var(--kds-semantic-text-default);">
            Card Title
          </h3>
        </div>
        <p style="margin:0; color: var(--kds-semantic-text-subtle); font-family: var(--kds-font-family-base);">
          Card body content with additional context and information for the user.
        </p>
        <div slot="footer" style="display:flex; justify-content:flex-end; gap: var(--kds-semantic-spacing-sm);">
          <kds-button variant="ghost">Cancel</kds-button>
          <kds-button variant="primary">Save</kds-button>
        </div>
      </kds-card>
    </div>
  `,
};

export const Interactive: Story = {
  args: { interactive: true },
  render: () => html`
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: var(--kds-semantic-spacing-md); max-width: 800px;">
      ${[1, 2, 3].map(
        (i) => html`
          <kds-card interactive>
            <div style="text-align: center;">
              <div style="font-size: var(--kds-font-size-500); margin-bottom: var(--kds-semantic-spacing-sm);">📊</div>
              <p style="margin:0; font-family: var(--kds-font-family-label); font-weight: var(--kds-font-weight-bold); color: var(--kds-semantic-text-default);">
                Item ${i}
              </p>
              <p style="margin: var(--kds-semantic-spacing-xs) 0 0; font-family: var(--kds-font-family-base); color: var(--kds-semantic-text-subtle); font-size: var(--kds-font-size-200);">
                Click to explore
              </p>
            </div>
          </kds-card>
        `,
      )}
    </div>
  `,
};
