<!-- kalads-skills:start -->
## KalaDS

This project builds its interface with the KalaDS design system. Before writing or changing UI code, read
the KalaDS skill for the platform you're working on and follow its rules:

- `.agents/skills/kalads-react/SKILL.md` (@kalads/react-components 0.0.0)
- `.agents/skills/kalads-web/SKILL.md` (@kalads/web-components 0.0.0)

Before finishing a UI change, run that skill's checker and fix what it reports:

```sh
node .agents/skills/kalads-react/scripts/check.mjs <changed files>
node .agents/skills/kalads-web/scripts/check.mjs <changed files>
```
<!-- kalads-skills:end -->
