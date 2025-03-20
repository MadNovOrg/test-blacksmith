import userEvent from '@testing-library/user-event'
import { useTranslation } from 'react-i18next'

import { AwsRegions, BlendedLearningStatus } from '@app/types'

import { render, renderHook, screen } from '@test/index'

import { BlendedLearningCourseComplete } from './BlendedLearningCourseComplete'

describe('BlendedLearningCourseComplete', () => {
  const { result } = renderHook(() => useTranslation())
  const t = result.current.t

  beforeAll(() => {
    vi.stubEnv('VITE_GO1_BASE_URL', 'https://teamteachuk.mygo1.com')
    vi.stubEnv('VITE_GO1_ANZ_BASE_URL', 'https://teamteach.mygo1.com')
  })

  beforeEach(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })

  it('renders the component with the "COMPLETED" status', () => {
    render(
      <BlendedLearningCourseComplete
        blendedLearningStatus={BlendedLearningStatus.COMPLETED}
      />,
    )

    expect(
      screen.getByText(t('pages.participant-course.blended-learning')),
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('blended-learning-status.COMPLETED')),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: t('pages.participant-course.complete-blended-learning'),
      }),
    ).not.toBeInTheDocument()
  })

  it('renders the component with an "IN_PROGRESS" status and shows the complete button', () => {
    render(
      <BlendedLearningCourseComplete
        blendedLearningStatus={BlendedLearningStatus.IN_PROGRESS}
      />,
    )

    expect(
      screen.getByText(t('blended-learning-status.IN_PROGRESS')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: t('pages.participant-course.complete-blended-learning'),
      }),
    ).toBeInTheDocument()
  })

  it('renders the correct go1 login link for UK users', () => {
    render(
      <BlendedLearningCourseComplete
        blendedLearningStatus={BlendedLearningStatus.IN_PROGRESS}
      />,
    )

    const loginLink = screen.getByRole('link')
    expect(loginLink).toHaveAttribute(
      'href',
      expect.stringContaining(import.meta.env.VITE_GO1_BASE_URL),
    )
  })

  it('renders the correct go1 login link for ANZ users', () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)

    render(
      <BlendedLearningCourseComplete
        blendedLearningStatus={BlendedLearningStatus.IN_PROGRESS}
      />,
    )

    const loginLink = screen.getByRole('link')
    expect(loginLink).toHaveAttribute(
      'href',
      expect.stringContaining(import.meta.env.VITE_GO1_ANZ_BASE_URL),
    )
  })

  it('button is clickable when the status is not "COMPLETED"', async () => {
    const user = userEvent.setup()

    render(
      <BlendedLearningCourseComplete
        blendedLearningStatus={BlendedLearningStatus.IN_PROGRESS}
      />,
    )

    const button = screen.getByRole('button', {
      name: t('pages.participant-course.complete-blended-learning'),
    })
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(button).toBeEnabled()
  })
})
