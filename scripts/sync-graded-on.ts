import { backOff } from 'exponential-backoff'
import { gql, GraphQLClient } from 'graphql-request'

const hasuraSecret = process.env.SECRET ?? 'tth-hasura-key'
const hasuraEndpoint = process.env.ENDPOINT
  ? `${process.env.ENDPOINT}/v1/graphql`
  : 'http://localhost:8080/v1/graphql'

const onlyWithoutGradedOn = Boolean(process.env.ONLY_WITHOUT_GRADED_ON) ?? false

if (!hasuraSecret || !hasuraEndpoint) {
  console.log('Hasura secret and endpoint is needed for syncing curriculums')
  process.exit(1)
}

const hasuraClient = new GraphQLClient(hasuraEndpoint, {
  headers: {
    'x-hasura-admin-secret': hasuraSecret,
  },
})

const PARTICIPANTS_TO_SYNC = gql`
  query ParticipantsToSync(
    $offset: Int!
    $limit: Int!
    $withoutGradedOn: Boolean!
  ) {
    participants: course_participant(
      where: {
        grade: { _is_null: false }
        gradedOn: { _is_null: $withoutGradedOn }
      }
      limit: $limit
      offset: $offset
    ) {
      id
    }
  }
`

const SYNC_GRADED_ON = gql`
  mutation SyncGradedOn($ids: [uuid!]!) {
    gradedOnSync(input: { participantIds: $ids }) {
      syncedCount
    }
  }
`

const CHUNK = 50

async function sync() {
  let hasMore = true
  let currentPage = 1

  while (hasMore) {
    const { participants } = await hasuraClient.request<{
      participants: { id: number }[]
    }>(PARTICIPANTS_TO_SYNC, {
      limit: CHUNK,
      offset: (currentPage - 1) * CHUNK,
      withoutGradedOn: onlyWithoutGradedOn,
    })

    if (!participants.length) {
      hasMore = false
      continue
    }

    console.log(
      `Syncing graded_on for participants ${participants.map(p => p.id)}`
    )

    const {
      gradedOnSync: { syncedCount },
    } = await backOff(
      () =>
        hasuraClient.request<
          { gradedOnSync: { syncedCount: number } },
          { ids: number[] }
        >(SYNC_GRADED_ON, {
          ids: participants.map(p => p.id),
        }),
      { startingDelay: 1000, numOfAttempts: 5 }
    )

    console.log(`Synced graded on for ${syncedCount} participants`)

    currentPage++
  }
}

sync()
