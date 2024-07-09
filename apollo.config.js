/**
 * Enabling `apollographql.vscode-apollo` will add GraphQL intellisense
 * @see https://hasura.io/docs/latest/resources/visual-studio-code/
 */
module.exports = {
  client: {
    service: {
      name: 'my-graphql-app',
      url: 'http://localhost:8080/v1/graphql',
      headers: {
        'x-hasura-admin-secret': 'tth-hasura-key',
      },
    },
  },
}

// test comment to check if its catched by sonar
