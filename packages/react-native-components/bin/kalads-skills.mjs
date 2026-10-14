#!/usr/bin/env node
/**
 * kalads-skills: makes the KalaDS agent skills of the installed KalaDS packages available to coding agents.
 *
 *   pnpm exec kalads-skills           link the skills into .claude/skills and .agents/skills, update AGENTS.md
 *   pnpm exec kalads-skills --copy    copy instead of symlinking (for environments without symlinks)
 *   pnpm exec kalads-skills --check   exit 1 when the skills are missing or out of date (for CI)
 *
 * Run it in the project root. Each @kalads component package ships its skill in skills/<name>/; this finds
 * the ones installed in ./node_modules/@kalads, so the skill always matches the installed version.
 */
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const args = new Set(process.argv.slice(2));
if (args.has('--help') || args.has('-h')) {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').match(/\/\*\*([^]*?)\*\//)[1].replace(/^ \* ?/gm, ''));
  process.exit(0);
}
const copy = args.has('--copy');
const check = args.has('--check');
const root = process.cwd();
const TARGETS = ['.claude/skills', '.agents/skills'];
const START = '<!-- kalads-skills:start -->';
const END = '<!-- kalads-skills:end -->';

/** Skills of the @kalads packages installed in this project: { name, dir, pkg, version }. */
function installedSkills() {
  const scope = join(root, 'node_modules', '@kalads');
  if (!existsSync(scope)) return [];
  const skills = [];
  for (const pkgName of readdirSync(scope)) {
    const pkgDir = join(scope, pkgName);
    const skillsDir = join(pkgDir, 'skills');
    if (!existsSync(skillsDir)) continue;
    const { name, version } = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
    for (const skill of readdirSync(skillsDir)) {
      if (existsSync(join(skillsDir, skill, 'SKILL.md'))) skills.push({ name: skill, dir: join(skillsDir, skill), pkg: name, version });
    }
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

function agentsBlock(skills) {
  const lines = skills.map((s) => `- \`.agents/skills/${s.name}/SKILL.md\` (${s.pkg} ${s.version})`);
  const checks = skills.map((s) => `node .agents/skills/${s.name}/scripts/check.mjs <changed files>`);
  return `${START}
## KalaDS

This project builds its interface with the KalaDS design system. Before writing or changing UI code, read
the KalaDS skill for the platform you're working on and follow its rules:

${lines.join('\n')}

Before finishing a UI change, run that skill's checker and fix what it reports:

\`\`\`sh
${checks.join('\n')}
\`\`\`
${END}`;
}

function inSync(skill, target) {
  const dest = join(root, target, skill.name);
  if (!existsSync(dest)) return false;
  if (lstatSync(dest).isSymbolicLink()) return resolve(dirname(dest), readlinkSync(dest)) === skill.dir;
  // A copy: compare the version line in SKILL.md.
  return readFileSync(join(dest, 'SKILL.md'), 'utf8') === readFileSync(join(skill.dir, 'SKILL.md'), 'utf8');
}

const skills = installedSkills();
if (!skills.length) {
  console.error('kalads-skills: no KalaDS skills found in ./node_modules/@kalads. Run it in the project root, after pnpm install.');
  process.exit(1);
}

const agentsFile = join(root, 'AGENTS.md');
const agents = existsSync(agentsFile) ? readFileSync(agentsFile, 'utf8') : '';
const block = agentsBlock(skills);

if (check) {
  const stale = skills.flatMap((s) => TARGETS.filter((t) => !inSync(s, t)).map((t) => `${t}/${s.name}`));
  if (!agents.includes(block)) stale.push('AGENTS.md');
  if (stale.length) {
    console.error(`kalads-skills: out of date: ${stale.join(', ')}. Run \`pnpm exec kalads-skills\`.`);
    process.exit(1);
  }
  console.log(`kalads-skills: up to date (${skills.map((s) => s.name).join(', ')}).`);
  process.exit(0);
}

for (const target of TARGETS) {
  mkdirSync(join(root, target), { recursive: true });
  for (const skill of skills) {
    const dest = join(root, target, skill.name);
    rmSync(dest, { recursive: true, force: true });
    if (copy) cpSync(skill.dir, dest, { recursive: true });
    else symlinkSync(relative(dirname(dest), skill.dir), dest, 'dir');
  }
}

const marked = new RegExp(`${START}[^]*?${END}`);
const nextAgents = marked.test(agents) ? agents.replace(marked, block) : `${agents}${agents && !agents.endsWith('\n\n') ? (agents.endsWith('\n') ? '\n' : '\n\n') : ''}${block}\n`;
writeFileSync(agentsFile, nextAgents);

for (const s of skills) console.log(`kalads-skills: ${s.name} (${s.pkg} ${s.version}) → ${TARGETS.map((t) => `${t}/${s.name}`).join(', ')}`);
console.log(`kalads-skills: AGENTS.md ${marked.test(agents) ? 'updated' : 'written'}.`);
