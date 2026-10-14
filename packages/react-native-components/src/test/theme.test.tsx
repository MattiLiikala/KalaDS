import { fireEvent, render, screen } from '@testing-library/react-native';
import * as ReactNative from 'react-native';
import { StyleSheet } from 'react-native';
import { CloseIcon, PlusIcon, SearchIcon } from '@kalads/icons/native';
import { themes, type Tokens } from '@kalads/tokens/native';
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
  KalaThemeProvider,
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
} from '../index';
import { ThemeTokensProvider } from '../internal/theme';

const isColour = (v: unknown): v is string => typeof v === 'string' && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v);

/** Every colour of the palette: what a component would render if it read a colour without the theme. */
const palette = new Set<string>();
(function collect(node: unknown) {
  if (isColour(node)) palette.add(node.toLowerCase());
  else if (node && typeof node === 'object') Object.values(node).forEach(collect);
})(themes);

/** The light theme with every colour replaced by a unique colour outside the palette. */
function sentinelTheme(): Tokens {
  let n = 0;
  const swap = (node: unknown): unknown => {
    if (isColour(node)) {
      let colour: string;
      do colour = `#${(0x010203 + n++ * 7).toString(16).padStart(6, '0')}`;
      while (palette.has(colour));
      return colour;
    }
    if (Array.isArray(node)) return node.map(swap);
    if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, swap(v)]));
    return node;
  };
  return swap(themes.light) as Tokens;
}

/** Every component, in the states that change colour. */
function Gallery() {
  return (
    <Container>
      <Stack gap="md">
        <Typography variant="h2">Heading</Typography>
        {(['default', 'subtle', 'muted', 'brand', 'danger'] as const).map((color) => (
          <Typography key={color} color={color}>
            {color}
          </Typography>
        ))}
        {(['primary', 'secondary', 'danger', 'ghost'] as const).map((variant) => (
          <Stack key={variant} direction="row">
            <Button variant={variant} start={<PlusIcon />}>
              {variant}
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
            <Box bg="inverse">
              <Button variant={variant} onInverse>
                On inverse
              </Button>
            </Box>
            <IconButton variant={variant} label="Close">
              <CloseIcon />
            </IconButton>
          </Stack>
        ))}
        <Input label="Email" helper="We never share it" />
        <Input label="Email" error="Enter an email address" />
        <Input label="Email" disabled />
        <Select label="Size" defaultValue="m">
          <Option value="m">Medium</Option>
        </Select>
        <Autocomplete label="City">
          <Option value="helsinki">Helsinki</Option>
        </Autocomplete>
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox disabled>Disabled</Checkbox>
        <CheckboxGroup label="Toppings">
          <Checkbox>A</Checkbox>
        </CheckboxGroup>
        <RadioGroup label="Plan" defaultValue="a">
          <Radio value="a">A</Radio>
          <Radio value="b" disabled>
            B
          </Radio>
        </RadioGroup>
        <Toggle defaultChecked>On</Toggle>
        <Toggle>Off</Toggle>
        {(['default', 'primary', 'danger', 'warning', 'success'] as const).map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
        <Chip>Neutral</Chip>
        <Chip variant="primary" selected start={<SearchIcon />}>
          Selected
        </Chip>
        <Icon name="search" color="brand" />
        <Icon name="search" />
        <Divider>or</Divider>
        <Box bg="subtle" border padding="md" />
        <Paper elevation={2} />
        <Card header={<Typography>Header</Typography>} footer={<Button>Go</Button>} interactive onPress={() => {}}>
          <Typography>Body</Typography>
        </Card>
        {(['info', 'success', 'warning', 'danger'] as const).map((variant) => (
          <Notification key={variant} variant={variant} heading={variant} dismissible>
            Text
          </Notification>
        ))}
        <Skeleton lines={2} />
        <Skeleton variant="circle" />
        <Link href="https://example.com">Link</Link>
        <List>
          <ListItem selected>Selected</ListItem>
          <ListItem>Item</ListItem>
        </List>
        <Tabs defaultValue="a" label="Sections">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
          <TabPanel value="a">Panel</TabPanel>
        </Tabs>
        <Accordion>
          <AccordionItem heading="Open" defaultOpen>
            Content
          </AccordionItem>
        </Accordion>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem current>Page</BreadcrumbItem>
        </Breadcrumbs>
        <Grid columns={2}>
          <GridItem>Cell</GridItem>
        </Grid>
        <Menu trigger={<Button variant="ghost">Actions</Button>}>
          <MenuItem value="edit" start={<PlusIcon />}>
            Edit
          </MenuItem>
          <MenuItem value="delete" variant="danger">
            Delete
          </MenuItem>
        </Menu>
        <Tooltip content="Tip">
          <IconButton label="Info">
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Dialog open heading="Dialog" footer={<Button>OK</Button>}>
          Text
        </Dialog>
        <Drawer open heading="Drawer">
          Text
        </Drawer>
        <Backdrop open />
      </Stack>
    </Container>
  );
}

/** Colours in rendered props (styles, icon fills, shadows), across the whole tree. */
function coloursIn(root: ReturnType<typeof render>['UNSAFE_root']) {
  const found = new Set<string>();
  const walk = (value: unknown, seen: Set<unknown>) => {
    if (isColour(value)) found.add(value.toLowerCase());
    // Plain props only: React elements (slot props like `start`) are rendered nodes of their own.
    else if (value && typeof value === 'object' && !seen.has(value) && !('$$typeof' in value)) {
      seen.add(value);
      if (Array.isArray(value)) value.forEach((v) => walk(v, seen));
      else for (const [k, v] of Object.entries(value)) if (k !== 'children') walk(v, seen);
    }
  };
  for (const node of root.findAll(() => true, { deep: true })) walk(node.props, new Set());
  return found;
}

describe('themes', () => {
  it('every rendered colour comes from the active theme', () => {
    const { UNSAFE_root } = render(
      <ThemeTokensProvider theme={sentinelTheme()}>
        <Gallery />
      </ThemeTokensProvider>,
    );
    // Open the menu and the tooltip so their popups render too.
    fireEvent.press(screen.getByRole('button', { name: 'Actions' }));
    fireEvent(screen.getByRole('button', { name: 'Info' }), 'longPress');
    const found = coloursIn(UNSAFE_root);
    expect(found.size).toBeGreaterThan(20);
    // A palette colour here was read from the static (light) tokens instead of useTokens().
    expect([...found].filter((colour) => palette.has(colour))).toEqual([]);
  });

  /** The background of the button named Save. */
  const saveBg = () => StyleSheet.flatten(screen.getByRole('button', { name: 'Save' }).props.style).backgroundColor;

  it('KalaThemeProvider switches the colours', () => {
    render(<Button>Save</Button>);
    expect(saveBg()).toBe(themes.light.component.button.primary.bg);
    render(
      <KalaThemeProvider scheme="dark">
        <Button>Save</Button>
      </KalaThemeProvider>,
    );
    expect(saveBg()).toBe(themes.dark.component.button.primary.bg);
  });

  it('scheme="auto" follows the device appearance', () => {
    const appearance = jest.spyOn(ReactNative, 'useColorScheme');
    for (const scheme of ['dark', 'light'] as const) {
      appearance.mockReturnValue(scheme);
      render(
        <KalaThemeProvider scheme="auto">
          <Button>Save</Button>
        </KalaThemeProvider>,
      );
      expect(saveBg()).toBe(themes[scheme].component.button.primary.bg);
    }
    appearance.mockRestore();
  });
});
