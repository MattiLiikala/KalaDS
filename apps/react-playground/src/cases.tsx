import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionItem,
  Autocomplete,
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
  Divider,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  Link,
  List,
  ListItem,
  Notification,
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
  Typography,
} from '@kalads/react-components';
import { ArrowRightIcon, CloseIcon, PlusIcon, SearchIcon } from '@kalads/icons/react';

/** One parity case: the same UI built with the React components and with the web components. */
export interface Case {
  id: string;
  title: string;
  react: ReactNode;
  web: string;
}

const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;

export const cases: Case[] = [
  {
    id: 'button',
    title: 'Button: variants, sizes, icons, disabled',
    react: (
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
    web: `
      <kds-stack gap="md">
        <kds-stack direction="row" gap="sm" align="center" wrap>
          ${variants.map((v) => `<kds-button variant="${v}">Button</kds-button>`).join('')}
        </kds-stack>
        <kds-stack direction="row" gap="sm" align="center" wrap>
          <kds-button size="sm">Small</kds-button>
          <kds-button size="md">Medium</kds-button>
          <kds-button size="lg">Large</kds-button>
        </kds-stack>
        <kds-stack direction="row" gap="sm" align="center" wrap>
          <kds-button><kds-icon-plus slot="start"></kds-icon-plus>Add item</kds-button>
          <kds-button variant="secondary">Next<kds-icon-arrow-right slot="end"></kds-icon-arrow-right></kds-button>
          <kds-button disabled>Disabled</kds-button>
          <kds-button variant="ghost" disabled>Disabled</kds-button>
        </kds-stack>
      </kds-stack>`,
  },
  {
    id: 'button-inverse',
    title: 'Button and IconButton on inverse',
    react: (
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
    web: `
      <kds-box bg="inverse" padding="md">
        <kds-stack direction="row" gap="sm" align="center" wrap>
          ${variants.map((v) => `<kds-button variant="${v}" on-inverse>Button</kds-button>`).join('')}
          <kds-icon-button variant="primary" on-inverse label="Add"><kds-icon-plus></kds-icon-plus></kds-icon-button>
        </kds-stack>
      </kds-box>`,
  },
  {
    id: 'icon-button',
    title: 'IconButton: sizes next to Button',
    react: (
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
    web: `
      <kds-stack gap="sm">
        ${['sm', 'md', 'lg']
          .map(
            (size) => `
          <kds-stack direction="row" gap="sm" align="center">
            <kds-button size="${size}">Search</kds-button>
            <kds-icon-button size="${size}" label="Search"><kds-icon-search></kds-icon-search></kds-icon-button>
            <kds-icon-button size="${size}" variant="primary" label="Search"><kds-icon-search></kds-icon-search></kds-icon-button>
            <kds-icon-button size="${size}" variant="danger" label="Close"><kds-icon-close></kds-icon-close></kds-icon-button>
          </kds-stack>`,
          )
          .join('')}
      </kds-stack>`,
  },
  {
    id: 'input',
    title: 'Input, Select, Autocomplete',
    react: (
      <Stack gap="md">
        <Input label="Email" placeholder="you@example.com" helper="We never share it." />
        <Input label="Name" defaultValue="Ada" error="Name is taken" required />
        <Input label="Disabled" disabled defaultValue="Read only" />
        <Select label="Fruit" placeholder="Pick one" helper="Seasonal">
          <option value="a">Apple</option>
          <option value="b">Banana</option>
        </Select>
        <Select label="Error" error="Choose a fruit" defaultValue="a">
          <option value="a">Apple</option>
        </Select>
        <Autocomplete label="Country" placeholder="Type to search" defaultValue="fi">
          <option value="fi">Finland</option>
          <option value="fr">France</option>
        </Autocomplete>
      </Stack>
    ),
    web: `
      <kds-stack gap="md">
        <kds-input label="Email" placeholder="you@example.com" helper="We never share it."></kds-input>
        <kds-input label="Name" value="Ada" error="Name is taken" required></kds-input>
        <kds-input label="Disabled" disabled value="Read only"></kds-input>
        <kds-select label="Fruit" placeholder="Pick one" helper="Seasonal">
          <option value="a">Apple</option>
          <option value="b">Banana</option>
        </kds-select>
        <kds-select label="Error" error="Choose a fruit" value="a"><option value="a">Apple</option></kds-select>
        <kds-autocomplete label="Country" placeholder="Type to search" value="fi">
          <option value="fi">Finland</option>
          <option value="fr">France</option>
        </kds-autocomplete>
      </kds-stack>`,
  },
  {
    id: 'choices',
    title: 'Checkbox, Radio, Toggle',
    react: (
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
    web: `
      <kds-stack gap="lg">
        <kds-checkbox-group label="Toppings" helper="Pick any">
          <kds-checkbox checked>Cheese</kds-checkbox>
          <kds-checkbox indeterminate>Some sauces</kds-checkbox>
          <kds-checkbox>Olives</kds-checkbox>
          <kds-checkbox disabled checked>Disabled</kds-checkbox>
        </kds-checkbox-group>
        <kds-radio-group label="Size" value="m" orientation="horizontal">
          <kds-radio value="s">Small</kds-radio>
          <kds-radio value="m">Medium</kds-radio>
          <kds-radio value="l" disabled>Large</kds-radio>
        </kds-radio-group>
        <kds-stack gap="sm">
          <kds-toggle>Wi-Fi</kds-toggle>
          <kds-toggle checked>Bluetooth</kds-toggle>
          <kds-toggle disabled>Airplane mode</kds-toggle>
        </kds-stack>
      </kds-stack>`,
  },
  {
    id: 'badge-chip',
    title: 'Badge and Chip',
    react: (
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
    web: `
      <kds-stack gap="md">
        <kds-stack direction="row" gap="sm" wrap>
          ${['default', 'primary', 'danger', 'warning', 'success'].map((v) => `<kds-badge variant="${v}">${v}</kds-badge>`).join('')}
        </kds-stack>
        <kds-stack direction="row" gap="sm" wrap>
          ${['neutral', 'primary', 'secondary', 'danger', 'warning', 'success', 'info']
            .map((v) => `<kds-chip variant="${v}" selectable>${v}</kds-chip>`)
            .join('')}
        </kds-stack>
        <kds-stack direction="row" gap="sm" wrap>
          <kds-chip selectable selected>Selected</kds-chip>
          <kds-chip removable><kds-icon-search slot="start"></kds-icon-search>Removable</kds-chip>
          <kds-chip disabled selectable>Disabled</kds-chip>
        </kds-stack>
      </kds-stack>`,
  },
  {
    id: 'typography',
    title: 'Typography',
    react: (
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
    web: `
      <kds-stack gap="xs">
        ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'body-sm', 'caption', 'label', 'overline']
          .map((v) => `<kds-typography variant="${v}">${v} The quick brown fox</kds-typography>`)
          .join('')}
        <kds-typography color="brand">Brand text</kds-typography>
        <kds-typography color="subtle" truncate>Subtle and truncated text that goes on and on and on and on and on and on and on and on and on</kds-typography>
      </kds-stack>`,
  },
  {
    id: 'layout',
    title: 'Box, Grid, Container, Divider',
    react: (
      <Stack gap="md">
        <Grid columns={3} gap="sm">
          <Box bg="muted" padding="sm" radius="md">
            1
          </Box>
          <GridItem span={2}>
            <Box bg="subtle" padding="sm" radius="md" border>
              span 2
            </Box>
          </GridItem>
          <GridItem full>
            <Box bg="inverse" padding="sm" radius="md">
              full
            </Box>
          </GridItem>
        </Grid>
        <Container size="sm">
          <Box bg="muted" padding="sm">
            Container sm
          </Box>
        </Container>
        <Divider>or</Divider>
        <Stack direction="row" gap="none" align="center">
          <span>Left</span>
          <Divider orientation="vertical" />
          <span>Right</span>
        </Stack>
      </Stack>
    ),
    web: `
      <kds-stack gap="md">
        <kds-grid columns="3" gap="sm">
          <kds-box bg="muted" padding="sm" radius="md">1</kds-box>
          <kds-grid-item span="2"><kds-box bg="subtle" padding="sm" radius="md" border>span 2</kds-box></kds-grid-item>
          <kds-grid-item full><kds-box bg="inverse" padding="sm" radius="md">full</kds-box></kds-grid-item>
        </kds-grid>
        <kds-container size="sm"><kds-box bg="muted" padding="sm">Container sm</kds-box></kds-container>
        <kds-divider>or</kds-divider>
        <kds-stack direction="row" gap="none" align="center">
          <span>Left</span><kds-divider orientation="vertical"></kds-divider><span>Right</span>
        </kds-stack>
      </kds-stack>`,
  },
  {
    id: 'surfaces',
    title: 'Card, Paper, Notification',
    react: (
      <Stack gap="lg">
        <Card header={<Typography variant="h5">Card title</Typography>} footer={<Button size="sm">Action</Button>}>
          <Typography>Card body text.</Typography>
        </Card>
        <Stack direction="row" gap="lg">
          {([0, 1, 2, 3] as const).map((e) => (
            <Paper key={e} elevation={e} padding="sm">
              Paper {e}
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
    web: `
      <kds-stack gap="lg">
        <kds-card>
          <kds-typography slot="header" variant="h5">Card title</kds-typography>
          <kds-typography>Card body text.</kds-typography>
          <kds-button slot="footer" size="sm">Action</kds-button>
        </kds-card>
        <kds-stack direction="row" gap="lg">
          ${[0, 1, 2, 3].map((e) => `<kds-paper elevation="${e}" padding="sm">Paper ${e}</kds-paper>`).join('')}
        </kds-stack>
        ${['info', 'success', 'warning', 'danger']
          .map((v) => `<kds-notification variant="${v}" heading="${v} heading" dismissible elevation="2">Something happened.</kds-notification>`)
          .join('')}
      </kds-stack>`,
  },
  {
    id: 'list',
    title: 'List',
    react: (
      <List label="Files">
        <ListItem start={<Icon name="info" />} end={<Badge>New</Badge>} secondary="Updated today">
          Report
        </ListItem>
        <ListItem interactive selected>
          Selected row
        </ListItem>
        <ListItem href="#">Link row</ListItem>
        <ListItem interactive disabled>
          Disabled row
        </ListItem>
      </List>
    ),
    web: `
      <kds-list label="Files">
        <kds-list-item><kds-icon slot="start" name="info"></kds-icon>Report<span slot="secondary">Updated today</span><kds-badge slot="end">New</kds-badge></kds-list-item>
        <kds-list-item interactive selected>Selected row</kds-list-item>
        <kds-list-item href="#">Link row</kds-list-item>
        <kds-list-item interactive disabled>Disabled row</kds-list-item>
      </kds-list>`,
  },
  {
    id: 'navigation',
    title: 'Tabs, Breadcrumbs, Link, Accordion',
    react: (
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
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Settings</BreadcrumbItem>
          <BreadcrumbItem>Profile</BreadcrumbItem>
        </Breadcrumbs>
        <Typography>
          Read the <Link href="#">guide</Link> or the{' '}
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
    web: `
      <kds-stack gap="lg">
        <kds-tabs label="Settings" value="b">
          <kds-tab value="a">General</kds-tab>
          <kds-tab value="b">Billing</kds-tab>
          <kds-tab value="c" disabled>Team</kds-tab>
          <kds-tab-panel value="a">General panel</kds-tab-panel>
          <kds-tab-panel value="b">Billing panel</kds-tab-panel>
          <kds-tab-panel value="c">Team panel</kds-tab-panel>
        </kds-tabs>
        <kds-breadcrumbs>
          <kds-breadcrumb-item href="#">Home</kds-breadcrumb-item>
          <kds-breadcrumb-item href="#">Settings</kds-breadcrumb-item>
          <kds-breadcrumb-item>Profile</kds-breadcrumb-item>
        </kds-breadcrumbs>
        <kds-typography>Read the <kds-link href="#">guide</kds-link> or the <kds-link href="https://example.com" target="_blank">external docs</kds-link>.</kds-typography>
        <kds-accordion>
          <kds-accordion-item heading="Open section" open>Content</kds-accordion-item>
          <kds-accordion-item heading="Closed section">Content</kds-accordion-item>
          <kds-accordion-item heading="Disabled" disabled>Content</kds-accordion-item>
        </kds-accordion>
      </kds-stack>`,
  },
  {
    id: 'skeleton',
    title: 'Skeleton and Icon',
    react: (
      <Stack gap="md">
        <Skeleton lines={3} />
        <Stack direction="row" gap="md" align="center">
          <Skeleton variant="circle" />
          <Skeleton variant="rect" width="12rem" />
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
    web: `
      <kds-stack gap="md">
        <kds-skeleton lines="3"></kds-skeleton>
        <kds-stack direction="row" gap="md" align="center">
          <kds-skeleton variant="circle"></kds-skeleton>
          <kds-skeleton variant="rect" width="12rem"></kds-skeleton>
        </kds-stack>
        <kds-stack direction="row" gap="sm" align="center">
          <kds-icon name="search" size="sm"></kds-icon>
          <kds-icon name="search"></kds-icon>
          <kds-icon name="search" size="lg" color="brand"></kds-icon>
          <kds-icon name="warning" color="warning"></kds-icon>
          <kds-icon name="error" color="danger"></kds-icon>
          <kds-icon name="check-circle" color="success"></kds-icon>
        </kds-stack>
      </kds-stack>`,
  },
];
