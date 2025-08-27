import { useTranslation } from 'react-i18next'

import { Course_Exception_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { fireEvent, render, renderHook, screen, userEvent } from '@test/index'

import { CourseExceptionsConfirmation } from '.'

describe(CourseExceptionsConfirmation.name, () => {
  const onCancel = vi.fn()
  const onSubmit = vi.fn()

  vi.stubEnv('VITE_AWS_REGION', 'eu-west-2')

  const setup = () =>
    render(
      <CourseExceptionsConfirmation
        onCancel={onCancel}
        onSubmit={onSubmit}
        courseType={Course_Type_Enum.Indirect}
        exceptions={[Course_Exception_Enum.TrainerRatioNotMet]}
        open={true}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          acl: {
            isUK: () => true,
          },
        },
      },
    )

  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('should display the exceptions reason field when exceptions are raised for trainers on indirect', () => {
    setup()
    expect(
      screen.getByPlaceholderText(
        t('pages.create-course.exceptions.exception-reason-placeholder'),
      ),
    ).toBeInTheDocument()
  })
  it('should not proceed if no reason was provided', () => {
    setup()
    const submitButton = screen.getByTestId('proceed-button')

    expect(submitButton).toBeEnabled()

    fireEvent.click(submitButton)
    expect(onSubmit).not.toHaveBeenCalled()

    expect(
      screen.getByText(
        t('pages.create-course.exceptions.exception-reason-error'),
      ),
    ).toBeInTheDocument()
  })

  it('should proceed if reason was provided', async () => {
    setup()

    const reasonInput = screen
      .getByTestId('exception-reason-input')
      .querySelector('textarea')!

    await userEvent.type(reasonInput, 'Test reason')

    expect(reasonInput.value).toBe('Test reason')

    const submitButton = screen.getByTestId('proceed-button')
    fireEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalled()
  })
  it('should display the characters counter', async () => {
    setup()

    const reasonText = 'Test reason'

    const reasonInput = screen
      .getByTestId('exception-reason-input')
      .querySelector('textarea')!

    expect(screen.getByText('0/300')).toBeInTheDocument()

    await userEvent.type(reasonInput, reasonText)

    expect(screen.getByText(`${reasonText.length}/300`)).toBeInTheDocument()
  })
})
