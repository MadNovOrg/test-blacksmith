import { AwsRegions } from '@app/types'

import { render, screen } from '@test/index'

import { BlendedLearningCourseAlert } from './BlendedLearningCourseAlert'

describe('BlendedLearningCourseAlert', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_GO1_BASE_URL', 'https://teamteachuk.mygo1.com')
    vi.stubEnv('VITE_GO1_ANZ_BASE_URL', 'https://teamteach.mygo1.com')
  })

  beforeEach(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })

  it('renders the alert with the correct translation key', () => {
    render(<BlendedLearningCourseAlert />)

    expect(
      screen.getByText('To receive your certificate', { exact: false }),
    ).toBeInTheDocument()
  })

  it('renders the correct login link for UK users', () => {
    render(<BlendedLearningCourseAlert />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(import.meta.env.VITE_GO1_BASE_URL),
    )
  })

  it('renders the correct login link for ANZ users', () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)

    render(<BlendedLearningCourseAlert />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining(import.meta.env.VITE_GO1_ANZ_BASE_URL),
    )
  })
})
