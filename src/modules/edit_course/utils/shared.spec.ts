import { addWeeks, subDays } from 'date-fns'

import {
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'
import { InviteStatus, SetCourseTrainerInput } from '@app/types'

import { chance } from '@test/index'

import { getChangedTrainers, getReschedulingTermsFee } from './shared'

describe(getChangedTrainers.name, () => {
  it('returns ids of trainers that got deleted and new trainers that got added', () => {
    const oldTrainerId = chance.guid()
    const newTrainerId = chance.guid()

    const currentTrainers: SetCourseTrainerInput[] = [
      {
        profile_id: oldTrainerId,
        course_id: 1,
        status: InviteStatus.ACCEPTED,
        type: Course_Trainer_Type_Enum.Leader,
      },
    ]

    const newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[] = [
      {
        profile_id: newTrainerId,
        type: Course_Trainer_Type_Enum.Leader,
      },
    ]

    expect(getChangedTrainers(currentTrainers, newTrainers)).toEqual([
      [
        {
          profile_id: newTrainerId,
          status: InviteStatus.PENDING,
          type: Course_Trainer_Type_Enum.Leader,
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
        type: Course_Trainer_Type_Enum.Leader,
      },
    ]

    const newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[] = [
      {
        profile_id: trainerId,
        type: Course_Trainer_Type_Enum.Assistant,
      },
      {
        profile_id: newLeadTrainerId,
        type: Course_Trainer_Type_Enum.Leader,
      },
    ]

    expect(getChangedTrainers(currentTrainers, newTrainers)).toEqual([
      [
        {
          profile_id: trainerId,
          status: InviteStatus.PENDING,
          type: Course_Trainer_Type_Enum.Assistant,
        },
        {
          profile_id: newLeadTrainerId,
          type: Course_Trainer_Type_Enum.Leader,
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
        type: Course_Trainer_Type_Enum.Leader,
      },
    ]

    const newTrainers: Pick<SetCourseTrainerInput, 'profile_id' | 'type'>[] = [
      {
        profile_id: trainerId,
        type: Course_Trainer_Type_Enum.Leader,
      },
    ]

    expect(getChangedTrainers(currentTrainers, newTrainers)).toEqual([[], []])
  })
})
describe(getReschedulingTermsFee.name, () => {
  const twoWeeksFromNow = subDays(addWeeks(new Date(), 2), 1)
  const fourWeeksFromNow = subDays(addWeeks(new Date(), 4), 1)
  const fiveWeeksFromNow = addWeeks(new Date(), 5)
  const oneWeekFromNow = subDays(addWeeks(new Date(), 1), 1)
  it.each([
    Course_Level_Enum.Level_1,
    Course_Level_Enum.Level_2,
    Course_Level_Enum.Advanced,
    Course_Level_Enum.BildRegular,
    Course_Level_Enum.Level_1Bs,
  ])('returns rescheduling free terms for %s level', level => {
    expect(getReschedulingTermsFee(twoWeeksFromNow, level)).toEqual(25)
    expect(getReschedulingTermsFee(fourWeeksFromNow, level)).toEqual(15)
    expect(getReschedulingTermsFee(fiveWeeksFromNow, level)).toEqual(0)
  })
  it.each([
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
    Course_Level_Enum.BildIntermediateTrainer,
    Course_Level_Enum.BildAdvancedTrainer,
  ])('returns rescheduling free terms for %s level', level => {
    expect(getReschedulingTermsFee(oneWeekFromNow, level)).toEqual(50)
    expect(getReschedulingTermsFee(fourWeeksFromNow, level)).toEqual(25)
    expect(getReschedulingTermsFee(fiveWeeksFromNow, level)).toEqual(0)
  })
})
