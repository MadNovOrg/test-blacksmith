# Team Teach Hub

## Setup

- `npm i`
- `docker compose up -d` to spin up postgres, hasura and adminer for local developement
- `npm run dev` to run the frontend

## Designs

Designs can be found [here](https://www.figma.com/file/WAkwbNIrsbvOJlqTKfuvdh/TTH-V1.1-Hi-Fi).
Design System can be found [here](https://www.figma.com/file/5cnwhggjiOTy1523YJveX3/Team-Teach-Design-System).

## Managing database schema

Schema and metadata should be managed via database migrations. Hasura provides a way to manage migrations via the Hasura CLI, which is automatically installed via npm.

The `hasura` folder contains all the configuration.

### Creating migrations

- run your local instance of Hasura as described in [setup](#setup)
- `cp hasura/.env.sample hasura/.env`
- populate the file as needed, make sure it's pointing to your local instance of Hasura (by default it is)
- `npm run hasura:console`
- make changes to the database schema in the web console, this will generate files on the file system in the hasura directory
- in order to apply the changes to other Hasura environments, commit and push the newly generated files
- To squash multiple migrations run `npm run hasura:squash -- --name <migration_name> --from <migration_id>`

## Deployment

TBD

## Technology

This application is built using:

- React and Vite in the frontend
- Hasura as a GraphQL API on top of a Postgres database
- Authentication using AWS Cognito
- ...

## Architecture

TBD

## E2E tests

TBD
