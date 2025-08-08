# TeamTeach Hub Application Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Environment Setup
- **CRITICAL**: Use Node.js version 18.14.2 exactly (specified in `.nvmrc`)
- Install and use nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
- Install correct Node version: `nvm install 18.14.2 && nvm use 18.14.2`
- Install pnpm globally: `npm install -g pnpm@9.15.5`
- **REQUIRED**: pnpm is enforced by preinstall hook - npm/yarn will fail

### Bootstrap Development Environment
Run these commands in exact order:
1. `docker compose up -d` -- starts PostgreSQL and Hasura services. Takes ~15 seconds. NEVER CANCEL.
2. `cd hasura && cp .env.sample .env` -- configure Hasura environment
3. `pnpm install` -- installs dependencies. Takes 1 minute 20 seconds. NEVER CANCEL. Set timeout to 180+ seconds.

### Build and Development Commands
- **CRITICAL BUILD REQUIREMENT**: Always set increased Node.js memory before building:
  - `NODE_OPTIONS="--max-old-space-size=6656" pnpm build` -- Takes 1 minute 16 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
  - Without the memory flag, build will fail with out-of-memory error
- `pnpm dev` -- starts development server on http://localhost:3000
- `pnpm lint` -- runs ESLint. Takes 1 minute 15 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
- `pnpm typecheck` -- runs TypeScript checking. Takes 48 seconds. Set timeout to 90+ seconds.
- `pnpm format` -- formats code with Prettier
- `pnpm format:fix` -- auto-fixes formatting issues

### Testing Commands
- **CRITICAL**: Unit tests are very slow. NEVER CANCEL.
- `pnpm test` -- runs unit tests with Vitest. Takes 15+ minutes. NEVER CANCEL. Set timeout to 30+ minutes.
- `pnpm test:coverage` -- runs tests with coverage. Set timeout to 45+ minutes.
- Install Playwright browsers first: `npx playwright install`
- `pnpm e2e` -- runs E2E tests with Playwright. Set timeout to 20+ minutes.

### Database and Hasura Operations
Hasura runs on two instances for multi-region support:
- UK/EU: http://localhost:8080 (postgres on port 5432)
- ANZ: http://localhost:8081 (postgres on port 6543)

**CRITICAL**: Run Hasura commands in this exact order when syncing:
1. `pnpm hasura:migrate:apply` -- applies database migrations
2. `pnpm hasura:metadata:apply` -- applies Hasura metadata
3. `pnpm graphql-codegen` -- regenerates GraphQL types

If metadata application fails: `pnpm hasura:metadata:reload`

### Docker Services
- `docker compose up -d` -- start all services (postgres, postgres-aus, graphql-engine, graphql-engine-aus)
- `docker compose down` -- stop all services
- Services take ~15 seconds to become healthy after starting

## Validation Requirements

### Pre-commit Validation
Always run these commands before committing changes:
1. `pnpm lint` -- must pass (warnings OK, errors will fail CI)
2. `pnpm typecheck` -- must pass with no errors
3. `NODE_OPTIONS="--max-old-space-size=6656" pnpm build` -- must succeed
4. `pnpm format` -- must pass to avoid CI formatting failures

### Manual Testing Scenarios
After making changes, always test these scenarios:
1. Start development server: `pnpm dev` and verify http://localhost:3000 loads
2. Verify GraphQL endpoints are accessible: 
   - UK: http://localhost:8080/healthz should return "OK"
   - ANZ: http://localhost:8081/healthz should return "OK"
3. Test authentication flow if changes affect auth components
4. Test both UK and ANZ region functionality if applicable

## Common Tasks and File Locations

### Key Project Structure
```
/
├── src/                    # Main React application source
├── hasura/                 # Hasura configuration and migrations
├── hub-web-e2e/           # Playwright E2E tests
├── public/                # Static assets
├── dist/                  # Build output (after pnpm build)
├── docker-compose.yml     # Local development services
├── package.json           # Main package configuration
├── vite.config.ts         # Vite build configuration
└── .nvmrc                 # Required Node.js version (18.14.2)
```

### Important Configuration Files
- `.nvmrc` -- specifies required Node.js version 18.14.2
- `package.json` -- main dependencies and scripts
- `pnpm-workspace.yaml` -- defines workspace structure
- `vite.config.ts` -- Vite configuration with proxy setup
- `docker-compose.yml` -- PostgreSQL and Hasura services
- `hasura/` -- all database migrations and metadata

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite + Material-UI
- **Backend**: Hasura GraphQL API on PostgreSQL
- **Authentication**: AWS Cognito (multi-region: EU-west-2, AP-southeast-2)
- **Database**: PostgreSQL 14 with Hasura v2.42.0
- **Testing**: Vitest (unit), Playwright (E2E)
- **Package Manager**: pnpm (enforced, npm/yarn will fail)

