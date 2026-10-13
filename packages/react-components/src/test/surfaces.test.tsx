import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, Backdrop, Card, Dialog, Drawer, Notification, Paper } from '../index.js';

beforeAll(() => {
  // jsdom has no modal dialogs: emulate showModal / close by toggling `open`.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query }) as MediaQueryList) as typeof window.matchMedia;
});

describe('Notification', () => {
  it('uses alert for urgent variants and status otherwise', () => {
    const { rerender } = render(<Notification variant="danger">Failed</Notification>);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    rerender(<Notification variant="success">Saved</Notification>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('dismisses itself unless onClose returns false', async () => {
    const { rerender, container } = render(
      <Notification dismissible onClose={() => false}>
        Hi
      </Notification>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(container.firstElementChild).not.toHaveAttribute('hidden');
    rerender(<Notification dismissible>Hi</Notification>);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(container.firstElementChild).toHaveAttribute('hidden');
  });
});

describe('Card, Paper', () => {
  it('Card defaults to elevation 3 and renders header and footer only when given', () => {
    const { container } = render(<Card header="Head">Body</Card>);
    expect(container.firstElementChild).toHaveAttribute('data-elevation', '3');
    expect(screen.getByText('Head')).toBeInTheDocument();
    expect(container.querySelector('[class*="card"]')?.children).toHaveLength(2);
  });

  it('Paper defaults to elevation 1, outlined', () => {
    const { container } = render(<Paper padding="sm" />);
    expect(container.firstElementChild).toHaveAttribute('data-elevation', '1');
    expect(container.firstElementChild).toHaveAttribute('data-variant', 'outlined');
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--_padding')).toBe('var(--kds-semantic-padding-sm)');
  });
});

describe('Accordion', () => {
  it('keeps one item open unless multiple', async () => {
    render(
      <Accordion>
        <AccordionItem heading="One" defaultOpen>
          A
        </AccordionItem>
        <AccordionItem heading="Two">B</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('One').closest('[class*="root"]')).toHaveAttribute('data-open');
    await userEvent.click(screen.getByText('Two'));
    expect(screen.getByText('Two').closest('[class*="root"]')).toHaveAttribute('data-open');
    expect(screen.getByText('One').closest('[class*="root"]')).not.toHaveAttribute('data-open');
  });
});

describe('Dialog, Drawer, Backdrop', () => {
  it('Dialog is named by its heading and closes through onClose', async () => {
    const onClose = vi.fn();
    render(
      <Dialog open heading="Delete file?" onClose={onClose} footer={<button>OK</button>}>
        Body
      </Dialog>,
    );
    expect(screen.getByRole('dialog', { name: 'Delete file?' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledWith('close-button');
  });

  it('a persistent Drawer has no close button', () => {
    render(<Drawer open persistent heading="Filters" />);
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('Backdrop reports overlay clicks', async () => {
    const onClose = vi.fn();
    const { container } = render(<Backdrop open onClose={onClose} />);
    await userEvent.click(container.querySelector('[class*="overlay"]')!);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
