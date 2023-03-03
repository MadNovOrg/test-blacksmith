import React from 'react'

import { render, screen } from '@test/index'

import { CourseCertificationDetails } from './index'

describe('page: CourseCertificationDetails', () => {
  it('renders page as expected', async () => {
    render(<CourseCertificationDetails />)
    expect(screen.getByText('Back')).toBeVisible()
  })
})
