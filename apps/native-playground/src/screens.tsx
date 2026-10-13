import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  Backdrop,
  Badge,
  Box,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Chip,
  Container,
  Dialog,
  Divider,
  Drawer,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  Link,
  List,
  ListItem,
  Menu,
  MenuItem,
  Notification,
  Option,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  Toggle,
  Tooltip,
  Typography,
} from '@kalads/react-native-components';
import { ArrowRightIcon, CloseIcon, MoreVerticalIcon, PlusIcon, SearchIcon } from '@kalads/icons/native';

export interface Screen {
  id: string;
  title: string;
  /** `open` names an overlay to show straight away (deep link or ?open=), for screenshots. */
  render: (params: { open: string | null }) => ReactNode;
}

const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;

export const screens: Screen[] = [
  {
    id: 'button',
    title: 'Button: variants, sizes, icons, disabled',
    render: () => (
      <Stack gap="md">
        <Stack direction="row" gap="sm" align="center" wrap>
          {variants.map((v) => (
            <Button key={v} variant={v}>
              Button
            </Button>
          ))}
        </Stack>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Stack>
        <Stack direction="row" gap="sm" align="center" wrap>
          <Button start={<PlusIcon />}>Add item</Button>
          <Button variant="secondary" end={<ArrowRightIcon />}>
            Next
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
        </Stack>
      </Stack>
    ),
  },
  {
    id: 'button-inverse',
    title: 'Button and IconButton on inverse',
    render: () => (
      <Box bg="inverse" padding="md">
        <Stack direction="row" gap="sm" align="center" wrap>
          {variants.map((v) => (
            <Button key={v} variant={v} onInverse>
              Button
            </Button>
          ))}
          <IconButton variant="primary" onInverse label="Add">
            <PlusIcon />
          </IconButton>
        </Stack>
      </Box>
    ),
  },
  {
    id: 'icon-button',
    title: 'IconButton: sizes next to Button',
    render: () => (
      <Stack gap="sm">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Stack key={size} direction="row" gap="sm" align="center">
            <Button size={size}>Search</Button>
            <IconButton size={size} label="Search">
              <SearchIcon />
            </IconButton>
            <IconButton size={size} variant="primary" label="Search">
              <SearchIcon />
            </IconButton>
            <IconButton size={size} variant="danger" label="Close">
              <CloseIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    ),
  },
  {
    id: 'input',
    title: 'Input, Select, Autocomplete',
    render: () => (
      <Stack gap="md">
        <Input label="Email" type="email" placeholder="you@example.com" helper="We never share it." />
        <Input label="Name" defaultValue="Ada" error="Name is taken" required />
        <Input label="Disabled" disabled defaultValue="Read only" />
        <Select label="Fruit" placeholder="Pick one" helper="Seasonal">
          <Option value="a">Apple</Option>
          <Option value="b">Banana</Option>
        </Select>
        <Select label="Error" error="Choose a fruit" defaultValue="a">
          <Option value="a">Apple</Option>
        </Select>
        <Autocomplete label="Country" placeholder="Type to search" defaultValue="fi">
          <Option value="fi">Finland</Option>
          <Option value="fr">France</Option>
        </Autocomplete>
      </Stack>
    ),
  },
  {
    id: 'choices',
    title: 'Checkbox, Radio, Toggle',
    render: () => (
      <Stack gap="lg">
        <CheckboxGroup label="Toppings" helper="Pick any">
          <Checkbox defaultChecked>Cheese</Checkbox>
          <Checkbox indeterminate>Some sauces</Checkbox>
          <Checkbox>Olives</Checkbox>
          <Checkbox disabled defaultChecked>
            Disabled
          </Checkbox>
        </CheckboxGroup>
        <RadioGroup label="Size" defaultValue="m" orientation="horizontal">
          <Radio value="s">Small</Radio>
          <Radio value="m">Medium</Radio>
          <Radio value="l" disabled>
            Large
          </Radio>
        </RadioGroup>
        <Stack gap="sm">
          <Toggle>Wi-Fi</Toggle>
          <Toggle defaultChecked>Bluetooth</Toggle>
          <Toggle disabled>Airplane mode</Toggle>
        </Stack>
      </Stack>
    ),
  },
  {
    id: 'badge-chip',
    title: 'Badge and Chip',
    render: () => (
      <Stack gap="md">
        <Stack direction="row" gap="sm" wrap>
          {(['default', 'primary', 'danger', 'warning', 'success'] as const).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
        </Stack>
        <Stack direction="row" gap="sm" wrap>
          {(['neutral', 'primary', 'secondary', 'danger', 'warning', 'success', 'info'] as const).map((v) => (
            <Chip key={v} variant={v} selectable>
              {v}
            </Chip>
          ))}
        </Stack>
        <Stack direction="row" gap="sm" wrap>
          <Chip selectable defaultSelected>
            Selected
          </Chip>
          <Chip removable start={<SearchIcon />}>
            Removable
          </Chip>
          <Chip disabled selectable>
            Disabled
          </Chip>
        </Stack>
      </Stack>
    ),
  },
  {
    id: 'typography',
    title: 'Typography',
    render: () => (
      <Stack gap="xs">
        {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'body-sm', 'caption', 'label', 'overline'] as const).map((v) => (
          <Typography key={v} variant={v}>
            {v} The quick brown fox
          </Typography>
        ))}
        <Typography color="brand">Brand text</Typography>
        <Typography color="subtle" truncate>
          Subtle and truncated text that goes on and on and on and on and on and on and on and on and on
        </Typography>
      </Stack>
    ),
  },
  {
    id: 'layout',
    title: 'Box, Grid, Container, Divider',
    render: () => (
      <Stack gap="md">
        <Grid columns={3} gap="sm">
          <Box bg="muted" padding="sm" radius="md">
            <Typography>1</Typography>
          </Box>
          <GridItem span={2}>
            <Box bg="subtle" padding="sm" radius="md" border>
              <Typography>span 2</Typography>
            </Box>
          </GridItem>
          <GridItem full>
            <Box bg="inverse" padding="sm" radius="md">
              <Typography>full</Typography>
            </Box>
          </GridItem>
        </Grid>
        <Container size="sm">
          <Box bg="muted" padding="sm">
            <Typography>Container sm</Typography>
          </Box>
        </Container>
        <Divider>or</Divider>
        <Stack direction="row" gap="none" align="center">
          <Typography>Left</Typography>
          <Divider orientation="vertical" />
          <Typography>Right</Typography>
        </Stack>
      </Stack>
    ),
  },
  {
    id: 'surfaces',
    title: 'Card, Paper, Notification',
    render: () => (
      <Stack gap="lg">
        <Card header={<Typography variant="h5">Card title</Typography>} footer={<Button size="sm">Action</Button>}>
          <Typography>Card body text.</Typography>
        </Card>
        <Stack direction="row" gap="lg">
          {([0, 1, 2, 3] as const).map((e) => (
            <Paper key={e} elevation={e} padding="sm">
              <Typography>Paper {e}</Typography>
            </Paper>
          ))}
        </Stack>
        {(['info', 'success', 'warning', 'danger'] as const).map((v) => (
          <Notification key={v} variant={v} heading={`${v} heading`} dismissible elevation={2}>
            Something happened.
          </Notification>
        ))}
      </Stack>
    ),
  },
  {
    id: 'list',
    title: 'List',
    render: () => (
      <List label="Files">
        <ListItem start={<Icon name="info" />} end={<Badge>New</Badge>} secondary="Updated today">
          Report
        </ListItem>
        <ListItem interactive selected>
          Selected row
        </ListItem>
        <ListItem href="https://example.com">Link row</ListItem>
        <ListItem interactive disabled>
          Disabled row
        </ListItem>
      </List>
    ),
  },
  {
    id: 'navigation',
    title: 'Tabs, Breadcrumbs, Link, Accordion',
    render: () => (
      <Stack gap="lg">
        <Tabs label="Settings" defaultValue="b">
          <Tab value="a">General</Tab>
          <Tab value="b">Billing</Tab>
          <Tab value="c" disabled>
            Team
          </Tab>
          <TabPanel value="a">General panel</TabPanel>
          <TabPanel value="b">Billing panel</TabPanel>
          <TabPanel value="c">Team panel</TabPanel>
        </Tabs>
        <Breadcrumbs>
          <BreadcrumbItem href="https://example.com">Home</BreadcrumbItem>
          <BreadcrumbItem href="https://example.com">Settings</BreadcrumbItem>
          <BreadcrumbItem>Profile</BreadcrumbItem>
        </Breadcrumbs>
        <Typography>
          Read the <Link href="https://example.com">guide</Link> or the{' '}
          <Link href="https://example.com" target="_blank">
            external docs
          </Link>
          .
        </Typography>
        <Accordion>
          <AccordionItem heading="Open section" defaultOpen>
            Content
          </AccordionItem>
          <AccordionItem heading="Closed section">Content</AccordionItem>
          <AccordionItem heading="Disabled" disabled>
            Content
          </AccordionItem>
        </Accordion>
      </Stack>
    ),
  },
  {
    id: 'skeleton',
    title: 'Skeleton and Icon',
    render: () => (
      <Stack gap="md">
        <Skeleton lines={3} />
        <Stack direction="row" gap="md" align="center">
          <Skeleton variant="circle" />
          <Skeleton variant="rect" width={192} />
        </Stack>
        <Stack direction="row" gap="sm" align="center">
          <Icon name="search" size="sm" />
          <Icon name="search" />
          <Icon name="search" size="lg" color="brand" />
          <Icon name="warning" color="warning" />
          <Icon name="error" color="danger" />
          <Icon name="check-circle" color="success" />
        </Stack>
      </Stack>
    ),
  },
  {
    id: 'overlays',
    title: 'Dialog, Drawer, Menu, Tooltip, Backdrop',
    render: ({ open }) => <Overlays key={open ?? ''} initial={open} />,
  },
];

