import { t } from 'i18next'

import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import { AwsRegions } from '@app/types'

import { screen, userEvent, waitFor } from '@test/index'

import { renderForm, selectDelivery, selectLevel } from '../test-utils'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(() => ({
    'is-blended-learning-toggle-enabled': true,
    'wa-specific-renewal-cycles': false,
  })),
  useFeatureFlagPayload: vi.fn(() => ({
    'wa-specific-renewal-cycles': null,
  })),
}))

describe('component: AnzCourseForm - CLOSED', () => {
  vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  const type = Course_Type_Enum.Closed

  // Delivery
  it('allows CLOSED+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows CLOSED+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+MIXED to be Blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED to be Blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await userEvent.click(blended)
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER+F2F to be Blended', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.IntermediateTrainer)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows CLOSED+LEVEL_1+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+MIXED to be Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_1)
    await selectDelivery(Course_Delivery_Type_Enum.Virtual)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED to be Reaccreditation', async () => {
    await waitFor(() => renderForm({ type }))

    await selectLevel(Course_Level_Enum.Level_2)
    await selectDelivery(Course_Delivery_Type_Enum.Mixed)

    const reacc = screen.getByLabelText('Reaccreditation')

    expect(reacc).toBeEnabled()
    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+INTERMEDIATE_TRAINER+F2F to be Reaccreditation but not Blended', async () => {
    await waitFor(() => renderForm({ type }))

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

  it('allows changing the residing country', async () => {
    renderForm({ type })

    expect(
      screen.getByLabelText(t('components.course-form.residing-country')),
    ).toBeInTheDocument()
  })
})
