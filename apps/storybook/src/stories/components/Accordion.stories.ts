import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/components';

const meta: Meta = {
  title: 'Components/Surfaces/Accordion',
  component: 'kds-accordion',
  subcomponents: { 'kds-accordion-item': 'kds-accordion-item' },
  parameters: {
    docs: {
      description: {
        component: `
Stack of collapsible sections. Each **\`kds-accordion-item\`** is a native \`<details>\`/\`<summary>\`, so
it's keyboard operable and announced as expandable. Only one section is open at a time unless the
accordion has \`multiple\`.
`,
      },
    },
  },
  argTypes: { multiple: { control: 'boolean' } },
  args: { multiple: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-accordion ?multiple=${args.multiple}>
      <kds-accordion-item heading="What is KalaDS?" open>
        A design system of tokens, icons and Lit web components that work in any framework.
      </kds-accordion-item>
      <kds-accordion-item heading="Does it support dark surfaces?">
        Yes. Buttons have an <code>on-inverse</code> attribute for placement on inverse surfaces.
      </kds-accordion-item>
      <kds-accordion-item heading="Can I use it with React?">
        Web components work in React, Vue, Svelte and plain HTML.
      </kds-accordion-item>
      <kds-accordion-item heading="Disabled section" disabled>You can't open this one.</kds-accordion-item>
    </kds-accordion>
  `,
};

export const Multiple: Story = {
  render: () => html`
    <kds-accordion multiple>
      <kds-accordion-item heading="Shipping" open>Orders ship within two working days.</kds-accordion-item>
      <kds-accordion-item heading="Returns" open>Return any item within 30 days.</kds-accordion-item>
      <kds-accordion-item heading="Warranty">Two years on all hardware.</kds-accordion-item>
    </kds-accordion>
  `,
};
