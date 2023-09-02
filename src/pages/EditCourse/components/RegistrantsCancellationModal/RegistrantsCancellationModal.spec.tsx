import { useTranslation } from 'react-i18next'

import { render, renderHook, screen, userEvent, waitFor } from '@test/index'

import { RegistrantsCancellationModal } from '.'

describe(RegistrantsCancellationModal.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const pageButtons = [
    t(
      'pages.edit-course.registrants-cancellation-modal.proceed-with-cancellation'
    ),
    t(
      'pages.edit-course.registrants-cancellation-modal.transfer-attendees-first'
    ),
  ]
  const onProceed = vi.fn()
  const onTransfer = vi.fn()
  beforeEach(() =>
    render(
      <RegistrantsCancellationModal
        onProceed={onProceed}
        onTransfer={onTransfer}
      />
    )
  )
  it('should render the component', () => {
    expect(
      screen.getByTestId('registrants-cancellation-modal')
    ).toBeInTheDocument()
  })
  it.each(pageButtons)('should render the %s button', button => {
    expect(screen.getByText(button)).toBeInTheDocument()
  })
  it.each(pageButtons)('should click the %s button', async button => {
    await userEvent.click(screen.getByText(button))
    waitFor(() => {
      expect(onProceed).toHaveBeenCalled()
      expect(onTransfer).toHaveBeenCalled()
    })
  })
})
