// Config for `cem analyze` (custom-elements.json), picked up automatically; globs and outdir are set in
// the build script.
export default {
  plugins: [
    {
      // The analyzer lists modules in the order the file glob returns them, which differs between runs.
      // Sorting by path keeps the committed manifest stable: it only changes when a component does.
      name: 'kalads-sort-modules',
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.modules.sort((a, b) => a.path.localeCompare(b.path));
      },
    },
  ],
};
