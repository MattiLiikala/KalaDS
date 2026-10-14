/**
 * Reads each React / React Native component's own props from the packages' built type declarations with
 * the TypeScript compiler: the props declared by KalaDS (in the component or in @kalads/spec), with their
 * types and JSDoc. Inherited DOM / React Native props (onClick, aria-*, testID…) are left out.
 */
import ts from 'typescript';
import { join } from 'node:path';
import { mkdtempSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';

/**
 * The type as written in the declaration (`ReactNode`, `StyleProp<ViewStyle>`), except that a named union of
 * literals (`ButtonVariant`) is spelled out (`'primary' | 'secondary' | …`): the values are what callers need.
 */
function typeText(checker, decl, type) {
  const literals = type.isUnion() && type.types.every((t) => t.isLiteral() || t.flags & ts.TypeFlags.BooleanLiteral);
  if (literals || !decl.type) {
    return checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias).replace(/"/g, "'");
  }
  return decl.type.getText().replace(/\s+/g, ' ');
}

/**
 * @param {string} entry  path to the package's index.d.ts
 * @param {string[]} names component names (Button, Card…)
 * @param {string[]} ownRoots directories whose declarations count as KalaDS's (package dist, spec dist)
 */
export function readProps(entry, names, ownRoots) {
  const dir = mkdtempSync(join(tmpdir(), 'kalads-props-'));
  const probe = join(dir, 'probe.ts');
  writeFileSync(
    probe,
    `import type { ${names.map((n) => `${n}Props`).join(', ')} } from ${JSON.stringify(entry)};\n` +
      `import { ${names.join(', ')} } from ${JSON.stringify(entry)};\n` +
      `export const components = { ${names.join(', ')} };\n` +
      names.map((n) => `export type P_${n} = ${n}Props;`).join('\n'),
  );
  const program = ts.createProgram([probe], {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    jsx: ts.JsxEmit.ReactJSX,
  });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(probe);
  const roots = ownRoots.map((r) => realpathSync(r));
  const own = (decl) => {
    const file = realpathSync(decl.getSourceFile().fileName);
    return roots.some((r) => file.startsWith(r));
  };

  const result = {};
  const docs = {};
  for (const statement of source.statements) {
    // The components' own JSDoc: their description for this platform.
    if (ts.isVariableStatement(statement)) {
      for (const el of statement.declarationList.declarations[0].initializer.properties) {
        const symbol = checker.getShorthandAssignmentValueSymbol(el);
        const target = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
        docs[el.name.text] = ts.displayPartsToString(target?.getDocumentationComment(checker) ?? []).trim();
      }
      continue;
    }
    if (!ts.isTypeAliasDeclaration(statement)) continue;
    const name = statement.name.text.slice(2);
    const type = checker.getTypeAtLocation(statement);
    result[name] = checker
      .getPropertiesOfType(type)
      .filter((p) => (p.declarations ?? []).some(own))
      .map((p) => {
        const decl = p.declarations.find(own);
        const propType = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(p, decl));
        return {
          name: p.name,
          type: typeText(checker, decl, propType),
          optional: (p.flags & ts.SymbolFlags.Optional) !== 0,
          doc: ts.displayPartsToString(p.getDocumentationComment(checker)).replace(/\s+/g, ' ').trim(),
        };
      });
  }
  rmSync(dir, { recursive: true, force: true });
  return { props: result, docs };
}
