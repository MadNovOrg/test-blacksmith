import { useTranslation } from 'react-i18next'

import { Course_Pricing } from '@app/generated/graphql'

import { _render, renderHook, screen, userEvent } from '@test/index'

import { PriceActionsModal } from '.'
// not much to test other than rendering some text
describe(PriceActionsModal.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const onCloseMock = vi.fn()
  const onSaveMock = vi.fn()
  const pricingMock = {} as Course_Pricing
  it('renders the component', () => {
    _render(
      <PriceActionsModal
        onClose={onCloseMock}
        onSave={onSaveMock}
        pricing={pricingMock}
      />,
    )
    expect(
      screen.getByText(t('pages.course-pricing.modal-individual-edit-title')),
    ).toBeInTheDocument()
  })
  it('closes the modal on close button click', async () => {
    _render(
      <PriceActionsModal
        onClose={onCloseMock}
        onSave={onSaveMock}
        pricing={pricingMock}
      />,
    )
    await userEvent.click(screen.getByTestId('CloseIcon'))
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
