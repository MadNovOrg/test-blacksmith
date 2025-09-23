import React from 'react'

import { _render, screen } from '@test/index'

import { CourseCertificationDetails } from './CourseCertificationDetails'

describe('page: CourseCertificationDetails', () => {
  it('renders page as expected', async () => {
    _render(<CourseCertificationDetails />)
    expect(screen.getByText('Back')).toBeVisible()
  })
})
