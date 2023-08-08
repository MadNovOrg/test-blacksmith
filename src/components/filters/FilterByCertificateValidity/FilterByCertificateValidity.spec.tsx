import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterByCertificateValidity } from './index'

describe(FilterByCertificateValidity.name, () => {
  it('triggers onChange when certificate status = Expired is selected', async () => {
    const onChange = jest.fn()
    render(<FilterByCertificateValidity onChange={onChange} />)

    await userEvent.click(screen.getByText('Certification Status'))
    await userEvent.click(screen.getByText('Expired'))

    expect(onChange).toHaveBeenCalledWith(['EXPIRED'])
  })
})
