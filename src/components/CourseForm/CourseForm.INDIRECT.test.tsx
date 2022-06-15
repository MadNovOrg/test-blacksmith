import React from 'react'

import { CourseDeliveryType, CourseLevel, CourseType } from '@app/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { selectLevel, selectDelivery } from './test-helpers'

import CourseForm from '.'

describe('component: CourseForm - INDIRECT', () => {
  const type = CourseType.INDIRECT

  // Delivery
  it('allows INDIRECT+LEVEL_1 to be F2F, VIRTUAL or MIXED', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeEnabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts INDIRECT+LEVEL_2 to be F2F or MIXED', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_2)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeEnabled()
  })

  it('restricts INDIRECT+ADVANCED to be F2F', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.ADVANCED)

    expect(screen.getByLabelText('Face to face')).toBeEnabled()
    expect(screen.getByLabelText('Virtual')).toBeDisabled()
    expect(screen.getByLabelText('Both')).toBeDisabled()
  })

  // Blended
  it('allows INDIRECT+LEVEL_1+F2F to be Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
  })

  it('restricts INDIRECT+LEVEL_1+MIXED to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+VIRTUAL to be Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)
    await selectDelivery(CourseDeliveryType.VIRTUAL)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_2+F2F to be Blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_2)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeEnabled()
    expect(blended).not.toBeChecked()

    await waitFor(() => userEvent.click(blended))
    expect(blended).toBeChecked()
  })

  it('restricts INDIRECT+LEVEL_2+MIXED to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_2)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  it('restricts INDIRECT+ADVANCED+F2F to Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.ADVANCED)
    await selectDelivery(CourseDeliveryType.F2F)

    const blended = screen.getByLabelText('Go1: Blended learning')
    expect(blended).toBeDisabled()
    expect(blended).not.toBeChecked()
  })

  // Reaccreditation
  it('allows INDIRECT+LEVEL_1+F2F Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)
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

  it('allows INDIRECT+LEVEL_1+MIXED Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()
  })

  it('allows INDIRECT+LEVEL_1+VIRTUAL Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_1)
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

  it('allows INDIRECT+LEVEL_2+F2F Reaccreditation for Blended or Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_2)
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

  it('allows INDIRECT+LEVEL_2+MIXED Reaccreditation if Non-blended', async () => {
    await waitFor(() => render(<CourseForm type={type} />))

    await selectLevel(CourseLevel.LEVEL_2)
    await selectDelivery(CourseDeliveryType.MIXED)

    const blended = screen.getByLabelText('Go1: Blended learning')
    const reacc = screen.getByLabelText('Reaccreditation')

    expect(blended).toBeDisabled()
    expect(reacc).toBeEnabled()
    await waitFor(() => userEvent.click(reacc))
    expect(reacc).toBeChecked()
  })
})
