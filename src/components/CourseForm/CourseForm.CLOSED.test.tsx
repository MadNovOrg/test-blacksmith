import { useCoursePrice } from '@app/hooks/useCoursePrice'
import {
  CourseDeliveryType,
  CourseLevel,
  CourseType,
  RoleName,
} from '@app/types'

import { screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectDelivery, selectLevel } from './test-utils'

jest.mock('@app/hooks/useCoursePrice', () => ({
  useCoursePrice: jest.fn(),
}))

const useCoursePriceMock = jest.mocked(useCoursePrice)

describe('component: CourseForm - CLOSED', () => {
  const type = CourseType.CLOSED

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

    await selectLevel(CourseLevel.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+ADVANCED to be F2F', async () => {
    await waitFor(() =>
      renderForm(type, CourseLevel.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(CourseLevel.Advanced)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+ADVANCED_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm(type, CourseLevel.AdvancedTrainer))

    await selectLevel(CourseLevel.AdvancedTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows CLOSED+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+LEVEL_1+MIXED to Non-Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.VIRTUAL)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+LEVEL_2+MIXED to Non-Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+ADVANCED+F2F to Non-Blended', async () => {
    await waitFor(() =>
      renderForm(type, CourseLevel.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(CourseLevel.Advanced)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER+F2F to Non-Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.IntermediateTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+ADVANCED_TRAINER+F2F to Non-Blended', async () => {
    await waitFor(() => renderForm(type, CourseLevel.AdvancedTrainer))

    await selectLevel(CourseLevel.AdvancedTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows CLOSED+LEVEL_1+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+MIXED Reaccreditation if Non-blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL Reaccreditation if Non-blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.VIRTUAL)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F Reaccreditation for Blended or Non-blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
    expect(reacc).toBeEnabled()
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED Reaccreditation if Non-blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+INTERMEDIATE_TRAINER+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(CourseLevel.IntermediateTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+ADVANCED_TRAINER+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => renderForm(type, CourseLevel.AdvancedTrainer))

    await selectLevel(CourseLevel.AdvancedTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('displays price field for a Level two blended closed course that has 8 or less participants', async () => {
    await waitFor(() =>
      renderForm(type, CourseLevel.IntermediateTrainer, RoleName.TT_ADMIN)
    )

    await selectLevel(CourseLevel.Level_2)
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
      renderForm(type, CourseLevel.IntermediateTrainer, RoleName.TT_ADMIN)
    })

    await selectLevel(CourseLevel.Level_2)
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
