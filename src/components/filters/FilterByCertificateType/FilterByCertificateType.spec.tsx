import React from 'react'

import { _render, screen, userEvent } from '@test/index'

import { FilterByCertificateType } from './index'

describe(FilterByCertificateType.name, () => {
  it('triggers onChange when certificate type = Legacy is selected', async () => {
    const onChange = vi.fn()
    _render(<FilterByCertificateType onChange={onChange} />)

    await userEvent.click(screen.getByText('Certificate Type'))
    await userEvent.click(screen.getByText('Legacy'))

    expect(onChange).toHaveBeenCalledWith(['LEGACY'])
  })

  it('triggers onChange when certificate type = Connect is selected', async () => {
    const onChange = vi.fn()
    _render(<FilterByCertificateType onChange={onChange} />)

    await userEvent.click(screen.getByText('Certificate Type'))
    await userEvent.click(screen.getByText('Connect'))

    expect(onChange).toHaveBeenCalledWith(['CONNECT'])
  })

  it('triggers onChange without certificate type when both Connect and Legacy are selected', async () => {
    const onChange = vi.fn()
    _render(<FilterByCertificateType onChange={onChange} />)

    await userEvent.click(screen.getByText('Certificate Type'))
    await userEvent.click(screen.getByText('Connect'))
    await userEvent.click(screen.getByText('Legacy'))

    expect(onChange).not.toHaveBeenCalledWith(['CONNECT'], ['LEGACY'])
  })
})