/** Buttons that open each overlay; `?open=<name>` (web) opens one straight away for screenshots. */
function Overlays({ initial }: { initial: string | null }) {
  const [open, setOpen] = useState<string | null>(initial);
  const close = () => setOpen(null);
  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" wrap>
        <Button onPress={() => setOpen('dialog')}>Dialog</Button>
        <Button variant="secondary" onPress={() => setOpen('drawer')}>
          Drawer
        </Button>
        <Button variant="ghost" onPress={() => setOpen('backdrop')}>
          Backdrop
        </Button>
      </Stack>
      <Stack direction="row" gap="lg" align="center">
        <Menu
          open={open === 'menu'}
          onOpenChange={(o) => setOpen(o ? 'menu' : null)}
          trigger={
            <IconButton label="More">
              <MoreVerticalIcon />
            </IconButton>
          }
        >
          <MenuItem value="edit">Edit</MenuItem>
          <MenuItem value="copy" end="⌘C">
            Copy
          </MenuItem>
          <MenuItem value="off" disabled>
            Disabled
          </MenuItem>
          <MenuItem value="delete" variant="danger">
            Delete
          </MenuItem>
        </Menu>
        <Tooltip content="Copy link">
          <Button variant="ghost">Long-press me</Button>
        </Tooltip>
      </Stack>
      <Dialog
        open={open === 'dialog'}
        onClose={close}
        heading="Delete file?"
        footer={
          <>
            <Button variant="ghost" onPress={close}>
              Cancel
            </Button>
            <Button variant="danger" onPress={close}>
              Delete
            </Button>
          </>
        }
      >
        This can't be undone.
      </Dialog>
      <Drawer open={open === 'drawer'} onClose={close} heading="Filters" footer={<Button onPress={close}>Apply</Button>}>
        Drawer body
      </Drawer>
      <Backdrop open={open === 'backdrop'} onClose={close}>
        <Typography>Loading…</Typography>
      </Backdrop>
    </Stack>
  );
}
