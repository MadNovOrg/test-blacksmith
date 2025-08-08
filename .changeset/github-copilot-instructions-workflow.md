---
"@teamteach/hub": minor
---

Add comprehensive GitHub Copilot instructions and improve changeset workflow

This PR adds detailed development instructions in `.github/copilot-instructions.md` that enable AI coding agents to work effectively in the TeamTeach Hub codebase from a fresh clone. The instructions include:

- Environment setup (Node.js 18.14.2, pnpm 9.15.5) 
- Docker infrastructure with multi-region support (UK/EU, ANZ)
- Build system requirements including critical memory flags
- Database operations with Hasura migrations and metadata
- Testing and linting workflows with accurate timing
- Troubleshooting guide for common issues

Additionally implements proper changeset workflow using `pnpm release:add` instead of manual changeset creation, ensuring consistent version management and change tracking.

All commands and workflows have been exhaustively tested and validated with measured execution times.