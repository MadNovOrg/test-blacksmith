import {
  CourseTrainerType,
  InviteStatus,
  SetCourseTrainerInput,
} from '@app/types'

import { chance } from '@test/index'

import { getChangedTrainers } from './shared'

describe('getChangedTrainers()', () => {
  it('returns ids of trainers that got deleted and new trainers that got added', () => {
    const oldTrainerId = chance.guid()
    const newTrainerId = chance.guid()

    const currentTrainers: SetCourseTrainerInput[] = [
      {
        profile_id: oldTrainerId,
        course_id: 1,
        status: InviteStatus.ACCEPTED,
        type: CourseTrainerType.Leader,
      },
    ]

    const newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[] = [
      {
        profile_id: newTrainerId,
        type: CourseTrainerType.Leader,
      },
    ]

    expect(getChangedTrainers(currentTrainers, newTrainers)).toEqual([
      [
        {
          profile_id: newTrainerId,
          status: InviteStatus.PENDING,
          type: CourseTrainerType.Leader,
        },
      ],
      [oldTrainerId],
    ])
  })

  it('sets PENDING status to trainers who have already accepted invite but have changed type', () => {
    const trainerId = chance.guid()
    const newLeadTrainerId = chance.guid()

    const currentTrainers: SetCourseTrainerInput[] = [
      {
        profile_id: trainerId,
        course_id: 1,
        status: InviteStatus.ACCEPTED,
        type: CourseTrainerType.Leader,
      },
    ]

    const newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[] = [
      {
        profile_id: trainerId,
        type: CourseTrainerType.Assistant,
      },
      {
        profile_id: newLeadTrainerId,
        type: CourseTrainerType.Leader,
      },
    ]

    expect(getChangedTrainers(currentTrainers, newTrainers)).toEqual([
      [
        {
          profile_id: trainerId,
          status: InviteStatus.PENDING,
          type: CourseTrainerType.Assistant,
        },
        {
          profile_id: newLeadTrainerId,
          type: CourseTrainerType.Leader,
          status: InviteStatus.PENDING,
        },
      ],
      [trainerId],
    ])
  })

  it('returns empty array if nothing has changed', () => {
    const trainerId = chance.guid()

    const currentTrainers: SetCourseTrainerInput[] = [
      {
        profile_id: trainerId,
        course_id: 1,
        status: InviteStatus.ACCEPTED,
        type: CourseTrainerType.Leader,
      },
    ]

    const newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[] = [
      {
        profile_id: trainerId,
        type: CourseTrainerType.Leader,
      },
    ]

    expect(getChangedTrainers(currentTrainers, newTrainers)).toEqual([[], []])
  })
})
