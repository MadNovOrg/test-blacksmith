import type { TrainerExtra } from '@app/util/eligibleTrainers'

export type GetTrainersLevelsResp = {
  getTrainersLevels: Array<TrainerExtra & { profile_id: string }>
}

export type SearchTrainersSchedule = {
  start?: Date | string
  end?: Date | string
}
