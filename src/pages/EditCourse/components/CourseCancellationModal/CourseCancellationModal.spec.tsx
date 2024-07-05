import { useTranslation } from 'react-i18next'

import {
  Course_Cancellation_Fee_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { render, renderHook, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseCancellationModal } from '.'

describe(CourseCancellationModal.name, () => {
  const onClose = vi.fn()
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const setup = (courseType?: Course_Type_Enum) => {
    const courseMock = buildCourse({
      overrides: {
        type: courseType, // buildCourse uses @app/types 😢 hence the type casting as I'm trying to not use types from @app/types unles strictly necessary
      },
    })
    render(<CourseCancellationModal course={courseMock} onClose={onClose} />)
  }

  it('should render the component', () => {
    // Act
    setup()
    // Assert
    expect(screen.getByTestId('course-cancellation-modal')).toBeInTheDocument()
  })
  it('should render correct messages for indirect courses', () => {
    //Act
    setup(Course_Type_Enum.Indirect)
    //Assert
    expect(
      screen.getByText(
        t('pages.edit-course.cancellation-modal.permanently-cancel-course'),
      ),
    ).toBeInTheDocument()

    expect(
      screen.queryByText(
        t('pages.edit-course.cancellation-modal.finance-invoice-changes'),
      ),
    ).not.toBeInTheDocument()
  })
  it('should render the radio group if course type is CLOSED', () => {
    // Act
    setup(Course_Type_Enum.Closed)
    const radioGroup = screen.getAllByRole('radio')

    //Assert
    expect(radioGroup).toHaveLength(3)
  })
  it.each(Object.values(Course_Cancellation_Fee_Type_Enum))(
    'should render radio box message for %s',
    radioValue => {
      setup(Course_Type_Enum.Closed)
      expect(
        screen.getByLabelText(
          t(`pages.edit-course.cancellation-modal.${radioValue}`),
        ),
      ).toBeInTheDocument()
    },
  )
  it('should correctly select a radiobox', () => {
    // Act
    setup(Course_Type_Enum.Closed)
    const radioGroup = screen.getAllByRole('radio')

    //Assert
    radioGroup.forEach(async radioButton => {
      await userEvent.click(radioButton)
      await waitFor(() =>
        expect(radioButton).toHaveAttribute('selected', 'true'),
      )
    })
  })
  it('should render the cancel course dropdown', () => {
    setup(Course_Type_Enum.Open)
    expect(screen.getByTestId('cancel-course-dropdown')).toBeInTheDocument()
  })
  it('should enter a cancellation reason if course type is indirect', async () => {
    //Arrange
    const cancellationReason = 'bla'
    //Act
    setup(Course_Type_Enum.Indirect)
    const specifyReasonInput = screen.getByLabelText(
      `${t('pages.edit-course.cancellation-modal.specify-reason')} *`,
    )
    await userEvent.type(specifyReasonInput, cancellationReason)
    //Assert
    expect(specifyReasonInput).toHaveValue(cancellationReason)
  })
})
