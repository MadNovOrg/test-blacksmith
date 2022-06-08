import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns'

export type TimeDifferenceAndContext = {
  count: number
  context: 'days' | 'hours' | 'minutes' | 'none'
}

export const getTimeDifferenceAndContext = (
  end: Date,
  start: Date
): TimeDifferenceAndContext => {
  const result: TimeDifferenceAndContext = {
    count: differenceInDays(end, start),
    context: 'days',
  }

  if (result.count === 0) {
    result.count = differenceInHours(end, start)
    result.context = 'hours'
  }

  if (result.count === 0) {
    result.count = differenceInMinutes(end, start)
    result.context = 'minutes'
  }

  if (result.count === 0) {
    result.context = 'none'
  }

  return result
}
