import { gql } from 'graphql-request'
import { CombinedError, useMutation } from 'urql'

import { LoadingStatus } from '@app/util'

type ResponseType = {
  success: boolean
  error?: CombinedError
  fetching: boolean
}

export const QUERY = gql`
  mutation DeleteMeeting($meetingId: String!) {
    deleteMeeting(meetingId: $meetingId) {
      success
    }
  }
`

export default function useDeleteZoomMeeting() {
  const [{ error, fetching }, deleteMeeting] = useMutation<
    ResponseType,
    { meetingId: string }
  >(QUERY)

  let status: LoadingStatus
  if (fetching) {
    status = LoadingStatus.FETCHING
  } else if (error) {
    status = LoadingStatus.ERROR
  } else {
    status = LoadingStatus.SUCCESS
  }

  return { deleteMeeting, status }
}
