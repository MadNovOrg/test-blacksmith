import {
  buildCourse,
  buildCourseAssistant,
  buildCourseLeader,
  buildProfile,
} from '@test/mock-data-utils'

import { CourseTrainerType } from './types'
import {
  courseStarted,
  courseEnded,
  formatDateForDraft,
  getCourseTrainer,
  getCourseAssistants,
  getTimeDifferenceAndContext,
} from './util'

describe('formatDateForDraft', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('returns appropriate message if date is within the last half a minute', () => {
    jest.setSystemTime(new Date(2022, 3, 28, 15, 15, 59))
    const date = new Date(2022, 3, 28, 15, 15, 31)
    const tMock = jest.fn()
    expect(formatDateForDraft(date, 'ago', tMock)).toEqual(
      'less than a minute ago'
    )
  })

  it('returns minutes elapsed if date is within the hour', () => {
    jest.setSystemTime(new Date(2022, 3, 28, 15, 15))
    const date = new Date(2022, 3, 28, 15, 0)
    const tMock = jest.fn()
    expect(formatDateForDraft(date, 'ago', tMock)).toEqual('15 minutes ago')
  })

  it('returns hours elapsed if date is within the day', () => {
    jest.setSystemTime(new Date(2022, 3, 28, 23, 59))
    const date = new Date(2022, 3, 28, 0, 0)
    const tMock = jest.fn()
    expect(formatDateForDraft(date, 'ago', tMock)).toEqual('about 24 hours ago')
  })

  it('returns actual date, if date is over one day ago', () => {
    jest.setSystemTime(new Date('2022-03-28 12:00'))
    const date = new Date('2022-03-27 11:59')
    const tMock = jest.fn().mockReturnValue('27 March 2022')
    expect(formatDateForDraft(date, 'ago', tMock)).toEqual('27 March 2022')
  })
})

describe('courseStarted', () => {
  it('should return false', () => {
    const course = buildCourse()
    course.schedule[0].start = new Date(2030, 0, 1)
    expect(courseStarted(course)).toBeFalsy()
  })

  it('should return true', () => {
    const course = buildCourse()
    course.schedule[0].start = new Date(2000, 0, 1)
    expect(courseStarted(course)).toBeTruthy()
  })
})

describe('courseEnded', () => {
  it('should return false', () => {
    const course = buildCourse()
    course.schedule[0].end = new Date(2030, 0, 1)
    expect(courseEnded(course)).toBeFalsy()
  })

  it('should return true', () => {
    const course = buildCourse()
    course.schedule[0].end = new Date(2000, 0, 1)
    expect(courseEnded(course)).toBeTruthy()
  })
})

describe('getCourseTrainer', () => {
  it('returns lead trainer when it exists', () => {
    const lead = buildProfile()
    const assistant1 = buildProfile()
    const assistant2 = buildProfile()

    const trainer = getCourseTrainer([
      buildCourseAssistant({ profile: assistant1 }),
      buildCourseLeader({ profile: lead }),
      buildCourseAssistant({ profile: assistant2 }),
    ])
    expect(trainer).not.toBeUndefined()
    expect(trainer?.profile?.id).toBe(lead.id)
    expect(trainer?.profile?.fullName).toBe(lead.fullName)
  })

  it('returns undefined when no lead trainer exists', () => {
    const assistant1 = buildProfile()
    const assistant2 = buildProfile()
    const assistant3 = buildProfile()

    const trainer = getCourseTrainer([
      buildCourseAssistant({ profile: assistant1 }),
      buildCourseAssistant({ profile: assistant2 }),
      buildCourseAssistant({ profile: assistant3 }),
    ])
    expect(trainer).toBeUndefined()
  })
})

describe('getCourseAssistants', () => {
  it('returns assistants when they exist', () => {
    const lead = buildProfile()
    const assistant1 = buildProfile()
    const assistant2 = buildProfile()

    const assistants = getCourseAssistants([
      buildCourseAssistant({ profile: assistant1 }),
      buildCourseLeader({ profile: lead }),
      buildCourseAssistant({ profile: assistant2 }),
    ])
    expect(assistants).toHaveLength(2)

    const notAssistants = assistants.filter(a => {
      return a.type !== CourseTrainerType.ASSISTANT
    })
    expect(notAssistants).toHaveLength(0)

    const a1 = assistants.find(a => a?.profile?.id === assistant1.id)
    expect(a1?.profile?.fullName).toBe(assistant1.fullName)

    const a2 = assistants.find(a => a?.profile?.id === assistant2.id)
    expect(a2?.profile?.fullName).toBe(assistant2.fullName)
  })

  it('returns empty array when no assistants exist', () => {
    const lead = buildProfile()

    const assistants = getCourseAssistants([
      buildCourseLeader({ profile: lead }),
    ])
    expect(assistants).toHaveLength(0)
  })
})

describe('getTimeDifferenceAndContext() -', () => {
  describe('2 days', () => {
    const start = new Date('2022-01-01 00:00')
    const end = new Date('2022-01-02 00:00')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 2', () => {
      expect(count).toEqual(2)
    })
    test('context: days', () => {
      expect(context).toEqual('days')
    })
  })

  describe('23h 59m', () => {
    const start = new Date('2022-01-01 00:00')
    const end = new Date('2022-01-01 23:59')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 23', () => {
      expect(count).toEqual(23)
    })
    test('context: hours', () => {
      expect(context).toEqual('hours')
    })
  })

  describe('1h 00m', () => {
    const start = new Date('2022-01-01 00:00')
    const end = new Date('2022-01-01 01:00')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 1', () => {
      expect(count).toEqual(1)
    })
    test('context: hours', () => {
      expect(context).toEqual('hours')
    })
  })

  describe('0h 59m', () => {
    const start = new Date('2022-01-01 00:00')
    const end = new Date('2022-01-01 00:59')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 59', () => {
      expect(count).toEqual(59)
    })
    test('context: minutes', () => {
      expect(context).toEqual('minutes')
    })
  })

  describe('0h 00m 59s', () => {
    const start = new Date('2022-01-01 00:00:00')
    const end = new Date('2022-01-01 00:00:59')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 0', () => {
      expect(count).toEqual(0)
    })
    test('context: none', () => {
      expect(context).toEqual('none')
    })
  })
})
