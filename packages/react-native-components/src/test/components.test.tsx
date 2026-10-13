import { fireEvent, render, screen } from '@testing-library/react-native';
import { CloseIcon, PlusIcon } from '@kalads/icons/native';
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Input,
  Link,
  List,
  ListItem,
  Notification,
  Option,
  Radio,
  RadioGroup,
  Select,
  Tab,
  TabPanel,
  Tabs,
  Toggle,
  Typography,
} from '../index';

describe('Button', () => {
  it('is a button with its label as name, and fires onPress', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Save</Button>);
    fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disabled buttons do not fire', () => {
    const onPress = jest.fn();
    render(
      <Button disabled onPress={onPress}>
        No
      </Button>,
    );
    fireEvent.press(screen.getByRole('button', { name: 'No' }));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'No' })).toBeDisabled();
  });

  it('renders start / end icons and IconButton is named by its label', () => {
    render(
      <>
        <Button start={<PlusIcon />}>Add</Button>
        <IconButton label="Close dialog">
          <CloseIcon />
        </IconButton>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeOnTheScreen();
  });
});

describe('Typography, Badge, Divider', () => {
  it('headings get the heading role', () => {
    render(<Typography variant="h2">Title</Typography>);
    expect(screen.getByRole('heading', { name: 'Title' })).toBeOnTheScreen();
  });

  it('Badge shows its text', () => {
    render(<Badge variant="success">Done</Badge>);
    expect(screen.getByText('Done')).toBeOnTheScreen();
  });

  it('Divider shows a label', () => {
    render(<Divider>or</Divider>);
    expect(screen.getByText('or')).toBeOnTheScreen();
  });
});

describe('form controls', () => {
  it('Input reports changes and commits', () => {
    const onChange = jest.fn();
    const onCommit = jest.fn();
    render(<Input label="Email" onChange={onChange} onCommit={onCommit} />);
    const field = screen.getByLabelText('Email');
    fireEvent.changeText(field, 'a@b');
    fireEvent(field, 'submitEditing', { nativeEvent: { text: 'a@b' } });
    expect(onChange).toHaveBeenCalledWith('a@b');
    expect(onCommit).toHaveBeenCalledWith('a@b');
  });

  it('Checkbox toggles and announces the mixed state', () => {
    const onChange = jest.fn();
    const { rerender } = render(<Checkbox onChange={onChange}>Accept</Checkbox>);
    fireEvent.press(screen.getByRole('checkbox', { name: 'Accept' }));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Checkbox indeterminate>Accept</Checkbox>);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('Toggle is a switch', () => {
    const onChange = jest.fn();
    render(<Toggle onChange={onChange}>Wi-Fi</Toggle>);
    fireEvent.press(screen.getByRole('switch', { name: 'Wi-Fi' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('RadioGroup keeps exactly one selected', () => {
    const onChange = jest.fn();
    render(
      <RadioGroup label="Size" defaultValue="s" onChange={onChange}>
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
      </RadioGroup>,
    );
    fireEvent.press(screen.getByRole('radio', { name: 'Medium' }));
    expect(onChange).toHaveBeenCalledWith('m');
    expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Small' })).not.toBeChecked();
  });

  it('Select shows the selected option and picks from the list', () => {
    const onChange = jest.fn();
    render(
      <Select label="Fruit" placeholder="Pick one" onChange={onChange}>
        <Option value="a">Apple</Option>
        <Option value="b">Banana</Option>
      </Select>,
    );
    expect(screen.getByText('Pick one')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('combobox', { name: 'Fruit' }));
    fireEvent.press(screen.getByText('Banana'));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});

describe('Chip, List', () => {
  it('a selectable Chip toggles; a removable one names its remove button', () => {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    render(
      <>
        <Chip selectable onChange={onChange}>
          Design
        </Chip>
        <Chip removable onRemove={onRemove}>
          Tag
        </Chip>
      </>,
    );
    fireEvent.press(screen.getByRole('button', { name: 'Design' }));
    expect(onChange).toHaveBeenCalledWith(true);
    fireEvent.press(screen.getByRole('button', { name: 'Remove Tag' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('interactive list rows call onSelect', () => {
    const onSelect = jest.fn();
    render(
      <List label="Files">
        <ListItem interactive onSelect={onSelect}>
          Report
        </ListItem>
      </List>,
    );
    fireEvent.press(screen.getByRole('button', { name: 'Report' }));
    expect(onSelect).toHaveBeenCalled();
  });
});

describe('Tabs, Accordion', () => {
  it('Tabs shows the selected panel and switches on press', () => {
    const onChange = jest.fn();
    render(
      <Tabs onChange={onChange}>
        <Tab value="a">General</Tab>
        <Tab value="b">Billing</Tab>
        <TabPanel value="a">General panel</TabPanel>
        <TabPanel value="b">Billing panel</TabPanel>
      </Tabs>,
    );
    expect(screen.getByText('General panel')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('tab', { name: 'Billing' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('Billing panel')).toBeOnTheScreen();
    expect(screen.queryByText('General panel')).toBeNull();
  });

  it('Accordion keeps one item open', () => {
    render(
      <Accordion>
        <AccordionItem heading="One" defaultOpen>
          A
        </AccordionItem>
        <AccordionItem heading="Two">B</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'One' })).toBeExpanded();
    fireEvent.press(screen.getByRole('button', { name: 'Two' }));
    expect(screen.getByRole('button', { name: 'Two' })).toBeExpanded();
    expect(screen.getByRole('button', { name: 'One' })).toBeCollapsed();
  });
});

describe('Notification, Dialog, Link', () => {
  it('urgent notifications are alerts and dismiss themselves', () => {
    render(
      <Notification variant="danger" dismissible>
        Failed
      </Notification>,
    );
    // The alert container isn't one accessible element (its close button must stay reachable), so
    // role queries don't see it: look the role up directly.
    expect(screen.UNSAFE_getByProps({ role: 'alert', 'aria-live': 'assertive' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.UNSAFE_queryByProps({ role: 'alert' })).toBeNull();
  });

  it('Dialog closes through onClose with a reason', () => {
    const onClose = jest.fn();
    render(
      <Dialog open heading="Delete file?" onClose={onClose}>
        Body
      </Dialog>,
    );
    expect(screen.getByText('Delete file?')).toBeOnTheScreen();
    fireEvent.press(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledWith('close-button');
  });

  it('Link handles the press when onPress is given', () => {
    const onPress = jest.fn();
    render(<Link onPress={onPress}>Guide</Link>);
    fireEvent.press(screen.getByRole('link', { name: 'Guide' }));
    expect(onPress).toHaveBeenCalled();
  });
});
