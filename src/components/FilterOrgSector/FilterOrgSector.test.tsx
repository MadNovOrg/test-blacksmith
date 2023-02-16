import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { FilterOrgSector } from './FilterOrgSector'

describe('FilterOrgSector', () => {
  it('onChange FilterOrgSector', async () => {
    const onChange = jest.fn()
    render(<FilterOrgSector onChange={onChange} />)

    await userEvent.click(screen.getByText('Adults Health and Social Care'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['adults-health-and-social-care'])
    })
  })
})
