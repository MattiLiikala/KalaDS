import { useEffect, useRef, type ReactNode } from 'react';
import { Autocomplete, Backdrop, Button, Dialog, Drawer, IconButton, Menu, MenuItem, Tooltip, Typography } from '@kalads/react-components';
import { MoreVerticalIcon } from '@kalads/icons/react';

/**
 * Open overlays, one per page (`#overlay/<id>/react` or `#overlay/<id>/web`), since modal surfaces cover
 * the page. The web side opens the same overlay on the web component.
 */
export const overlays: Record<string, { react: ReactNode; web: string; open?: (root: HTMLElement) => void }> = {
  dialog: {
    react: (
      <Dialog defaultOpen heading="Delete file?" footer={<><Button variant="ghost">Cancel</Button><Button variant="danger">Delete</Button></>}>
        <Typography>This can't be undone.</Typography>
      </Dialog>
    ),
    web: `<kds-dialog open heading="Delete file?"><kds-typography>This can't be undone.</kds-typography>
      <kds-button slot="footer" variant="ghost">Cancel</kds-button><kds-button slot="footer" variant="danger">Delete</kds-button></kds-dialog>`,
  },
  drawer: {
    react: (
      <Drawer defaultOpen heading="Filters" footer={<Button>Apply</Button>}>
        <Typography>Drawer body</Typography>
      </Drawer>
    ),
    web: `<kds-drawer open heading="Filters"><kds-typography>Drawer body</kds-typography><kds-button slot="footer">Apply</kds-button></kds-drawer>`,
  },
  menu: {
    react: (
      <Menu defaultOpen trigger={<IconButton label="More"><MoreVerticalIcon /></IconButton>}>
        <MenuItem value="edit">Edit</MenuItem>
        <MenuItem value="copy" end="⌘C">Copy</MenuItem>
        <MenuItem value="off" disabled>Disabled</MenuItem>
        <MenuItem value="delete" variant="danger">Delete</MenuItem>
      </Menu>
    ),
    web: `<kds-menu open><kds-icon-button slot="trigger" label="More"><kds-icon-more-vertical></kds-icon-more-vertical></kds-icon-button>
      <kds-menu-item value="edit">Edit</kds-menu-item><kds-menu-item value="copy">Copy<span slot="end">⌘C</span></kds-menu-item>
      <kds-menu-item value="off" disabled>Disabled</kds-menu-item><kds-menu-item value="delete" variant="danger">Delete</kds-menu-item></kds-menu>`,
  },
  tooltip: {
    react: (
      <Tooltip content="Copy link">
        <Button>Hover me</Button>
      </Tooltip>
    ),
    web: `<kds-tooltip content="Copy link"><kds-button>Hover me</kds-button></kds-tooltip>`,
    open: (root) => (root.querySelector('button') ?? root.querySelector('kds-button'))?.focus(),
  },
  autocomplete: {
    react: (
      <Autocomplete label="Country">
        <option value="fi">Finland</option>
        <option value="fr">France</option>
        <option value="de" disabled>Germany</option>
      </Autocomplete>
    ),
    web: `<kds-autocomplete label="Country"><option value="fi">Finland</option><option value="fr">France</option><option value="de" disabled>Germany</option></kds-autocomplete>`,
    open: (root) => {
      const input = (root.querySelector('kds-autocomplete')?.shadowRoot ?? root).querySelector('input');
      input?.click();
    },
  },
  backdrop: {
    react: (
      <Backdrop open>
        <Typography color="inverse">Loading…</Typography>
      </Backdrop>
    ),
    web: `<kds-backdrop open><kds-typography color="inverse">Loading…</kds-typography></kds-backdrop>`,
  },
};

export function OverlayPage({ id, side }: { id: string; side: 'react' | 'web' }) {
  const ref = useRef<HTMLDivElement>(null);
  const overlay = overlays[id];
  useEffect(() => {
    const root = ref.current;
    if (root && overlay?.open) setTimeout(() => overlay.open!(root), 400);
  }, [overlay]);
  if (!overlay) return <p>Unknown overlay {id}</p>;
  return (
    <div ref={ref} style={{ padding: 'var(--kds-semantic-spacing-xl)' }}>
      {side === 'react' ? overlay.react : <div dangerouslySetInnerHTML={{ __html: overlay.web }} />}
    </div>
  );
}
