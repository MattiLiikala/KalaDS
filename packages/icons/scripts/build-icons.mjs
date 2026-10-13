import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { glob } from 'glob';
import { optimize } from 'svgo';

const isWatch = process.argv.includes('--watch');

const SVGS_DIR = 'src/svgs';
const COMPONENTS_DIR = 'src/components';
const INDEX_FILE = 'src/index.ts';

const SVGO_CONFIG = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    {
      name: 'removeAttrs',
      params: { attrs: ['width', 'height', 'fill', 'stroke'] },
    },
    'cleanupIds',
    'removeUselessDefs',
    'convertColors',
    'mergePaths',
  ],
};

function toPascalCase(str) {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function generateComponent(name, optimizedSvg) {
  const className = `KdsIcon${toPascalCase(name)}`;
  const tagName = `kds-icon-${name}`;

  // The <svg> is always hidden from assistive technology; the host carries the role and name instead.
  const svg = optimizedSvg.replace('<svg', '<svg aria-hidden="true" focusable="false"');

  return `import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

/**
 * @element ${tagName}
 * @summary The "${name}" icon. Takes the text colour; size with --kds-icon-size.
 *
 * Decorative by default (hidden from assistive technology). Set the label attribute when the icon
 * carries meaning on its own: it is then announced as an image with that name.
 *
 * @attr {string} label - Accessible name. Leave empty for decorative icons.
 */
@customElement('${tagName}')
export class ${className} extends LitElement {
  static styles = css\`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--kds-icon-size, 1.5rem);
      height: var(--kds-icon-size, 1.5rem);
      color: inherit;
      flex-shrink: 0;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  \`;

  @property({ reflect: true }) label = '';

  private _internals = this.attachInternals();

  protected updated() {
    this._internals.role = this.label ? 'img' : null;
    this._internals.ariaLabel = this.label || null;
  }

  render() {
    return html\`\${unsafeSVG(\`${svg}\`)}\`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    '${tagName}': ${className};
  }
}
`;
}

async function buildIcons() {
  const svgFiles = await glob(`${SVGS_DIR}/*.svg`);

  if (svgFiles.length === 0) {
    console.log('[icons] no SVG files found in src/svgs/');
    return [];
  }

  if (!existsSync(COMPONENTS_DIR)) {
    mkdirSync(COMPONENTS_DIR, { recursive: true });
  }

  const names = [];

  for (const svgPath of svgFiles) {
    const name = basename(svgPath, '.svg');
    const raw = readFileSync(svgPath, 'utf-8');
    const optimized = optimize(raw, SVGO_CONFIG);
    const svg = optimized.data;

    const component = generateComponent(name, svg);
    writeFileSync(join(COMPONENTS_DIR, `kds-icon-${name}.ts`), component);
    names.push(name);
  }

  const index = names
    .map((n) => `export { KdsIcon${toPascalCase(n)} } from './components/kds-icon-${n}.js';`)
    .join('\n') + '\n';

  writeFileSync(INDEX_FILE, index);
  console.log(`[icons] generated ${names.length} icon components`);
  return names;
}

await buildIcons();

if (isWatch) {
  const { default: chokidar } = await import('chokidar');
  chokidar.watch(`${SVGS_DIR}/*.svg`).on('change', async (path) => {
    console.log(`[icons] changed: ${path}`);
    await buildIcons();
  });
  chokidar.watch(`${SVGS_DIR}/*.svg`).on('add', async (path) => {
    console.log(`[icons] added: ${path}`);
    await buildIcons();
  });
  console.log('[icons] watching src/svgs/*.svg');
}
