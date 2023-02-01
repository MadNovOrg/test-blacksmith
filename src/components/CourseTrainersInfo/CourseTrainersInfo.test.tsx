import React from 'react'

import { RoleName } from '@app/types'

import { render, screen, providers } from '@test/index'
import {
  buildCourseAssistant,
  buildCourseLeader,
  buildProfile,
} from '@test/mock-data-utils'

import { CourseTrainersInfo } from '.'

describe('component: CourseTrainersInfo', () => {
  it('displays show more button', () => {
    const trainers = [
      buildCourseLeader(),
      buildCourseAssistant(),
      buildCourseAssistant(),
      buildCourseAssistant(),
    ]

    render(<CourseTrainersInfo trainers={trainers} />)

    expect(screen.getByText('Show more')).toBeInTheDocument()
  })

  it('does not displays show more button', () => {
    const trainers = [
      buildCourseLeader(),
      buildCourseAssistant(),
      buildCourseAssistant(),
    ]

    render(<CourseTrainersInfo trainers={trainers} />)

    expect(screen.queryByText('Show more')).toBe(null)
  })

  it('href is referenced correctly when Admin', async () => {
    const profile = buildProfile()
    providers.auth.activeRole = RoleName.TT_ADMIN

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: '2' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    render(<CourseTrainersInfo trainers={trainers} />)

    providers.auth.activeRole = providers.auth.defaultRole

    expect(screen.getByText('Leader').closest('a')).toHaveAttribute(
      'href',
      '/profile/1'
    )
    expect(screen.getByText('Assistant 1').closest('a')).toHaveAttribute(
      'href',
      '/profile/2'
    )
    expect(screen.getByText('Assistant 2').closest('a')).toHaveAttribute(
      'href',
      '/profile/3'
    )
  })

  it('href is not present when standard user', async () => {
    const profile = buildProfile()

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: '2' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    render(<CourseTrainersInfo trainers={trainers} />)

    providers.auth.activeRole = providers.auth.defaultRole

    expect(screen.getByText('Leader').closest('a')).toBe(null)
    expect(screen.getByText('Assistant 1').closest('a')).toBe(null)
    expect(screen.getByText('Assistant 2').closest('a')).toBe(null)
  })

  it('display you are trainer text if id match', () => {
    const profile = buildProfile()

    const logInId = providers.auth.profile?.id || 'logInId'

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: logInId },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: '2' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    render(<CourseTrainersInfo trainers={trainers} />)
    expect(screen.getByText('You are the trainer')).toBeInTheDocument()
  })

  it('display you are assistant text if id match', () => {
    const profile = buildProfile()

    const logInId = providers.auth.profile?.id || 'logInId'

    const trainers = [
      buildCourseLeader({
        profile: { ...profile, fullName: 'Leader', id: '1' },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 1', id: logInId },
      }),
      buildCourseAssistant({
        profile: { ...profile, fullName: 'Assistant 2', id: '3' },
      }),
    ]

    render(<CourseTrainersInfo trainers={trainers} />)
    expect(screen.getByText('You are the assistant')).toBeInTheDocument()
  })
})
