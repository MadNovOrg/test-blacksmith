import React from 'react'
import { getI18n } from 'react-i18next'

import { render, screen, fireEvent } from '@test/index'

import { AddOrg } from './AddOrg'

const { t } = getI18n()

const option = {
  id: 'id',
  urn: 'urn',
  name: 'name',
}

describe('AddOrg component', () => {
  it('renders AddOrg', async () => {
    render(<AddOrg option={option} onSuccess={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByText('Organisation Name')).toBeInTheDocument()
    expect(screen.getByText('Trust type')).toBeInTheDocument()
    expect(screen.getByText('Trust name')).toBeInTheDocument()
    expect(screen.getByText('Line 1')).toBeInTheDocument()
    expect(screen.getByText('Line 2')).toBeInTheDocument()
    expect(screen.getByText('City')).toBeInTheDocument()
    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('Post code')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('should display the Postcode tooltip message on hover', async () => {
    render(<AddOrg option={option} onSuccess={vi.fn()} onClose={vi.fn()} />)

    expect(screen.getByText('Add Organisation')).toBeInTheDocument()

    const tooltipElement = screen.getByTestId('post-code-tooltip')

    fireEvent.mouseOver(tooltipElement)
    const tooltipMessage = await screen.findByText(
      t('common.post-code-tooltip')
    )
    expect(tooltipMessage).toBeInTheDocument()
  })
})
