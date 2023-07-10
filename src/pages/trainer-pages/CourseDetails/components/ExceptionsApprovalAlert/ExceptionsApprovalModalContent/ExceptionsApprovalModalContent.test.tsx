import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'

import { Course_Audit_Type_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import { LoadingStatus } from '@app/util'

import { fireEvent, render, renderHook, screen, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { ExceptionsApprovalModalContent } from '.'

jest.mock('@app/hooks/use-fetcher')
jest.mock('@app/hooks/useCourse')

jest.mock('@app/queries/courses/approve-course', () => ({
  MUTATION: 'approve-course-mutation',
}))
jest.mock('@app/queries/courses/reject-course', () => ({
  MUTATION: 'reject-course-mutation',
}))

const fetcherMock = jest.fn()
const closeModalMock = jest.fn()
const useFetcherMock = jest.mocked(useFetcher)
const useCourseMocked = jest.mocked(useCourse)
const urqlMockClient = {
  executeQuery: () => jest.fn(),
  executeMutation: () => jest.fn(),
  executeSubscription: () => jest.fn(),
} as never as Client

describe('component: ExceptionsApprovalModalContent', () => {
  const course = buildCourse()
  const { result } = renderHook(() => useTranslation())
  const t = result.current.t
  const setup = (
    action?: Course_Audit_Type_Enum.Approved | Course_Audit_Type_Enum.Rejected
  ) =>
    render(
      <Provider value={urqlMockClient}>
        <ExceptionsApprovalModalContent
          action={action ?? Course_Audit_Type_Enum.Approved}
          courseId={String(course.id)}
          closeModal={closeModalMock}
        />
      </Provider>
    )
  beforeAll(() => {
    useFetcherMock.mockReturnValue(fetcherMock)
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: course,
      mutate: jest.fn(),
    })
  })
  it('should render the ExceptionsApprovalModalContent component', () => {
    setup()
    expect(
      screen.getByTestId('exceptions-approval-modal-content')
    ).toBeInTheDocument()
  })
  it('should set the comment correclty', () => {
    setup()
    const testValue = 'TEST'
    const input = screen.getByDisplayValue('') as HTMLInputElement
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
  })
  it('should render the cancel / submit buttons', () => {
    setup()
    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.getByText(t('common.submit'))).toBeInTheDocument()
  })
  it('should click the cancel button', () => {
    setup()
    const cancelButton = screen.getByText(t('common.cancel'))
    fireEvent.click(cancelButton)
    expect(closeModalMock).toHaveBeenCalled()
  })
  it('should render an warning on the rejection modal', () => {
    setup(Course_Audit_Type_Enum.Rejected)
    expect(
      screen.getByText(
        t('pages.create-course.exceptions.course-rejection-warning')
      )
    ).toBeInTheDocument()
  })
  it('should click the submit button and handle the Approve action', async () => {
    setup()
    const input = screen.getByDisplayValue('') as HTMLInputElement
    const testValue = 'TEST'
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(fetcherMock).toHaveBeenCalledWith('approve-course-mutation', {
      input: { courseId: course.id },
    })
  })
  it('should click the submit button and handle the Reject action', async () => {
    setup(Course_Audit_Type_Enum.Rejected)
    const input = screen.getByDisplayValue('') as HTMLInputElement
    const testValue = 'TEST'
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(fetcherMock).toHaveBeenCalledWith('reject-course-mutation', {
      input: { courseId: course.id },
    })
  })
  it('should fail if no reason is provided', async () => {
    setup()
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(
      screen.getByText(t('pages.create-course.exceptions.reason-required'))
    ).toBeInTheDocument()
  })
})
