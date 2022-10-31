import React from 'react'

import { TransferFeeType } from '@app/generated/graphql'

import { render, screen, userEvent, waitFor } from '@test/index'

import { CourseDiff } from '../../types'

import { ReviewChangesModal } from '.'

describe('component: ReviewChangesModal', () => {
  it('validates the reason field', async () => {
    render(<ReviewChangesModal diff={[]} open />)

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')

    await waitFor(() => {
      expect(confirmButton).toBeEnabled()
    })
  })

  it(`validates fees for ${TransferFeeType.ApplyTerms}`, async () => {
    const dateDiff: CourseDiff = {
      type: 'date',
      oldValue: [new Date(), new Date()],
      newValue: [new Date(), new Date()],
    }

    render(<ReviewChangesModal diff={[dateDiff]} open withFees />)

    expect(screen.getByTestId('course-diff-table')).toBeInTheDocument()

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    userEvent.click(screen.getByLabelText(/apply rescheduling terms/i))

    await waitFor(() => {
      expect(screen.getByTestId('rescheduling-terms-table')).toBeInTheDocument()
      expect(confirmButton).toBeEnabled()
    })
  })

  it(`validates fees for ${TransferFeeType.CustomFee}`, async () => {
    const dateDiff: CourseDiff = {
      type: 'date',
      oldValue: [new Date(), new Date()],
      newValue: [new Date(), new Date()],
    }

    render(<ReviewChangesModal diff={[dateDiff]} open withFees />)

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    userEvent.click(screen.getByLabelText(/custom fee/i))

    await waitFor(() => {
      expect(confirmButton).toBeDisabled()
    })

    userEvent.type(screen.getByLabelText(/amount/i), '50')

    await waitFor(() => {
      expect(confirmButton).toBeEnabled()
    })
  })

  it(`validates fees for ${TransferFeeType.Free}`, async () => {
    const dateDiff: CourseDiff = {
      type: 'date',
      oldValue: [new Date(), new Date()],
      newValue: [new Date(), new Date()],
    }

    render(<ReviewChangesModal diff={[dateDiff]} open withFees />)

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    userEvent.click(screen.getByLabelText(/No fee/i))

    await waitFor(() => {
      expect(confirmButton).toBeEnabled()
    })
  })

  it('cancels review when clicked on cancel button', () => {
    const onCancelMock = jest.fn()

    render(<ReviewChangesModal diff={[]} open onCancel={onCancelMock} />)

    userEvent.click(screen.getByText(/never mind/i))

    expect(onCancelMock).toHaveBeenCalledTimes(1)
  })

  it('confirms review when clicked on the confirm button', async () => {
    const onConfirmMock = jest.fn()

    const dateDiff: CourseDiff = {
      type: 'date',
      oldValue: [new Date(), new Date()],
      newValue: [new Date(), new Date()],
    }

    render(
      <ReviewChangesModal
        diff={[dateDiff]}
        onConfirm={onConfirmMock}
        open
        withFees
      />
    )

    userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    userEvent.click(screen.getByLabelText(/apply rescheduling terms/i))

    await waitFor(() => {
      userEvent.click(
        screen.getByText(/confirm changes/i, { selector: 'button' })
      )
    })

    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
      expect(onConfirmMock).toHaveBeenCalledWith({
        feeType: TransferFeeType.ApplyTerms,
        reason: 'reason',
      })
    })
  })
})
