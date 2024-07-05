import { build, perBuild } from '@jackfranklin/test-data-bot'
import React from 'react'

import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'

import { chance, render, screen } from '@test/index'

import { TrainerAvatar, TrainerAvatarGroup } from '.'

const buildTrainerAvatar = build<TrainerAvatar>({
  fields: {
    id: perBuild(() => chance.guid()),
    type: Course_Trainer_Type_Enum.Assistant,
    status: Course_Invite_Status_Enum.Accepted,
    profile: {
      fullName: perBuild(() => chance.name({ full: true })),
      id: chance.guid(),
    },
  },
})

describe('component: TrainerAvatarGroup', () => {
  it('displays lead trainers first', () => {
    const leadTrainer = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Leader,
        profile: {
          fullName: 'John Doe',
          id: chance.guid(),
        },
      },
    })

    const assistTrainer = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Assistant,
        profile: {
          fullName: 'Kevin Spacey',
          id: chance.guid(),
        },
      },
    })

    const trainers: TrainerAvatar[] = [assistTrainer, leadTrainer]

    render(<TrainerAvatarGroup trainers={trainers} />)

    const leadTrainerNode = screen.getByTestId(
      `trainer-avatar-${leadTrainer.id}`,
    )
    const assistTrainerNode = screen.getByTestId(
      `trainer-avatar-${assistTrainer.id}`,
    )

    expect(leadTrainerNode).toHaveTextContent('JD')
    expect(assistTrainerNode).toHaveTextContent('KS')

    expect(leadTrainerNode).toHaveAttribute('data-index', '0')
    expect(assistTrainerNode).toHaveAttribute('data-index', '1')
  })
})
