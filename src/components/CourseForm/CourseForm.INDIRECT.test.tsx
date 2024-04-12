import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { useCoursePrice } from '@app/modules/course/hooks/useCoursePrice/useCoursePrice'

import { screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectDelivery, selectLevel } from './test-utils'

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

const useCoursePriceMock = vi.mocked(useCoursePrice)

describe('component: CourseForm - INDIRECT', () => {
  const type = Course_Type_Enum.Indirect

  beforeEach(() => {
    useCoursePriceMock.mockReturnValue({
      priceCurrency: 'GBP',
      priceAmount: 100,
    })
  })

  // Delivery
  it('allows INDIRECT+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts INDIRECT+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts INDIRECT+ADVANCED to be F2F', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.Advanced)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows INDIRECT+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts INDIRECT+LEVEL_1+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts INDIRECT+LEVEL_2+MIXED to be Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts INDIRECT+ADVANCED+F2F to be Blended', async () => {
    await waitFor(() => renderForm(type, Course_Level_Enum.AdvancedTrainer))

    await selectLevel(Course_Level_Enum.Advanced)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows INDIRECT+LEVEL_1+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+MIXED to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+VIRTUAL to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+MIXED to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm(type))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })
})
