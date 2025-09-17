import React from 'react'

import { _render, screen } from '@test/index'

import { CoursePrerequisitesAlert } from './index'

describe('component: CoursePrerequisitesAlert', () => {
  it('renders component as expected', async () => {
    _render(<CoursePrerequisitesAlert />)
    expect(screen.getByText('Disabilities')).toBeVisible()
    expect(screen.getByText('Dietary Requirements')).toBeVisible()
  })

  it('renders component as expected when showaction is true', async () => {
    _render(<CoursePrerequisitesAlert showAction={true} />)
    expect(screen.getByText('Go to profile preferences')).toBeVisible()
  })
  it('renders component as expected when showaction is false', async () => {
    const { queryByTestId } = _render(
      <CoursePrerequisitesAlert showAction={false} />,
    )

    expect(
      queryByTestId('go-to-profile-preferences-button'),
    ).not.toBeInTheDocument()
  })
})
