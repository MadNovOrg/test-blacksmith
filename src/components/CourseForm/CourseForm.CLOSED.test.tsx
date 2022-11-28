import React from 'react'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { selectDelivery, selectLevel } from './test-helpers'

import CourseForm from '.'

describe('component: CourseForm - CLOSED', () => {
  const type = CourseType.CLOSED

  // Delivery
  it('allows CLOSED+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts CLOSED+ADVANCED to be F2F', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Advanced)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER to be F2F', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.IntermediateTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  it('restricts CLOSED+ADVANCED_TRAINER to be F2F', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.AdvancedTrainer)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows CLOSED+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+LEVEL_1+MIXED to Non-Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.VIRTUAL)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
  })

  it('restricts CLOSED+LEVEL_2+MIXED to Non-Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+ADVANCED+F2F to Non-Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Advanced)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+INTERMEDIATE_TRAINER+F2F to Non-Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.IntermediateTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts CLOSED+ADVANCED_TRAINER+F2F to Non-Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.AdvancedTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows CLOSED+LEVEL_1+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+MIXED Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_1+VIRTUAL Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_1)
    await selectDelivery(CourseDeliveryType.VIRTUAL)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
    expect(reacc).toBeDisabled()
    expect(reacc).not.toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+F2F Reaccreditation for Blended or Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).not.toBeChecked()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
    expect(reacc).toBeEnabled()
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+LEVEL_2+MIXED Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.Level_2)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+INTERMEDIATE_TRAINER+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.IntermediateTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()
  })

  it('allows CLOSED+ADVANCED_TRAINER+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.AdvancedTrainer)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()
  })
})
