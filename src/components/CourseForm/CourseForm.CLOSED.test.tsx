import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/hooks/useCoursePrice'
import { RoleName } from '@app/types'

import { screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectDelivery, selectLevel } from './test-utils'

vi.mock('@app/hooks/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

const useCoursePriceMock = vi.mocked(useCoursePrice)

describe('component: CourseForm - CLOSED', () => {
  const type = Course_Type_Enum.Closed

  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      price: null,
      fetching: false,
      currency: undefined,
      error: undefined,
    })
  })

  // Delivery
  it('allows CLOSED+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+ADVANCED to be F2F', async () => {
    await waitFor(() =>
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(Course_Level_Enum.Advanced)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+ADVANCED_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.AdvancedTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows CLOSED+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+LEVEL_1+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+ADVANCED+F2F to be Blended', async () => {
    await waitFor(() =>
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(Course_Level_Enum.Advanced)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+ADVANCED_TRAINER+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.AdvancedTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows CLOSED+LEVEL_1+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+MIXED to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+INTERMEDIATE_TRAINER+F2F to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+ADVANCED_TRAINER+F2F to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.AdvancedTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('displays price field for a Level two blended closed course that has 8 or less participants', async () => {
    await waitFor(() =>
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(Course_Level_Enum.Level_2)
    await userEvent.type(screen.getByLabelText(/number of attendees/i), '8')
    await userEvent.click(screen.getByLabelText(/blended learning/i))

    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument()
  })

  it('prepopulates price field a Level two blended closed course that has 8 or less participants', async () => {
    const pricePerAttendee = 100

    useCoursePriceMock.mockReturnValue({
      price: pricePerAttendee,
      currency: 'GBP',
      fetching: false,
      error: undefined,
    })

    await waitFor(() => {
      renderForm(type, Course_Level_Enum.IntermediateTrainer, RoleName.TT_ADMIN)
    })

    await selectLevel(Course_Level_Enum.Level_2)
    await userEvent.type(screen.getByLabelText(/number of attendees/i), '8')
    await userEvent.click(screen.getByLabelText(/blended learning/i))

    const priceField = screen.getByPlaceholderText(/price/i)

    expect(priceField).toHaveValue(String(pricePerAttendee))

    await userEvent.clear(priceField)

    expect(
      screen.getByText(/price per attendee must be a positive number/i)
    ).toBeInTheDocument()
  })
})
