module.exports = {
  client: {
    service: {
      name: 'my-graphql-app',
      url: 'http://localhost:3000/v1/graphql',
      headers: {
        'x-hasura-admin-secret': 'tth-hasura-key',
      },
    },
  },
}
