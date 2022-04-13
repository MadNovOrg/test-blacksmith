import { gql } from 'graphql-request'
import { useCallback, useState } from 'react'

import { LoadingStatus } from '@app/util'

import { useFetcher } from './use-fetcher'

type ResponseType = { createZoomMeeting: { joinUrl: string } }

const QUERY = gql`
  mutation CreateZoomMeeting {
    createZoomMeeting {
      joinUrl
    }
  }
`

export default function useZoomMeetingLink(): {
  meetingUrl: string
  generateLink: () => void
  status: LoadingStatus
} {
  const fetcher = useFetcher()

  const [meetingUrl, setMeetingUrl] = useState('')
  const [status, setStatus] = useState(LoadingStatus.IDLE)

  const generateLink = useCallback(async () => {
    if (meetingUrl) {
      return meetingUrl
    }

    setStatus(LoadingStatus.FETCHING)

    const data = await fetcher<ResponseType>(QUERY)

    setStatus(LoadingStatus.SUCCESS)

    if (data?.createZoomMeeting?.joinUrl) {
      setMeetingUrl(data.createZoomMeeting.joinUrl)
    }
  }, [fetcher, meetingUrl])

  return { meetingUrl, generateLink, status }
}
