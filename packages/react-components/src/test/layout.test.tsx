import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Box, Container, Divider, Grid, GridItem, Stack, Typography } from '../index.js';

describe('layout', () => {
  it('Box maps token props to token variables', () => {
    render(<Box data-testid="b" padding="md" bg="inverse" radius="lg" border />);
    const el = screen.getByTestId('b');
    expect(el.style.getPropertyValue('--_p')).toBe('var(--kds-semantic-spacing-md)');
    expect(el.style.getPropertyValue('--_bg')).toBe('var(--kds-semantic-bg-inverse)');
    expect(el.style.getPropertyValue('--_radius')).toBe('var(--kds-semantic-radius-lg)');
    expect(el).toHaveAttribute('data-border');
    expect(el).toHaveAttribute('data-bg', 'inverse');
  });

  it('Stack defaults to a column and reflects layout props', () => {
    render(<Stack data-testid="s" gap="lg" align="center" wrap />);
    const el = screen.getByTestId('s');
    expect(el).toHaveAttribute('data-direction', 'column');
    expect(el).toHaveAttribute('data-align', 'center');
    expect(el).toHaveAttribute('data-wrap');
    expect(el.style.getPropertyValue('--_gap')).toBe('var(--kds-semantic-spacing-lg)');
  });

  it('Grid clamps columns and GridItem spans', () => {
    render(
      <Grid data-testid="g" columns={20} min="md">
        <GridItem data-testid="i" span={3} full />
      </Grid>,
    );
    expect(screen.getByTestId('g').style.getPropertyValue('--_columns')).toBe('12');
    expect(screen.getByTestId('g').style.getPropertyValue('--_min')).toBe('var(--kds-semantic-size-md)');
    expect(screen.getByTestId('i').style.getPropertyValue('--_span')).toBe('3');
    expect(screen.getByTestId('i')).toHaveAttribute('data-full');
  });

  it('Container defaults to lg', () => {
    render(<Container data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveAttribute('data-size', 'lg');
  });

  it('Divider is a separator, labelled when it has text, hidden when decorative', () => {
    const { rerender } = render(<Divider>or</Divider>);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    expect(screen.getByText('or')).toBeInTheDocument();
    rerender(<Divider decorative />);
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('Typography renders the element for its variant, or `as`', () => {
    render(
      <>
        <Typography variant="h2">Title</Typography>
        <Typography variant="h4" as="h2" color="subtle">
          Other
        </Typography>
        <Typography>Body</Typography>
      </>,
    );
    expect(screen.getByText('Title').tagName).toBe('H2');
    expect(screen.getByText('Other').tagName).toBe('H2');
    expect(screen.getByText('Other')).toHaveAttribute('data-color', 'subtle');
    expect(screen.getByText('Body').tagName).toBe('P');
    expect(screen.getByText('Title').style.getPropertyValue('--_size')).toBe('var(--kds-semantic-type-h2-size)');
  });
});
