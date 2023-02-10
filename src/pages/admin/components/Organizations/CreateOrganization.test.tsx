import React from 'react'

import { render, screen, userEvent, waitFor } from '@test/index'

import { CreateOrganization } from './CreateOrganization'

describe('page: CreateOrganization', () => {
  it('generates errors when form isnt filled out', async () => {
    render(<CreateOrganization />)
    expect(screen.getByText('Add new organisation')).toBeInTheDocument()
    await waitFor(() => {
      userEvent.click(screen.getByTestId('create-org-form-submit-btn'))
    })
    expect(
      screen.getByText('Organisation name is required')
    ).toBeInTheDocument()
    expect(screen.getByText('Trust name is required')).toBeInTheDocument()
    expect(screen.getByText('Line 1 is required')).toBeInTheDocument()
    expect(screen.getByText('City is required')).toBeInTheDocument()
    expect(screen.getByText('Country is required')).toBeInTheDocument()
    expect(screen.getByText('Post code is required')).toBeInTheDocument()
    expect(screen.getByText('Work email is required')).toBeInTheDocument()
  })
})
