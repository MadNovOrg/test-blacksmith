import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterByOrderStatuses } from './index'

describe(FilterByOrderStatuses.name, () => {
  it('triggers onChange when status=paid is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByOrderStatuses onChange={onChange} />)

    await userEvent.click(screen.getByText('Status'))
    await userEvent.click(screen.getByText('Paid'))

    expect(onChange).toHaveBeenCalledWith({ statuses: ['PAID'] })
  })
})
