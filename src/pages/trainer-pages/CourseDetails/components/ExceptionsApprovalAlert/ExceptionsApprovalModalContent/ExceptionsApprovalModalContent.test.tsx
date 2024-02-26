import { useTranslation } from 'react-i18next'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  ApproveCourseMutation,
  Course_Audit_Type_Enum,
  RejectCourseMutation,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { LoadingStatus } from '@app/util'

import { fireEvent, render, renderHook, screen, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { ExceptionsApprovalModalContent } from '.'

vi.mock('@app/hooks/useCourse')

const closeModalMock = vi.fn()
const useCourseMocked = vi.mocked(useCourse)
const urqlMockClient = {
  executeQuery: vi.fn(),
  executeMutation: vi.fn(),
  executeSubscription: vi.fn(),
}

describe('component: ExceptionsApprovalModalContent', () => {
  const course = buildCourse()
  const { result } = renderHook(() => useTranslation())
  const t = result.current.t
  const setup = ({
    action,
    client,
  }: {
    action?: Course_Audit_Type_Enum.Approved | Course_Audit_Type_Enum.Rejected
    client?: {
      executeMutation: ({ mutation }: { mutation: TypedDocumentNode }) => void
    }
  }) =>
    render(
      <Provider value={(client ?? urqlMockClient) as unknown as Client}>
        <ExceptionsApprovalModalContent
          action={action ?? Course_Audit_Type_Enum.Approved}
          courseId={String(course.id)}
          closeModal={closeModalMock}
        />
      </Provider>
    )
  beforeAll(() => {
    useCourseMocked.mockReturnValue({
      status: LoadingStatus.SUCCESS,
      data: { course },
      mutate: vi.fn(),
    })
  })
  it('should render the ExceptionsApprovalModalContent component', () => {
    setup({})
    expect(
      screen.getByTestId('exceptions-approval-modal-content')
    ).toBeInTheDocument()
  })
  it('should set the comment correclty', () => {
    setup({})
    const testValue = 'TEST'
    const input = screen.getByDisplayValue('') as HTMLInputElement
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
  })
  it('should render the cancel / submit buttons', () => {
    setup({})
    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.getByText(t('common.submit'))).toBeInTheDocument()
  })
  it('should click the cancel button', () => {
    setup({})
    const cancelButton = screen.getByText(t('common.cancel'))
    fireEvent.click(cancelButton)
    expect(closeModalMock).toHaveBeenCalled()
  })
  it('should render an warning on the rejection modal', () => {
    setup({ action: Course_Audit_Type_Enum.Rejected })
    expect(
      screen.getByText(
        t('pages.create-course.exceptions.course-rejection-warning')
      )
    ).toBeInTheDocument()
  })
  it('should click the submit button and handle the Approve action', async () => {
    const client = {
      executeMutation: vi.fn(),
    }
    client.executeMutation.mockImplementation(() => {
      fromValue<{ data: ApproveCourseMutation }>({
        data: {
          approveCourse: {
            success: true,
          },
        },
      })
    })
    render(
      <Provider value={client as unknown as Client}>
        <ExceptionsApprovalModalContent
          action={Course_Audit_Type_Enum.Approved}
          courseId={String(course.id)}
          closeModal={closeModalMock}
        />
      </Provider>
    )
    const input = screen.getByDisplayValue('') as HTMLInputElement
    const testValue = 'TEST'
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(closeModalMock).toHaveBeenCalledTimes(1)
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
  })
  it('should click the submit button and handle the Reject action', async () => {
    const client = {
      executeMutation: vi.fn(),
    }
    client.executeMutation.mockImplementation(() => {
      fromValue<{ data: RejectCourseMutation }>({
        data: {
          rejectCourse: {
            success: true,
          },
        },
      })
    })
    render(
      <Provider value={client as unknown as Client}>
        <ExceptionsApprovalModalContent
          action={Course_Audit_Type_Enum.Rejected}
          courseId={String(course.id)}
          closeModal={closeModalMock}
        />
      </Provider>
    )
    const input = screen.getByDisplayValue('') as HTMLInputElement
    const testValue = 'TEST'
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(closeModalMock).toHaveBeenCalledTimes(1)
    expect(client.executeMutation).toHaveBeenCalledTimes(1)
  })
  it('should fail if only SPACES were entered', async () => {
    setup({})
    const input = screen.getByDisplayValue('') as HTMLInputElement
    const testValue = '      '
    fireEvent.change(input, { target: { value: testValue } })
    expect(input.value).toBe(testValue)
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(
      screen.getByText(t('pages.create-course.exceptions.reason-required'))
    ).toBeInTheDocument()
  })
  it('should fail if no reason is provided', async () => {
    setup({})
    await userEvent.click(screen.getByText(t('common.submit')))
    expect(
      screen.getByText(t('pages.create-course.exceptions.reason-required'))
    ).toBeInTheDocument()
  })
})
