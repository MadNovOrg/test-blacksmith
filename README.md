# Hub

## Setup
- `npm i`
- `docker compose up -d` to spin up postgres, hasura and adminer for local developement
- `npm run dev` to run the frontend

## New Dev Account

For first time setup:
- Create a user in Cognito
- Add new user to DEV database via https://hasura.dev.teamteachhub.co.uk/console (needed for Cognito functions that depend on db data such as PreTokenGeneration)
  1. insert row in `profile` with name and email
  2. insert row in `identity` with uuid from cognito and `profile.id` (uuid from step 1)
  3. insert row in `organization_member` with `profile.id` and organization id desired
  4. insert row in `profile_role` with `profile.id` (uuid from step 1) and `role.id` from desired `role` record
- The steps above can be done locally by updating `dev_profiles.sql` seed file and running `npm run hasura:seed:apply` (needs clean database - see [here](https://github.com/TeamTeach/data) for how to populate the local database with more data)
- Login locally at http://localhost:3000

## Designs

Designs can be found [here](https://www.figma.com/file/WAkwbNIrsbvOJlqTKfuvdh/TTH-V1.1-Hi-Fi).
Design System can be found [here](https://www.figma.com/file/5cnwhggjiOTy1523YJveX3/Team-Teach-Design-System).

## Technology

This application is built using:

- `React` and `Vite` in the frontend
- `Hasura` as a `GraphQL API` on top of a `Postgres` database
- Authentication using `AWS Cognito`
- ...

## Architecture

A draft variant of the current architecture can be found [here](https://github.com/TeamTeach/hub/wiki/Architecture).

## Managing database schema

Schema and metadata should be managed via database migrations. Hasura provides a way to manage migrations via the Hasura CLI, which is automatically installed via npm.

The `hasura` folder contains all the configuration.

## Managing hasura metadata & GraphQL types

Oftentimes after syncing the `main` branch the schema may go inconsistent, to fix this, the ordering of the applied commands do matter.

1. Apply the database migrations first, if any
```bash
npm run hasura:migrate:apply
```

2. Apply hasura metadata
```bash
npm run hasura:metadata:apply
```

3. Regenerate graphql types
```bash
npm run graphql-codegen
npm run graphql-codegen:watch
```

> ⚠ If there were problems in applying metadata try

```bash
npm run hasura:metadata:reload
```

### Creating migrations

- run your local instance of Hasura as described in [setup](#setup)
- `cp hasura/.env.sample hasura/.env`
- populate the file as needed, make sure it's pointing to your local instance of Hasura (by default it is)
- `npm run hasura:console`
- make changes to the database schema in the web console, this will generate files on the file system in the hasura directory
- in order to apply the changes to other Hasura environments, commit and push the newly generated files
- To squash multiple migrations run `npm run hasura:squash -- --name <migration_name> --from <migration_id>`

## Deployment/Release Process
- When a PR is created CI pipeline runs. The same applies on commit push to a brunch as long as the PR is active.
- Once the PR is merged CD process is being triggered, using related input:
    - NPM dependencies installed
    - Deployment step runs & S3 content is being updated
- Deployment to `STG` is being triggered using GitHub Actions by providing a new tag with the following format (SemVer): `vX.X.X`
- Once testing to `STG` is finished a new Release needs to be created using GitHub UI with the appropriate tag
- When the release is created a pipeline is automatically triggered in order to deploy the chosen tag to `PROD` 

### DEV
- Deployment is being triggered automatically on PR merge
- Hasura migrations are running as a following job

### STG
- It is being triggered by the Github Action `CD-STG`
- Expects:
    - The branch to perform the run from. Default is `main`
    - Major, minor and patch numbers (SemVer) to build the right version 
- Performs the following steps:
    - Validates user input
    - Updates package version according to user input
        - Automatically commits new package version & pushes to `main`
    - Creates a new repo tag according to user input
    - Triggers CD pipeline for `STG` environment by checking out the code to the tag created above
        - Installs dependencies 
        - Builds the code using APP version according to user input
        - Deploys the code to S3
        - Runs Hasura migrations

### PROD
- It is only being triggered automatically by creating a new `Release` using Github UI
- Performs the following steps:
    - Gets the appropriate version from the tag that was used
    - Triggers CD pipeline for `PROD` environment by checking out the code to the chosen tag on Release creation
        - Installs dependencies 
        - Builds the code using APP version from retrieved version
        - Deploys the code to S3
        - Runs Hasura migrations

## Rollbacks

### All Envs
- It is only being triggered by the Github Action `APP-ROLLBACK`
- Expects:
    - The branch to perform the run from. Default is `main` 
    - The environment to perform the rollback action to

## E2E tests

[Playwright](https://playwright.dev/) is used for E2E tests. To run tests locally, first make sure you have started the app according to [setup](#setup). Then run the following commands:
- `npx playwright install` - only the first time on each machine, this installs the browsers (chromium, firefox and webkit) via npm
- `npm run test:e2e` - runs all the tests (filtering will be possible when there are more tests)
- `npm run test:e2e -- --headed` - runs tests in a visible browser

## Insert test data
To insert or refresh some courses for a specific trainer, you can run the following commands:
- `TRAINER=trainer@email.com npm run test:e2e:data` - deletes all current trainer's courses and inserts new ones, see [insertTestData.spec.ts](playwright/tests/insertTestData.spec.ts) for details
- `TARGET=dev TRAINER=trainer@email.com npm run test:e2e:data` - runs the same for `dev` environment. You can use also `stg` and `prod`