### GraphQL Code Generation
- `pnpm graphql-codegen` -- generates TypeScript types from GraphQL schema
- `pnpm graphql-codegen:watch` -- watches for schema changes
- Always run after Hasura metadata changes

## Build and Deployment

### Memory Requirements
- **CRITICAL**: Always use `NODE_OPTIONS="--max-old-space-size=6656"` for build commands
- This is required due to large codebase and complex bundling
- CI/CD pipeline uses this setting in all environments

### CI/CD Pipeline Stages
1. **Lint & Typecheck**: `pnpm lint` + `pnpm typecheck`
2. **Tests**: `pnpm test:coverage` (runs in 4 shards for performance)
3. **Build**: `NODE_OPTIONS="--max-old-space-size=6656" pnpm build`
4. **Deploy**: Deploys to S3 + CloudFront invalidation

### Environment-Specific Commands
- Development: `pnpm dev`
- ANZ Development: `pnpm dev:au` (uses different port and region)
- Build for staging/production: `NODE_OPTIONS="--max-old-space-size=6656" pnpm build --mode production`

## Troubleshooting

### Common Issues
- **Build fails with out-of-memory**: Add `NODE_OPTIONS="--max-old-space-size=6656"`
- **Tests timeout**: Set timeout to 30+ minutes, tests are intentionally slow
- **Hasura metadata inconsistent**: Run `pnpm hasura:metadata:reload`
- **Docker services not ready**: Wait 15+ seconds after `docker compose up -d`
- **pnpm install fails**: Ensure using Node.js 18.14.2 exactly

### Performance Notes
- Unit tests take 15+ minutes (normal behavior)
- Build takes 1-2 minutes with proper memory settings
- E2E tests can take 20+ minutes
- Lint checking takes 1+ minute due to large codebase

## Changeset Workflow (Required for PRs)
Every pull request MUST include a changeset file describing the changes:

### Pre-Push Workflow
1. Complete your work and validate with lint/typecheck/build
2. **REQUIRED**: Run `pnpm release:add` to generate changeset
3. Answer the changeset CLI questions:
   - Select packages to bump (usually `@teamteach/hub`)
   - Choose version bump type (patch/minor/major)
   - Provide clear description of changes
4. Commit the generated changeset file along with your changes
5. Push to repository and create PR

### Changeset Rules
- **One changeset per PR** - don't generate multiple changesets for same PR
- **Minor version**: new features, enhancements, developer experience improvements
- **Patch version**: bug fixes, documentation updates, internal refactoring
- **Major version**: breaking changes (rare, requires team approval)
- Use clear, descriptive text explaining impact and changes

## PR Template Usage (Required for PRs)
Every pull request MUST use the provided PR template located at `.github/pull_request_template.md`:

### PR Creation Workflow
1. Complete your work and validate with lint/typecheck/build
2. **REQUIRED**: Run `pnpm release:add` to generate changeset (as described above)
3. Commit the generated changeset file along with your changes
4. Push to repository and create PR using the template
5. Fill out all required sections in the PR template:
   - **What does this PR do?**: Clear summary of changes
   - **Related Jira**: Replace `TTHP-TODO` with actual Jira ticket number if available in the issue
   - **QA Steps**: Scenarios for non-technical testing (if applicable)
   - **Additional notes**: Design choices, testing instructions, configuration changes
   - **Checklist**: Mark unit tests and E2E tests as completed if written

### Jira Integration
- If the GitHub issue contains a Jira link, use that ticket number to replace `TTHP-TODO`
- Format: `Closes [TTHP-123](https://behaviourhub.atlassian.net/browse/TTHP-123)`
- If no Jira link exists in the issue, leave as `TTHP-TODO` for manual update

## Critical Reminders
- **NEVER CANCEL** long-running build, test, or lint commands
- Always use Node.js 18.14.2 exactly (check with `node --version`)
- Always use increased memory for builds: `NODE_OPTIONS="--max-old-space-size=6656"`
- Always run Docker services before development: `docker compose up -d`
- Always validate changes with lint, typecheck, and build before committing
- **REQUIRED**: Generate changeset with `pnpm release:add` before pushing
- **REQUIRED**: Follow conventional commit format: `type(#issue): description`
- pnpm is required - npm and yarn are blocked by preinstall hook