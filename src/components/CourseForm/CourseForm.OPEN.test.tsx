import React from 'react'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { selectDelivery, selectLevel } from './test-helpers'

import CourseForm from '.'

describe('component: CourseForm - OPEN', () => {
  const type = CourseType.OPEN

  // Delivery
  it('restricts OPEN+LEVEL_1 to be F2F or VIRTUAL', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts OPEN+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts OPEN+ADVANCED_TRAINER to be F2F', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.AdvancedTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('restricts OPEN+LEVEL_1+F2F to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts OPEN+LEVEL_1+VIRTUAL to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.VIRTUAL)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts OPEN+INTERMEDIATE_TRAINER+F2F to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.IntermediateTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts OPEN+ADVANCED_TRAINER+F2F to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.AdvancedTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('restricts OPEN+LEVEL_1+F2F to New Certificate', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('restricts OPEN+LEVEL_1+VIRTUAL to New Certificate', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('allows OPEN+INTERMEDIATE_TRAINER+F2F to New Certificate and Reaccreditation', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.IntermediateTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeEnabled()
    expect(reacc).not.toBeChecked()

    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })

  it('allows OPEN+ADVANCED_TRAINER+F2F to New Certificate and Reaccreditation', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.AdvancedTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const reacc = screen.getByLabelText('Reaccreditation')
    expect(reacc).toBeEnabled()
    expect(reacc).not.toBeChecked()

    await userEvent.click(reacc)
    expect(reacc).toBeChecked()
  })
})
