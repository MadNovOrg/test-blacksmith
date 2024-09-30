import { FC } from 'react'

import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import useZoomMeetingUrl from '@app/modules/course/components/CourseForm/hooks/useZoomMeetingLink'
import { Profile, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen, userEvent, waitFor, within } from '@test/index'

import { AnzCourseForm } from './ANZ'
import { UkCourseForm } from './UK'

import { Props } from '.'

export const ZOOM_MOCKED_URL = 'https://us99web.zoom.us/j/99999?pwd=mockP4ss'
vi.mock('@app/modules/course/components/CourseForm/hooks/useZoomMeetingLink')
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

export async function selectDelivery(del: Course_Delivery_Type_Enum) {
  const radio = screen.getByTestId(`delivery-${del}`)

  await waitFor(async () => {
    await userEvent.click(radio)
  })
}

export async function selectBildCategory() {
  await userEvent.click(screen.getByLabelText(/course category/i))
  await userEvent.click(within(screen.getByRole('listbox')).getByText(/bild/i))
}

export const renderForm = ({
  type,
  certificateLevel = Course_Level_Enum.IntermediateTrainer,
  role = RoleName.USER,
  profile,
  props,
}: {
  type: Course_Type_Enum
  certificateLevel?: Course_Level_Enum
  role?: RoleName
  profile?: Partial<Profile>
  props?: Props
}) => {
  const FormToRender: FC<Props> = props => {
    const {
      acl: { isAustralia },
    } = useAuth()
    if (isAustralia()) {
      return <AnzCourseForm {...props} />
    }
    return <UkCourseForm {...props} />
  }
  return render(<FormToRender {...props} type={type} isCreation={true} />, {
    auth: {
      activeCertificates: [certificateLevel],
      activeRole: role,
      profile,
    },
  })
}
