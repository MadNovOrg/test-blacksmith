import React from 'react'

import { CourseTrainer } from '@app/types'

import { render, screen } from '@test/index'
import {
  buildCourseAssistant,
  buildCourseLeader,
  buildProfile,
} from '@test/mock-data-utils'

import { TrainerAvatarGroup } from '.'

describe('component: TrainerAvatarGroup', () => {
  it('displays lead trainers first', () => {
    const leadTrainer = {
      ...buildCourseLeader(),
      profile: {
        ...buildProfile(),
        fullName: 'John Doe',
      },
    }

    const assistTrainer = {
      ...buildCourseAssistant(),
      profile: {
        ...buildProfile(),
        fullName: 'Kevin Spacey',
      },
    }

    const trainers: CourseTrainer[] = [assistTrainer, leadTrainer]

    render(<TrainerAvatarGroup trainers={trainers} />)

    const leadTrainerNode = screen.getByTestId(
      `trainer-avatar-${leadTrainer.id}`
    )
    const assistTrainerNode = screen.getByTestId(
      `trainer-avatar-${assistTrainer.id}`
    )

    expect(leadTrainerNode).toHaveTextContent('JD')
    expect(assistTrainerNode).toHaveTextContent('KS')

    expect(leadTrainerNode).toHaveAttribute('data-index', '0')
    expect(assistTrainerNode).toHaveAttribute('data-index', '1')
  })
})
