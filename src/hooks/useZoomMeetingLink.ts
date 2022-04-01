import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'

import { useFetcher } from './use-fetcher'

type ResponseType = { createZoomMeeting: { joinUrl: string } }

const QUERY = gql`
  mutation CreateZoomMeeting {
    createZoomMeeting {
      joinUrl
    }
  }
`

export default function useZoomMeetingLink(): string {
  const fetcher = useFetcher()

  const [meetingUrl, setMeetingUrl] = useState('')

  useEffect(() => {
    async function generateLink() {
      const data = await fetcher<ResponseType>(QUERY)

      if (data?.createZoomMeeting?.joinUrl) {
        setMeetingUrl(data.createZoomMeeting.joinUrl)
      }
    }

    generateLink()
  }, [fetcher])

  return meetingUrl
}
