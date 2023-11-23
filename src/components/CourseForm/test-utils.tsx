import React from 'react'

import CourseForm from '@app/components/CourseForm/index'
import { Course_Level_Enum } from '@app/generated/graphql'
import useZoomMeetingUrl from '@app/hooks/useZoomMeetingLink'
import { CourseDeliveryType, CourseType, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, userEvent, waitFor, within } from '@test/index'

vi.mock('@app/components/OrgSelector', () => ({
  OrgSelector: vi.fn(() => <p>Org Selector</p>),
}))

vi.mock('@app/components/VenueSelector', () => ({
  VenueSelector: vi.fn(() => <p>Venue Selector</p>),
}))

export const ZOOM_MOCKED_URL = 'https://us99web.zoom.us/j/99999?pwd=mockP4ss'
vi.mock('@app/hooks/useZoomMeetingLink')
const useZoomMeetingUrlMocked = vi.mocked(useZoomMeetingUrl)
const zoomGenerateLink = vi.mocked(() => {
  useZoomMeetingUrlMocked.mockReturnValue({
    meetingUrl: ZOOM_MOCKED_URL,
    meetingId: 123,
    status: LoadingStatus.SUCCESS,
    generateLink: zoomGenerateLink,
    clearLink: vi.fn(),
  })
})

beforeEach(() => {
  useZoomMeetingUrlMocked.mockReturnValue({
    meetingUrl: '',
    meetingId: 123,
    status: LoadingStatus.IDLE,
    generateLink: zoomGenerateLink,
    clearLink: vi.fn(),
  })
})

export async function selectLevel(lvl: Course_Level_Enum) {
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

export async function selectBildCategory() {
  await userEvent.click(screen.getByLabelText(/course category/i))
  await userEvent.click(within(screen.getByRole('listbox')).getByText(/bild/i))
}

export const renderForm = (
  type: CourseType,
  certificateLevel: Course_Level_Enum = Course_Level_Enum.IntermediateTrainer,
  role: RoleName = RoleName.USER
) => {
  return render(<CourseForm type={type} />, {
    auth: {
      activeCertificates: [certificateLevel],
      activeRole: role,
    },
  })
}
