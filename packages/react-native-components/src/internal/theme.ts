import { tokens } from '@kalads/tokens/native';

/** All tokens as React Native values (numbers for dimensions), from @kalads/tokens/native. */
export const t = tokens;
/** Component tokens: c.button.primary.bg. */
export const c = tokens.component;
/** Semantic tokens: s.spacing.md, s.text.default. */
export const s = tokens.semantic;

/** A KalaDS spacing name to its value in dp. */
export type SpacingName = keyof typeof tokens.semantic.spacing;
export const space = (name: SpacingName | undefined) => (name === undefined ? undefined : tokens.semantic.spacing[name]);
