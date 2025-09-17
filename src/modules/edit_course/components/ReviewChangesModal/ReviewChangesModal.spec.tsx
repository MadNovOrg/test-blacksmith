import { Course_Level_Enum, TransferFeeType } from '@app/generated/graphql'

import { _render, screen, userEvent, waitFor } from '@test/index'

import type { CourseDiff } from '../../utils/shared'

import { ReviewChangesModal } from '.'

describe('component: ReviewChangesModal', () => {
  it('validates the reason field', async () => {
    _render(
      <ReviewChangesModal
        diff={[]}
        open
        level={Course_Level_Enum.Level_1}
        priceCurrency={'GBP'}
      />,
    )

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    await userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')

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

    _render(
      <ReviewChangesModal
        diff={[dateDiff]}
        open
        withFees
        priceCurrency={'GBP'}
        level={Course_Level_Enum.Level_1}
      />,
    )

    expect(screen.getByTestId('course-diff-table')).toBeInTheDocument()

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    await userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    await userEvent.click(screen.getByLabelText(/apply rescheduling terms/i))

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

    _render(
      <ReviewChangesModal
        diff={[dateDiff]}
        open
        priceCurrency={'GBP'}
        withFees
        level={Course_Level_Enum.Level_1}
      />,
    )

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    await userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    await userEvent.click(screen.getByLabelText(/custom fee/i))

    await waitFor(() => {
      expect(confirmButton).toBeDisabled()
    })

    await userEvent.type(screen.getByLabelText(/amount/i), '50')

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

    _render(
      <ReviewChangesModal
        diff={[dateDiff]}
        open
        withFees
        priceCurrency={'GBP'}
        level={Course_Level_Enum.Level_1}
      />,
    )

    const confirmButton = screen.getByText(/confirm changes/i, {
      selector: 'button',
    })

    expect(confirmButton).toBeDisabled()

    await userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    await userEvent.click(screen.getByLabelText(/No fee/i))

    await waitFor(() => {
      expect(confirmButton).toBeEnabled()
    })
  })

  it('cancels review when clicked on cancel button', async () => {
    const onCancelMock = vi.fn()

    _render(
      <ReviewChangesModal
        diff={[]}
        open
        onCancel={onCancelMock}
        priceCurrency={'GBP'}
        level={Course_Level_Enum.Level_1}
      />,
    )

    await userEvent.click(screen.getByText(/close/i))

    expect(onCancelMock).toHaveBeenCalledTimes(1)
  })

  it('confirms review when clicked on the confirm button', async () => {
    const onConfirmMock = vi.fn()

    const dateDiff: CourseDiff = {
      type: 'date',
      oldValue: [new Date(), new Date()],
      newValue: [new Date(), new Date()],
    }

    _render(
      <ReviewChangesModal
        level={Course_Level_Enum.Level_1}
        diff={[dateDiff]}
        onConfirm={onConfirmMock}
        priceCurrency={'GBP'}
        open
        withFees
      />,
    )

    await userEvent.type(screen.getByPlaceholderText(/reason/i), 'reason')
    await userEvent.click(screen.getByLabelText(/apply rescheduling terms/i))

    await userEvent.click(
      screen.getByText(/confirm changes/i, { selector: 'button' }),
    )

    await waitFor(() => {
      expect(onConfirmMock).toHaveBeenCalledTimes(1)
      expect(onConfirmMock).toHaveBeenCalledWith({
        feeType: TransferFeeType.ApplyTerms,
        reason: 'reason',
      })
    })
  })
})
