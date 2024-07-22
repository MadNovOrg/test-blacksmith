import { gql } from 'graphql-request'
import { CombinedError, useQuery } from 'urql'

import { ZoomUsersResponse } from '@app/generated/graphql'

type ZoomUser = {
  id: string
  displayName: string
  firstName: string
  lastName: string
  email: string
}

type ResponseType = {
  users?: ZoomUser[]
  current?: string
  error?: CombinedError
  fetching: boolean
}

export const QUERY = gql`
  query ZoomUsers {
    zoomUsers {
      success
      data {
        current
        users {
          id
          displayName
          firstName
          lastName
          email
        }
      }
    }
  }
`

export default function useZoomUsers(): ResponseType {
  const [{ data, error, fetching }] = useQuery<{
    zoomUsers: ZoomUsersResponse
  }>({
    query: QUERY,
  })

  if (error || !data?.zoomUsers?.data?.users) {
    return { error, fetching }
  }

  return {
    users: data?.zoomUsers?.data?.users,
    current: data?.zoomUsers?.data?.current,
    error,
    fetching,
  }
}
