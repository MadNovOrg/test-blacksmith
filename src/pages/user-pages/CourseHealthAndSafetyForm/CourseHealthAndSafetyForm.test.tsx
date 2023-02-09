import React from 'react'

import { screen, render } from '@test/index'

import { CourseHealthAndSafetyForm } from './index'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('page: CourseHealthAndSafetyForm', () => {
  it('renders form', async () => {
    render(<CourseHealthAndSafetyForm />)
    expect(screen.getByText('Health & safety consent form')).toBeInTheDocument()
    expect(screen.getByTestId('submit-button')).toBeDisabled()
  })
})
