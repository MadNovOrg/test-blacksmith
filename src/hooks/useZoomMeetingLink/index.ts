import { gql } from 'graphql-request'
import { useCallback, useEffect, useRef, useState } from 'react'

import { LoadingStatus } from '@app/util'

import { useFetcher } from '../use-fetcher'

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

export default function useZoomMeetingLink(startTime?: string): {
  meetingUrl: string
  generateLink: () => void
  status: LoadingStatus
} {
  const fetcher = useFetcher()

  const [meetingUrl, setMeetingUrl] = useState('')
  const meetingIdRef = useRef('')
  const [status, setStatus] = useState(LoadingStatus.IDLE)
  const meetingUrlRef = useRef(meetingUrl)

  const generateLink = useCallback(
    async (force = false) => {
      if (meetingUrlRef.current && !force) {
        return meetingUrlRef.current
      }

      setStatus(LoadingStatus.FETCHING)

      const data = await fetcher<ResponseType, Params>(QUERY, {
        ...(meetingIdRef.current
          ? {
              input: {
                id: meetingIdRef.current,
                startTime,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
            }
          : { input: {} }),
      })

      setStatus(LoadingStatus.SUCCESS)

      if (data?.upsertZoomMeeting?.meeting?.joinUrl) {
        meetingIdRef.current = data.upsertZoomMeeting.meeting.id
        setMeetingUrl(data.upsertZoomMeeting.meeting.joinUrl)
      }
    },
    [fetcher, startTime]
  )

  useEffect(() => {
    meetingUrlRef.current = meetingUrl
  }, [meetingUrl])

  useEffect(() => {
    if (startTime) {
      generateLink(true)
    }
  }, [startTime, generateLink])

  return { meetingUrl, generateLink, status }
}
