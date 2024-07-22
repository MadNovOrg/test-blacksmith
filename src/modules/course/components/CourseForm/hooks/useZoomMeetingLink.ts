import { formatISO, isValid } from 'date-fns'
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { useMutation } from 'urql'

import { LoadingStatus } from '@app/util'

type ResponseType = {
  upsertZoomMeeting: {
    success: boolean
    meeting?: { id: string; joinUrl: string }
  }
}

type Params = {
  input?: {
    id?: string
    startTime?: string
    timezone?: string
    userId?: string
  }
}

export const QUERY = gql`
  mutation UpsertZoomMeeting($input: UpsertZoomMeetingInput) {
    upsertZoomMeeting(input: $input) {
      success
      meeting {
        id
        joinUrl
      }
    }
  }
`

export default function useZoomMeetingLink(): {
  meetingUrl: string
  meetingId?: number
  generateLink: (variables: {
    userId?: string
    meetingId?: number
    startTime?: Date
  }) => void
  clearLink: () => void
  status: LoadingStatus
} {
  const [{ data, error, fetching }, runMutation] = useMutation<
    ResponseType,
    Params
  >(QUERY)

  const [meeting, setMeeting] = useState<{
    id: number | undefined
    url: string | undefined
  } | null>()

  const generateLink = (variables: {
    userId?: string
    meetingId?: number
    startTime?: Date
  }) => {
    const { userId, meetingId, startTime } = variables

    runMutation({
      input: {
        id: meetingId?.toString(),
        startTime:
          isValid(startTime) && startTime ? formatISO(startTime) : undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userId,
      },
    })
  }

  const clearLink = () => {
    setMeeting({
      id: undefined,
      url: undefined,
    })
  }

  useEffect(() => {
    if (data?.upsertZoomMeeting?.meeting?.joinUrl) {
      setMeeting({
        id: parseInt(data.upsertZoomMeeting.meeting.id),
        url: data.upsertZoomMeeting.meeting.joinUrl,
      })
    }
  }, [data])

  const status = fetching
    ? LoadingStatus.FETCHING
    : error
    ? LoadingStatus.ERROR
    : LoadingStatus.SUCCESS

  return {
    meetingUrl: meeting?.url || '',
    meetingId: meeting?.id,
    generateLink,
    clearLink,
    status,
  }
}
