import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterOrderStatuses } from './index'

describe('component: FilterOrderStatuses', () => {
  it('triggers onChange when status=paid is selected', async () => {
    const onChange = jest.fn()
    render(<FilterOrderStatuses onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Status'))
      userEvent.click(screen.getByText('Paid'))
    })

    expect(onChange).toHaveBeenCalledWith({ statuses: ['PAID'] })
  })
})
