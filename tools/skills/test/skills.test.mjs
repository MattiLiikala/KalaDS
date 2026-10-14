/**
 * Checks the generated skills (run `pnpm build` first): complete, valid, consumer-only, and that each
 * skill's checker catches rule breaks without flagging correct code.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTS } from '@kalads/spec';
import { PLATFORMS } from '../templates/platforms.mjs';
import { readProps } from '../lib/props.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const packages = join(here, '../../../packages');
const manifest = JSON.parse(readFileSync(join(packages, 'web-components/custom-elements.json'), 'utf8'));
const elements = new Map(manifest.modules.flatMap((m) => (m.declarations ?? []).filter((d) => d.tagName).map((d) => [d.tagName, d])));
const names = COMPONENTS.map((c) => c.name);
const props = {
  react: readProps(join(packages, 'react-components/dist/types/index.d.ts'), names, [join(packages, 'react-components/dist'), join(packages, 'spec/dist')]).props,
  native: readProps(join(packages, 'react-native-components/dist/index.d.ts'), names, [join(packages, 'react-native-components/dist'), join(packages, 'spec/dist')]).props,
};

const skillDir = (p) => join(packages, p.dir, 'skills', p.skill);
const allMarkdown = (dir) =>
  readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith('.md'))
    .map((f) => [f, readFileSync(join(dir, f), 'utf8')]);

for (const [platform, p] of Object.entries(PLATFORMS)) {
  const dir = skillDir(p);

  test(`${p.skill}: SKILL.md has valid frontmatter and stays short`, () => {
    const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8');
    const front = skill.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/);
    assert.ok(front, 'frontmatter with name and description');
    assert.equal(front[1], p.skill);
    assert.match(front[1], /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(front[2].length <= 1024, 'description at most 1024 characters');
    assert.ok(skill.split('\n').length <= 200, 'SKILL.md at most 200 lines; details go in references/');
  });

  test(`${p.skill}: every component has a reference with all its props`, () => {
    const index = readFileSync(join(dir, 'references/components.md'), 'utf8');
    const pages = Object.fromEntries(readdirSync(join(dir, 'references/components')).map((f) => [f, readFileSync(join(dir, 'references/components', f), 'utf8')]));
    for (const { tag, name } of COMPONENTS) {
      const shown = platform === 'web' ? `<${tag}>` : name;
      assert.ok(index.includes(`\`${shown}\``), `${shown} in components.md`);
      const page = Object.values(pages).find((md) => md.includes(`### \`${shown}\``));
      assert.ok(page, `${shown} has a props section`);
      const section = page.split(`### \`${shown}\``)[1].split('\n### ')[0];
      // Web: every attribute. React / React Native: every prop the component declares (some leave out a
      // web attribute on purpose, e.g. Radio's `checked` is set by its group; @kalads/spec checks the API).
      const expected = platform === 'web' ? (elements.get(tag).attributes ?? []).map((a) => a.name) : props[platform][name].map((q) => q.name);
      for (const prop of expected) assert.ok(section.includes(`| \`${prop}\` |`), `${shown}: ${prop}`);
    }
  });

  test(`${p.skill}: links between references resolve`, () => {
    for (const [file, md] of allMarkdown(dir)) {
      for (const [, target] of md.matchAll(/\]\(([^)#]+\.md)\)/g)) {
        assert.ok(existsSync(join(dir, dirname(file), target)), `${file} → ${target}`);
      }
    }
  });

  test(`${p.skill}: only guidance for using the library`, () => {
    // Contributor rules (CLAUDE.md) and documentation-site wording must not leak into a published skill.
    const forbidden = /storybook|\bstor(y|ies)\b|custom-elements\.json|@property|declare global|\bcsspart\b|tokens\/src|CLAUDE\.md|monorepo|workspace:|contribut|props table|show code/i;
    for (const [file, md] of allMarkdown(dir)) {
      const hit = md.split('\n').find((line) => forbidden.test(line));
      assert.equal(hit, undefined, `${file}: ${hit}`);
    }
  });

  if (platform !== 'web') {
    test(`${p.skill}: no web component names`, () => {
      for (const [file, md] of allMarkdown(dir)) {
        const hit = md.replace(/--kds-[a-z0-9-]+/g, '').match(/(?<![-\w])kds-[a-z-]+/);
        assert.equal(hit, null, `${file}: ${hit?.[0]}`);
      }
    });
  }

  test(`${p.skill}: the checker flags rule breaks and passes correct code`, () => {
    const check = join(dir, 'scripts/check.mjs');
    const run = (target) => {
      try {
        return { code: 0, out: execFileSync('node', [check, target], { encoding: 'utf8' }) };
      } catch (e) {
        return { code: e.status, out: e.stdout };
      }
    };
    const fixtures = join(here, 'fixtures', platform);
    const good = run(join(fixtures, 'good'));
    assert.equal(good.code, 0, good.out);
    const bad = run(join(fixtures, 'bad'));
    assert.equal(bad.code, 1);
    const expected = {
      web: ['hardcoded size', 'hardcoded colour', 'inverse surface', 'inline style', 'native <button>', 'raw SVG', "palette token `--kds-color-neutral-200` doesn't follow dark mode"],
      react: ['hardcoded number', 'hardcoded colour', 'inverse surface', 'style sets backgroundColor', 'native <button>', 'native <input>', "palette token `--kds-color-primary-500` doesn't follow dark mode"],
      native: ['hardcoded number', 'hardcoded colour', 'inverse surface', '`TouchableOpacity`', '`Text`', 'static colour token `tokens.semantic.border`'],
    }[platform];
    for (const message of expected) assert.ok(bad.out.includes(message), `expected "${message}" in:\n${bad.out}`);
  });

  test(`${p.package}: ships the current kalads-skills command`, () => {
    const shipped = readFileSync(join(packages, p.dir, 'bin/kalads-skills.mjs'), 'utf8');
    assert.equal(shipped, readFileSync(join(here, '../src/kalads-skills.mjs'), 'utf8'));
    const pkg = JSON.parse(readFileSync(join(packages, p.dir, 'package.json'), 'utf8'));
    assert.equal(pkg.bin?.['kalads-skills'], './bin/kalads-skills.mjs');
    assert.ok(pkg.files.includes('skills') && pkg.files.includes('bin'));
  });
}
