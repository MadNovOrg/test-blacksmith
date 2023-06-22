import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterCertificateValidity } from './index'

describe('component: FilterCertificateValidity', () => {
  it('triggers onChange when certificate status = Expired is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCertificateValidity onChange={onChange} />)

    await userEvent.click(screen.getByText('Certification Status'))
    await userEvent.click(screen.getByText('Expired'))

    expect(onChange).toHaveBeenCalledWith(['EXPIRED'])
  })
})
