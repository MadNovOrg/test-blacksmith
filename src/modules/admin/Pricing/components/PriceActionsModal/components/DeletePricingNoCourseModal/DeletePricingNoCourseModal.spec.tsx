import { fireEvent, renderHook } from '@testing-library/react'
import { useTranslation } from 'react-i18next'

import { render, screen } from '@test/index'

import { DeletePricingNoCourseModal } from './DeletePricingNoCourseModal'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe(DeletePricingNoCourseModal.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const isOpenMock = true
  const handleCloseMock = vi.fn()

  const setup = ({ isOpen = isOpenMock, handleClose = handleCloseMock }) => {
    return render(
      <DeletePricingNoCourseModal isOpen={isOpen} handleClose={handleClose} />,
    )
  }

  it('render the component', () => {
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

  it('calls handleClose when the close button is clicked', () => {
    setup({})
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(handleCloseMock).toHaveBeenCalled()
  })
})
