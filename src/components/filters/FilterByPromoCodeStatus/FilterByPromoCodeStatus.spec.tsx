import { render, screen, userEvent } from '@test/index'

import { FilterByPromoCodeStatus } from './index'

describe(FilterByPromoCodeStatus.name, () => {
  it('triggers onChange when promo code status =  Approval pending is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByPromoCodeStatus onChange={onChange} />)

    await userEvent.click(screen.getByText('Status'))
    await userEvent.click(screen.getByText('Approval pending'))

    expect(onChange).toHaveBeenCalledWith(['APPROVAL_PENDING'])
  })
})
