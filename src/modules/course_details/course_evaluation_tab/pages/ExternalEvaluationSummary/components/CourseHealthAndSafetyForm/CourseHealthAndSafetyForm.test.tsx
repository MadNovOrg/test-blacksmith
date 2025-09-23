import React from 'react'

import { screen, _render } from '@test/index'

import { CourseHealthAndSafetyForm } from './index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('page: CourseHealthAndSafetyForm', () => {
  it('renders form', async () => {
    _render(<CourseHealthAndSafetyForm />)
    expect(
      screen.getByText('Health Guidance & Training Information'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeDisabled()
  })
})
