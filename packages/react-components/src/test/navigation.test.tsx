import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BreadcrumbItem, Breadcrumbs, Button, Link, Menu, MenuItem, Tab, TabPanel, Tabs } from '../index.js';

describe('Tabs', () => {
  it('selects the first tab, links tabs to panels and moves with arrow keys', async () => {
    const onChange = vi.fn();
    render(
      <Tabs label="Settings" onChange={onChange}>
        <Tab value="a">General</Tab>
        <Tab value="b" disabled>
          Billing
        </Tab>
        <Tab value="c">Team</Tab>
        <TabPanel value="a">General panel</TabPanel>
        <TabPanel value="b">Billing panel</TabPanel>
        <TabPanel value="c">Team panel</TabPanel>
      </Tabs>,
    );
    const general = screen.getByRole('tab', { name: 'General' });
    expect(general).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'General' })).toHaveTextContent('General panel');
    general.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveFocus();
    expect(onChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('tabpanel', { name: 'Team' })).toBeVisible();
  });
});

describe('Menu', () => {
  it('opens from its trigger, picks with Enter and returns focus', async () => {
    const onSelect = vi.fn();
    render(
      <Menu trigger={<Button>Actions</Button>} onSelect={onSelect}>
        <MenuItem value="edit">Edit</MenuItem>
        <MenuItem value="delete" variant="danger">
          Delete
        </MenuItem>
      </Menu>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Edit', hidden: true })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('delete');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Link, Breadcrumbs', () => {
  it('new-tab links get rel and a screen-reader note', () => {
    render(
      <Link href="https://example.com" target="_blank">
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Docs (opens in new tab)' });
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Breadcrumbs is a navigation landmark; the last item is the current page', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  });
});
