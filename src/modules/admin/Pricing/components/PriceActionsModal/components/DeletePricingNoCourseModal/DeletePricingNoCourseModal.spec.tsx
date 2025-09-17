import { useTranslation } from 'react-i18next'

import { fireEvent, renderHook } from '@test/index'
import { _render, screen } from '@test/index'

import { DeletePricingNoCourseModal } from './DeletePricingNoCourseModal'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe(DeletePricingNoCourseModal.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const isOpenMock = true
  const handleCancelMock = vi.fn()
  const handleApproveMock = vi.fn()

  const setup = ({
    isOpen = isOpenMock,
    handleApprove = handleApproveMock,
    handleCancel = handleCancelMock,
  }) => {
    return _render(
      <DeletePricingNoCourseModal
        isOpen={isOpen}
        handleApprove={handleApprove}
        handleCancel={handleCancel}
      />,
    )
  }

  it('_render the component', () => {
    setup({})
    expect(
      screen.getByTestId('delete-pricing-no-course-modal'),
    ).toBeInTheDocument()
  })

  it('displays the warning message', () => {
    setup({})
    expect(
      screen.getByText(
        t('pages.course-pricing.modal-impact-on-proceeding-with-delete'),
      ),
    ).toBeInTheDocument()
  })

  it('calls handleCancel when the close button is clicked', () => {
    setup({})
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(handleCancelMock).toHaveBeenCalled()
  })

  it('displays approve and cancel buttons', () => {
    setup({})
    expect(
      screen.getByTestId('approve-delete-course-pricing'),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('cancel-delete-course-pricing'),
    ).toBeInTheDocument()
  })

  it('calls handleApprove when the approve button is clicked', () => {
    setup({})
    fireEvent.click(screen.getByTestId('approve-delete-course-pricing'))
    expect(handleApproveMock).toHaveBeenCalled()
  })

  it('calls handleCancel when the cancel button is clicked', () => {
    setup({})
    fireEvent.click(screen.getByTestId('cancel-delete-course-pricing'))
    expect(handleCancelMock).toHaveBeenCalled()
  })
})
