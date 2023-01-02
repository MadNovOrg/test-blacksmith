import { extend } from 'lodash-es'

import {
  Course_Delivery_Type_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'
import {
  CourseData,
  isAdvisedTimeExceeded,
  isLeadTrainerInGracePeriod,
  isOutsideOfNoticePeriod,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { CourseLevel, CourseTrainerType } from '@app/types'

describe('course exception utils', () => {
  const defaultCourseData: CourseData = {
    deliveryType: Course_Delivery_Type_Enum.F2F,
    reaccreditation: false,
    type: Course_Type_Enum.Open,
    startDateTime: new Date('2022-03-01 10:00'),
    courseLevel: CourseLevel.Level_1,
    maxParticipants: 0,
    modulesDuration: 0,
  }
  const defaultTrainerData = {
    type: CourseTrainerType.Leader,
    levels: [
      {
        courseLevel: CourseLevel.IntermediateTrainer,
        expiryDate: new Date('2022-05-01 10:00').toISOString(),
      },
    ],
  }

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2022, 1, 1, 10, 0))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('isOutsideOfNoticePeriod', () => {
    it('should return false if start date in more than / equal to 4 weeks', () => {
      expect(isOutsideOfNoticePeriod(defaultCourseData)).toBeFalsy()
    })

    it('should return true if start date in less than 4 weeks', () => {
      expect(
        isOutsideOfNoticePeriod(
          extend({}, defaultCourseData, {
            startDateTime: new Date('2022-01-10 10:00'),
          })
        )
      ).toBeTruthy()
    })
  })

  describe('isLeadTrainerInGracePeriod', () => {
    it('should return false if no trainers', () => {
      expect(isLeadTrainerInGracePeriod(defaultCourseData, [])).toBeFalsy()
    })

    it('should return false if no leader', () => {
      expect(
        isLeadTrainerInGracePeriod(defaultCourseData, [
          extend({}, defaultTrainerData, { type: CourseTrainerType.Assistant }),
        ])
      ).toBeFalsy()
    })

    it('should return false if leader with valid certificate for course level', () => {
      expect(
        isLeadTrainerInGracePeriod(defaultCourseData, [defaultTrainerData])
      ).toBeFalsy()
    })

    it('should return true if leader with expired certificate', () => {
      expect(
        isLeadTrainerInGracePeriod(defaultCourseData, [
          extend({}, defaultTrainerData, {
            levels: [
              {
                courseLevel: CourseLevel.IntermediateTrainer,
                expiryDate: new Date('2020-12-30 10:00').toISOString(),
              },
            ],
          }),
        ])
      ).toBeTruthy()
    })
  })

  describe('isAdvisedTimeExceeded', () => {
    it('should return true if course duration more than 6h', () => {
      expect(
        isAdvisedTimeExceeded(
          extend({}, defaultCourseData, { modulesDuration: 6 * 60 + 1 })
        )
      ).toBeTruthy()
    })

    it('should return false if course duration less or equal to 6h', () => {
      expect(
        isAdvisedTimeExceeded(
          extend({}, defaultCourseData, { modulesDuration: 6 * 60 })
        )
      ).toBeFalsy()
    })
  })
})
