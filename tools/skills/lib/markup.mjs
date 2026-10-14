/**
 * The markup a React or React Native docs snippet returns, dedented. Snippets are whole components so
 * they type-check; the docs and the agent skills show only the usage. Shared by Storybook's
 * FrameworkTabs and the skills generator, so both show the same code.
 */
export function markup(code) {
  const match = code.match(/\n([ \t]*)return \(\n([\s\S]*?)\n\1\);\n/);
  if (!match) throw new Error('A snippet must return its markup as `return (\n…\n);`');
  const lines = match[2].split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

/** The snippet's import lines (multi-line imports included), without type-only imports. */
export function imports(code) {
  return [...code.matchAll(/^import (?!type )[\s\S]*?;$/gm)].map((m) => m[0]).join('\n');
}
