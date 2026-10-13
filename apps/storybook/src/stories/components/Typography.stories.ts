import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@kalads/web-components';

const VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'body-sm', 'caption', 'label', 'overline'];

const meta: Meta = {
  title: 'Components/Data Display/Typography',
  component: 'kds-typography',
  parameters: {
    docs: {
      description: {
        component: `
Text in the KalaDS type scale. Headings use **Overlock**, labels and overlines **Parkinsans**, body text
**Overlock**. Each variant renders its matching element (\`h1\`–\`h6\`, \`p\`, \`span\`); use \`as\` to change
the element without changing the look. For example, keep the document outline correct with a visual
\`h4\` that is an \`h2\`.

All values come from the \`semantic.type.*\` tokens.
`,
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    color: { control: 'select', options: ['default', 'subtle', 'muted', 'brand', 'danger', 'inverse'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    truncate: { control: 'boolean' },
  },
  args: { variant: 'h2', color: 'default', align: 'start', truncate: false },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <kds-typography variant=${args.variant} color=${args.color} align=${args.align} ?truncate=${args.truncate}>
      The quick brown fox jumps over the lazy dog
    </kds-typography>
  `,
};

export const Scale: Story = {
  render: () => html`
    <kds-stack gap="md">
      ${VARIANTS.map(
        (v) => html`
          <kds-stack direction="row" gap="lg" align="baseline">
            <kds-typography variant="caption" color="muted">${v}</kds-typography>
            <kds-typography variant=${v}>Design systems scale</kds-typography>
          </kds-stack>
        `,
      )}
    </kds-stack>
  `,
};

export const Colors: Story = {
  render: () => html`
    <kds-stack gap="sm">
      <kds-typography color="default">Default text</kds-typography>
      <kds-typography color="subtle">Subtle text</kds-typography>
      <kds-typography color="muted">Muted text (placeholders, disabled)</kds-typography>
      <kds-typography color="brand">Brand text</kds-typography>
      <kds-typography color="danger">Danger text</kds-typography>
      <kds-box bg="inverse" padding="sm" radius="sm"><kds-typography color="inverse">Inverse text</kds-typography></kds-box>
    </kds-stack>
  `,
};

export const SemanticElement: Story = {
  name: 'Element vs look (as)',
  render: () => html`
    <kds-stack gap="sm">
      <kds-typography variant="h4" as="h2">An h2 that looks like an h4</kds-typography>
      <kds-typography variant="body" gutter>
        The heading above is an h2 in the document outline but uses the h4 style.
      </kds-typography>
      <kds-typography variant="overline">Overline label</kds-typography>
    </kds-stack>
  `,
};
