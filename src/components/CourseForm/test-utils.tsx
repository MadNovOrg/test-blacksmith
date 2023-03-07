import React from 'react'

import useZoomMeetingUrl from '@app/hooks/useZoomMeetingLink'
import { CourseDeliveryType, CourseLevel } from '@app/types'
import { LoadingStatus } from '@app/util'

import { screen, userEvent, waitFor, within } from '@test/index'

jest.mock('@app/components/OrgSelector', () => ({
  OrgSelector: jest.fn(() => <p>Org Selector</p>),
}))

jest.mock('@app/components/VenueSelector', () => ({
  VenueSelector: jest.fn(() => <p>Venue Selector</p>),
}))

export const ZOOM_MOCKED_URL = 'https://us99web.zoom.us/j/99999?pwd=mockP4ss'
jest.mock('@app/hooks/useZoomMeetingLink')
const useZoomMeetingUrlMocked = jest.mocked(useZoomMeetingUrl)
const zoomGenerateLink = jest.mocked(() => {
  useZoomMeetingUrlMocked.mockReturnValue({
    meetingUrl: ZOOM_MOCKED_URL,
    status: LoadingStatus.SUCCESS,
    generateLink: zoomGenerateLink,
  })
})

beforeEach(() => {
  useZoomMeetingUrlMocked.mockReturnValue({
    meetingUrl: '',
    status: LoadingStatus.IDLE,
    generateLink: zoomGenerateLink,
  })
})

export async function selectLevel(lvl: CourseLevel) {
  const select = screen.getByTestId('course-level-select')
  await userEvent.click(within(select).getByRole('button'))

  await waitFor(async () => {
    const opt = screen.getByTestId(`course-level-option-${lvl}`)
    await userEvent.click(opt)
  })
}

export async function selectDelivery(del: CourseDeliveryType) {
  const radio = screen.getByTestId(`delivery-${del}`)

  await waitFor(async () => {
    await userEvent.click(radio)
  })
}
