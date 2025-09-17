import { addDays } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'

import {
  Course_Exception_Enum,
  Course_Status_Enum,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { _render, renderHook, screen, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { ExceptionsApprovalAlert } from '.'

vi.mock('@app/hooks/useCourse')

const useCourseMock = vi.mocked(useCourse)

const urqlMockClient = {
  executeQuery: () => vi.fn(),
  executeMutation: () => vi.fn(),
  executeSubscription: () => vi.fn(),
} as never as Client

describe('component: ExceptionsApprovalAlert', () => {
  const { result } = renderHook(() => useTranslation())
  const t = result.current.t

  const setup = (activeRole = RoleName.LD) => {
    useCourseMock.mockReturnValue({
      data: {
        course: buildCourse({
          overrides: {
            status: Course_Status_Enum.ExceptionsApprovalPending,
            dates: {
              aggregate: {
                start: { date: addDays(new Date(), 1).toISOString() },
                end: { date: addDays(new Date(), 1).toISOString() },
              },
            },
            courseExceptions: [
              {
                exception: Course_Exception_Enum.TrainerRatioNotMet,
              },
            ],
          },
        }),
      },
      mutate: vi.fn(),
      status: LoadingStatus.SUCCESS,
    })

    return _render(
      <Provider value={urqlMockClient}>
        <ExceptionsApprovalAlert />
      </Provider>,
      {
        auth: { activeRole },
      },
    )
  }

  it('should _render the ExceptionsApprovalAlert component', () => {
    setup()
    expect(screen.getByTestId('exceptions-approval')).toBeInTheDocument()
  })
  it('should _render the Approve / Reject button', () => {
    setup()
    expect(screen.getByText(t('common.reject'))).toBeInTheDocument()
    expect(screen.getByText(t('common.approve'))).toBeInTheDocument()
  })
  it('should not _render the Approve / Reject button if role is different than ADMIN or L&D', () => {
    setup(RoleName.USER)
    expect(screen.queryByText(t('common.reject'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.approve'))).not.toBeInTheDocument()
  })
  it('should open the course rejection modal', async () => {
    setup()
    await userEvent.click(screen.getByText(t('common.reject')))
    expect(
      screen.getByText(
        t('pages.create-course.exceptions.modal-subtitle-reject'),
      ),
    ).toBeInTheDocument()
  })
  it('should open the course approval modal', async () => {
    setup()
    await userEvent.click(screen.getByText(t('common.approve')))
    expect(
      screen.getByText(
        t('pages.create-course.exceptions.modal-subtitle-approve'),
      ),
    ).toBeInTheDocument()
  })
})
