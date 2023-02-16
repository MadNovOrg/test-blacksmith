import { formatISO } from 'date-fns'

import { LoadingStatus } from '@app/util'

import { renderHook, act } from '@test/index'
import { waitFor } from '@test/index'

import { useFetcher } from '../use-fetcher'

import useZoomMeetingLink, { QUERY } from '.'

jest.mock('../use-fetcher')

const useFetcherMocked = jest.mocked(useFetcher)

describe('hook: useZoomMeetingLink', () => {
  it("doesn't generate the meeting link when mounted", () => {
    const fetcherMock = jest.fn()

    useFetcherMocked.mockReturnValue(fetcherMock)

    renderHook(() => useZoomMeetingLink())

    expect(fetcherMock).not.toHaveBeenCalled()
  })

  it('generates link when generate function is called', async () => {
    const MOCK_MEETING_URL = 'meeting-url'
    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      upsertZoomMeeting: {
        meeting: {
          joinUrl: MOCK_MEETING_URL,
        },
      },
    })

    useFetcherMocked.mockReturnValue(fetcherMock)

    const { result } = renderHook(() => useZoomMeetingLink())

    act(() => {
      result.current.generateLink()
    })

    expect(fetcherMock).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(result.current).toEqual({
        generateLink: expect.any(Function),
        status: LoadingStatus.SUCCESS,
        meetingUrl: MOCK_MEETING_URL,
      })
    })
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("doesn't call the api if meeting url is already generated", async () => {
    const MOCK_MEETING_URL = 'meeting-url'
    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      upsertZoomMeeting: {
        meeting: {
          joinUrl: MOCK_MEETING_URL,
          id: '123',
        },
      },
    })

    useFetcherMocked.mockReturnValue(fetcherMock)

    const { result } = renderHook(() => useZoomMeetingLink())

    act(() => {
      result.current.generateLink()
      result.current.generateLink()
    })

    await waitFor(() => {
      expect(fetcherMock).toHaveBeenCalledTimes(1)
    })
  })

  it('re-generates link when start time changes if there was a previous one', async () => {
    const MOCK_MEETING_URL = 'meeting-url'
    const MOCK_MEETING_ID = 'meeting-id'
    const startTime = new Date()

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      upsertZoomMeeting: {
        meeting: {
          id: MOCK_MEETING_ID,
          joinUrl: MOCK_MEETING_URL,
        },
      },
    })

    useFetcherMocked.mockReturnValue(fetcherMock)

    const { result, rerender } = renderHook<
      ReturnType<typeof useZoomMeetingLink>,
      {
        startTime: Date | undefined
      }
    >(({ startTime }) => useZoomMeetingLink(startTime), {
      initialProps: { startTime: undefined },
    })

    act(() => {
      result.current.generateLink()
    })

    act(() => {
      rerender({ startTime })
    })

    await waitFor(() => {
      expect(fetcherMock).toHaveBeenCalledTimes(2)

      expect(fetcherMock.mock.calls[0]).toEqual([QUERY, { input: {} }])

      expect(fetcherMock.mock.calls[1]).toEqual([
        QUERY,
        {
          input: {
            id: expect.any(String),
            startTime: formatISO(startTime),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        },
      ])
    })
  })

  it('does not generate a link when start time changes if there was not a previous one', async () => {
    const MOCK_MEETING_URL = 'meeting-url'
    const MOCK_MEETING_ID = 'meeting-id'
    const startTime = new Date()

    const fetcherMock = jest.fn()
    fetcherMock.mockResolvedValue({
      upsertZoomMeeting: {
        meeting: {
          id: MOCK_MEETING_ID,
          joinUrl: MOCK_MEETING_URL,
        },
      },
    })

    useFetcherMocked.mockReturnValue(fetcherMock)

    const { rerender } = renderHook<
      ReturnType<typeof useZoomMeetingLink>,
      {
        startTime: Date | undefined
      }
    >(({ startTime }) => useZoomMeetingLink(startTime), {
      initialProps: { startTime: undefined },
    })

    act(() => {
      rerender({ startTime })
    })

    await waitFor(() => {
      expect(fetcherMock).toHaveBeenCalledTimes(0)
    })
  })
})
