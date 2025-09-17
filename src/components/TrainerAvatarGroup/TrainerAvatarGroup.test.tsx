import { build, perBuild } from '@jackfranklin/test-data-bot'
import React from 'react'

import {
  Course_Invite_Status_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'

import { chance, _render, screen } from '@test/index'

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
  it('displays lead trainers first, assist second and moderator third', () => {
    const leadTrainer1 = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Leader,
        profile: {
          fullName: 'John Doe',
          id: chance.guid(),
        },
      },
    })

    const assistTrainer1 = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Assistant,
        profile: {
          fullName: 'Kevin Spacey',
          id: chance.guid(),
        },
      },
    })

    const assistTrainer2 = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Assistant,
        profile: {
          fullName: 'Kevin DeBruyne',
          id: chance.guid(),
        },
      },
    })

    const moderatorTrainer1 = buildTrainerAvatar({
      overrides: {
        type: Course_Trainer_Type_Enum.Moderator,
        profile: {
          fullName: 'Anakin Skywalker',
          id: chance.guid(),
        },
      },
    })

    const trainers: TrainerAvatar[] = [
      assistTrainer1,
      moderatorTrainer1,
      assistTrainer2,
      leadTrainer1,
    ]

    _render(<TrainerAvatarGroup trainers={trainers} />)

    const leadTrainer1Node = screen.getByTestId(
      `trainer-avatar-${leadTrainer1.id}`,
    )

    const assistTrainer2Node = screen.getByTestId(
      `trainer-avatar-${assistTrainer2.id}`,
    )
    const assistTrainer1Node = screen.getByTestId(
      `trainer-avatar-${assistTrainer1.id}`,
    )
    const moderatorTrainer1Node = screen.getByTestId(
      `trainer-avatar-${moderatorTrainer1.id}`,
    )

    expect(leadTrainer1Node).toHaveTextContent('JD')
    expect(assistTrainer1Node).toHaveTextContent('KS')
    expect(assistTrainer2Node).toHaveTextContent('KD')
    expect(moderatorTrainer1Node).toHaveTextContent('AS')

    expect(leadTrainer1Node).toHaveAttribute('data-index', '0')
    expect(assistTrainer1Node).toHaveAttribute('data-index', '1')
    expect(assistTrainer2Node).toHaveAttribute('data-index', '2')
    expect(moderatorTrainer1Node).toHaveAttribute('data-index', '3')
  })
})
