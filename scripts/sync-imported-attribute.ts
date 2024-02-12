import { exec } from 'child_process'
import { promisify } from 'node:util'

import { gql, GraphQLClient } from 'graphql-request'

const execPromise = promisify(exec)

const hasuraSecret = process.env.SECRET ?? 'tth-hasura-key'
const hasuraEndpoint = process.env.ENDPOINT
  ? `${process.env.ENDPOINT}/v1/graphql`
  : 'http://localhost:8080/v1/graphql'

if (!hasuraSecret || !hasuraEndpoint) {
  console.log('Hasura secret and endpoint is needed for syncing curriculums')
  process.exit(1)
}

const hasuraClient = new GraphQLClient(hasuraEndpoint, {
  headers: {
    'x-hasura-admin-secret': hasuraSecret,
  },
})

const mutation = gql`
  mutation MarkUsersAsImported($subs: [String!]!) {
    update_profile(
      where: { identities: { provider_id: { _in: $subs } } }
      _set: { imported: true }
    ) {
      returning {
        id
        email
      }
      affected_rows
    }
  }
`

async function syncImportedAttribute() {
  let firstRun = true
  let paginationToken = ''

  let totalSynced = 0

  console.log('Starting sync 🤞')

  while (firstRun || paginationToken) {
    let command = `aws cognito-idp list-users --max-items 500 --user-pool-id ${process.env.COGNITO_POOL_ID} --region eu-west-2`

    if (paginationToken) {
      command += ` --starting-token=${paginationToken}`
    }

    const response = await execPromise(command)

    const data = JSON.parse(response.stdout)

    const users = data.Users

    const importedSubs = []

    users?.forEach(
      (user: { Attributes: { Name: string; Value: string }[] }) => {
        const userImported = user.Attributes.find(
          a => a.Name === 'custom:imported' && a.Value === 'true'
        )

        if (userImported) {
          const sub = user.Attributes.find(a => a.Name === 'sub').Value

          importedSubs.push(sub)
        }
      }
    )

    if (importedSubs.length) {
      const hasuraResponse = await hasuraClient.request<{
        update_profile: { returning?: { id: string; email: string }[] }
      }>(mutation, {
        subs: importedSubs,
      })

      if (!hasuraResponse.update_profile.returning.length) {
        console.log('No imported users found in our db 🤷')
      } else {
        totalSynced += hasuraResponse.update_profile.returning.length

        console.log(
          `marked ${hasuraResponse.update_profile.returning
            ?.map(p => p.email)
            .join(', ')} as imported`
        )
      }
    } else {
      console.log('No imported users in this batch 🤷')
    }

    paginationToken = data.NextToken
    firstRun = false
  }

  console.log(
    `Done 🎉 ${totalSynced} ${
      totalSynced === 1 ? 'user' : 'users'
    } marked as imported in our database 👋`
  )
  process.exit(0)
}

syncImportedAttribute()
