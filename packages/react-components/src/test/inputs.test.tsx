import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { CloseIcon } from '@kalads/icons/react';
import {
  Autocomplete,
  Button,
  Checkbox,
  CheckboxGroup,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Select,
  Toggle,
} from '../index.js';

describe('Button', () => {
  it('defaults to primary md and is a real button', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each(['primary', 'secondary', 'danger', 'ghost'] as const)('reflects variant %s', (variant) => {
    render(<Button variant={variant}>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
  });

  it('disabled buttons do not fire', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('IconButton is ghost by default and named by its label', () => {
    render(
      <IconButton label="Close dialog">
        <CloseIcon />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toHaveAttribute('data-variant', 'ghost');
  });
});

describe('Input', () => {
  it('labels the field, shows error state and reports changes', async () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(<Input label="Email" error="Required" onChange={onChange} onCommit={onCommit} />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required');
    await userEvent.type(input, 'a@b{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('a@b', expect.anything());
    expect(onCommit).toHaveBeenCalledWith('a@b');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState('x');
      return <Input label="Name" value={value} onChange={(v) => setValue(v.toUpperCase())} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByLabelText('Name'), 'y');
    expect(screen.getByLabelText('Name')).toHaveValue('XY');
  });
});

describe('Select', () => {
  it('is a native select with a placeholder and onChange', async () => {
    const onChange = vi.fn();
    render(
      <Select label="Fruit" placeholder="Pick one" helper="Any" onChange={onChange}>
        <option value="a">Apple</option>
        <option value="b">Banana</option>
      </Select>,
    );
    const select = screen.getByLabelText('Fruit');
    expect(select).toHaveAccessibleDescription('Any');
    await userEvent.selectOptions(select, 'b');
    expect(onChange).toHaveBeenCalledWith('b', expect.anything());
  });
});

describe('Autocomplete', () => {
  it('filters options, moves with arrow keys and picks with Enter', async () => {
    const onChange = vi.fn();
    render(
      <Autocomplete label="Country" onChange={onChange}>
        <option value="fi">Finland</option>
        <option value="fr">France</option>
        <option value="de">Germany</option>
      </Autocomplete>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.type(input, 'f');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option', { hidden: true })).toHaveLength(2);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('fr');
    expect(input).toHaveValue('France');
  });
});

describe('Checkbox, Toggle', () => {
  it('Checkbox toggles and shows the mixed state', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox onChange={onChange}>Accept</Checkbox>);
    await userEvent.click(screen.getByLabelText('Accept'));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    rerender(<Checkbox indeterminate>Accept</Checkbox>);
    expect((screen.getByLabelText('Accept') as HTMLInputElement).indeterminate).toBe(true);
  });

  it('CheckboxGroup is a labelled group', () => {
    render(
      <CheckboxGroup label="Toppings" error="Pick one">
        <Checkbox>Cheese</Checkbox>
      </CheckboxGroup>,
    );
    expect(screen.getByRole('group', { name: 'Toppings' })).toHaveAccessibleDescription('Pick one');
  });

  it('Toggle is a switch', async () => {
    const onChange = vi.fn();
    render(<Toggle onChange={onChange}>Wi-Fi</Toggle>);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });
});

describe('RadioGroup', () => {
  it('selects one option and reports it', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Size" defaultValue="s" onChange={onChange}>
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l" disabled>
          Large
        </Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
    expect(screen.getByLabelText('Small')).toBeChecked();
    await userEvent.click(screen.getByLabelText('Medium'));
    expect(screen.getByLabelText('Medium')).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('m');
    expect(screen.getByLabelText('Large')).toBeDisabled();
  });
});
