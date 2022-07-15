import { build, fake } from '@jackfranklin/test-data-bot'
import React from 'react'

import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'

import { render, screen } from '@test/index'

import { TrainerAvatar, TrainerAvatarGroup } from '.'

const buildTrainerAvatar = build<TrainerAvatar>({
  fields: {
    id: fake(f => f.datatype.uuid()),
    type: Course_Trainer_Type_Enum.Assistant,
    status: Course_Invite_Status_Enum.Accepted,
    profile: {
      fullName: fake(f => `${f.name.firstName()} ${f.name.lastName()}`),
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
        },
      },
    })

    const assistTrainer = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Assistant,
        profile: {
          fullName: 'Kevin Spacey',
        },
      },
    })

    const trainers: TrainerAvatar[] = [assistTrainer, leadTrainer]

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
