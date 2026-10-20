# Brand assets

The KalaDS logo, for the documentation (Storybook's sidebar and favicon) and the README. These files
aren't part of any package: apps built with KalaDS use their own logo, and the logo never goes into
`@kalads/icons` (its build would turn the colours into `currentColor`).

| File                       | Use                                                                    |
| -------------------------- | ---------------------------------------------------------------------- |
| `logo/logo-brand.svg`      | The logo on light backgrounds                                          |
| `logo/logo-brand-dark.svg` | The logo on dark backgrounds: the same logo in the dark theme's colours |
| `logo/logo-black.svg`      | One-colour version, for places that can't show the brand colour         |
