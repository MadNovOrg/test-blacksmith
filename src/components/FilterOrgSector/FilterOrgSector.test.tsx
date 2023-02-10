import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { FilterOrgSector } from './FilterOrgSector'

describe('FilterOrgSector', () => {
  it('onChange FilterOrgSector', async () => {
    const onChange = jest.fn()
    render(<FilterOrgSector onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Adults Health and Social Care'))
    })

    expect(onChange).toHaveBeenCalledWith(['adults-health-and-social-care'])
  })
})
