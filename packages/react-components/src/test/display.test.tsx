import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge, Button, Chip, Icon, List, ListItem, Skeleton, Tooltip } from '../index.js';

describe('Badge, Chip', () => {
  it('Badge defaults to the default variant', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toHaveAttribute('data-variant', 'default');
  });

  it('a selectable Chip is a toggle button', async () => {
    const onChange = vi.fn();
    render(
      <Chip selectable onChange={onChange}>
        Design
      </Chip>,
    );
    const button = screen.getByRole('button', { name: 'Design' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('a removable Chip names its remove button after the chip', async () => {
    const onRemove = vi.fn();
    render(
      <Chip removable onRemove={onRemove} variant="info">
        Design
      </Chip>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove Design' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

describe('List', () => {
  it('renders a labelled list with link, button and nested rows', async () => {
    const onSelect = vi.fn();
    render(
      <List label="Files">
        <ListItem href="/a" selected>
          Link row
        </ListItem>
        <ListItem interactive onSelect={onSelect} secondary="Details">
          Button row
        </ListItem>
        <ListItem
          nested={
            <List>
              <ListItem>Child</ListItem>
            </List>
          }
        >
          Parent
        </ListItem>
      </List>,
    );
    expect(screen.getByRole('list', { name: 'Files' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Link row' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: /Button row/ }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.getByText('Child').closest('ul')).toHaveAttribute('data-nested');
  });
});

describe('Icon, Skeleton', () => {
  it('Icon is decorative without a label and an image with one', () => {
    const { container, rerender } = render(<Icon name="search" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Icon name="search" label="Search" size="lg" />);
    expect(screen.getByRole('img', { name: 'Search' })).toBeInTheDocument();
  });

  it('Skeleton is hidden from assistive technology and draws lines', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('[class*="line"]')).toHaveLength(3);
  });
});

describe('Tooltip', () => {
  it('describes its trigger and opens on focus, closes on Escape', async () => {
    render(
      <Tooltip content="Copy link">
        <Button>Copy</Button>
      </Tooltip>,
    );
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button).toHaveAccessibleDescription('Copy link');
    act(() => button.focus());
    expect(screen.getByRole('tooltip', { hidden: true }).parentElement).not.toHaveAttribute('hidden');
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('tooltip', { hidden: true }).parentElement).toHaveAttribute('hidden');
  });
});
