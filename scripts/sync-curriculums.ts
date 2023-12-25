import { gql, GraphQLClient } from 'graphql-request'

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

const COURSES_TO_SYNC = gql`
  query CoursesToSync($offset: Int!, $limit: Int!) {
    courses: course(
      where: { modules_aggregate: { count: { predicate: { _gt: 0 } } } }
      limit: $limit
      offset: $offset
    ) {
      id
    }
  }
`

const SYNC_CURRICULUMS = gql`
  mutation syncCurriculums($ids: [Int!]!) {
    curriculumSync(input: { ids: $ids }) {
      syncedCount
    }
  }
`

const CHUNK = 10

async function sync() {
  let hasMore = true
  let currentPage = 1

  while (hasMore) {
    const { courses } = await hasuraClient.request<{
      courses: { id: number }[]
    }>(COURSES_TO_SYNC, {
      limit: CHUNK,
      offset: (currentPage - 1) * CHUNK,
    })

    if (!courses.length) {
      hasMore = false
      continue
    }

    console.log(`Syncing curriculums for courses ${courses.map(c => c.id)}`)

    const {
      curriculumSync: { syncedCount },
    } = await hasuraClient.request<
      { curriculumSync: { syncedCount: number } },
      { ids: number[] }
    >(SYNC_CURRICULUMS, {
      ids: courses.map(c => c.id),
    })

    console.log(`Synced curriculums for ${syncedCount} courses`)

    currentPage++
  }
}

sync()
