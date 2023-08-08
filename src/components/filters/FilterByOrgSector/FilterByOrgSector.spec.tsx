import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { FilterByOrgSector } from './FilterByOrgSector'

describe(FilterByOrgSector.name, () => {
  it('onChange FilterByOrgSector', async () => {
    const onChange = jest.fn()
    render(<FilterByOrgSector onChange={onChange} />)

    await userEvent.click(screen.getByText('Adults Health and Social Care'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['adults-health-and-social-care'])
    })
  })
})
