import { gql } from 'graphql-request'

import { InviteStatus, SearchTrainerAvailability } from '@app/types'

import { SearchTrainer, SearchTrainerBookings } from './types'

export const GET_TRAINERS = gql`
  query ($limit: Int = 20, $offset: Int = 0, $where: profile_bool_exp) {
    trainers: profile(limit: $limit, offset: $offset, where: $where) {
      id
      fullName
    }
  }
`

export const GET_TRAINERS_SCHEDULE = gql`
  query ($trainerIds: [uuid!]!, $start: timestamptz, $end: timestamptz) {
    schedules: course_trainer(
      where: {
        profile_id: { _in: $trainerIds }
        course: {
          schedule: {
            _or: [
              { start: { _gte: $start, _lte: $end } }
              { end: { _gte: $start, _lte: $end } }
            ]
          }
        }
      }
    ) {
      profile_id
      status
      course {
        schedule {
          start
          end
        }
      }
    }
  }
`

export function setAvailability(
  trainers: SearchTrainer[],
  schedules: SearchTrainerBookings[]
) {
  const trainersBooked = new Set()
  const trainersPending = new Set()
  schedules.forEach(s => {
    switch (s.status) {
      case InviteStatus.ACCEPTED:
        trainersBooked.add(s.profile_id)
        trainersPending.delete(s.profile_id)
        break
      case InviteStatus.PENDING:
        if (!trainersBooked.has(s.profile_id)) {
          trainersPending.add(s.profile_id)
        }
        break
      case InviteStatus.DECLINED:
        break // if declined then is available for this
    }
  })

  trainers.forEach(t => {
    if (trainersPending.has(t.id)) {
      t.availability = SearchTrainerAvailability.PENDING
    } else if (trainersBooked.has(t.id)) {
      t.availability = SearchTrainerAvailability.UNAVAILABLE
    } else {
      t.availability = SearchTrainerAvailability.AVAILABLE
    }
  })
}
