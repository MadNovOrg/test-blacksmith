import { _render, screen, userEvent } from '@test/index'

import { FilterByCertificateValidity } from './index'

describe(FilterByCertificateValidity.name, () => {
  it('triggers onChange when certificate status = Expired is selected', async () => {
    const onChange = vi.fn()
    _render(<FilterByCertificateValidity onChange={onChange} />)

    await userEvent.click(screen.getByText('Certification Status'))
    await userEvent.click(screen.getByText('Expired'))

    expect(onChange).toHaveBeenCalledWith(['EXPIRED'])
  })
})
