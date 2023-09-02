import { render, screen, userEvent } from '@test/index'

import { FilterByCourseDeliveryType } from './index'

describe('component: FilterCourseDelivery', () => {
  it('triggers onChange when Delivery = Face to Face is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByCourseDeliveryType onChange={onChange} />)

    await userEvent.click(screen.getByText('Delivery'))
    await userEvent.click(screen.getByText('Face to Face'))

    expect(onChange).toHaveBeenCalledWith(['F2F'])
  })
})
