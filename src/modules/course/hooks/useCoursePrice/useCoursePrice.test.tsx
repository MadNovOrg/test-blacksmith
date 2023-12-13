import { renderHook } from '@testing-library/react'
import { matches } from 'lodash'
import { PropsWithChildren } from 'react'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { fromValue } from 'wonka'

import {
  Accreditors_Enum,
  CoursePriceQuery,
  CoursePriceQueryVariables,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { chance } from '@test/index'

import { COURSE_PRICE_QUERY, useCoursePrice } from './useCoursePrice'

it('returns default price if course start date is not passed', () => {
  const price = 20

  const courseData: Parameters<typeof useCoursePrice>[0] = {
    type: Course_Type_Enum.Open,
    courseLevel: Course_Level_Enum.Level_1,
    blendedLearning: false,
    reaccreditation: false,
    accreditedBy: Accreditors_Enum.Icm,
  }

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CoursePriceQueryVariables
      query: TypedDocumentNode
    }) => {
      const queryMatches = matches({
        query: COURSE_PRICE_QUERY,
        variables: {
          type: courseData.type,
          level: courseData.courseLevel,
          blended: courseData.blendedLearning,
          reaccreditation: courseData.reaccreditation,
          startDate: undefined,
          withSchedule: false,
        },
      })

      return fromValue<{ data: CoursePriceQuery }>({
        data: {
          coursePrice: queryMatches({ query, variables })
            ? [
                {
                  priceAmount: price,
                  priceCurrency: 'GBP',
                  pricingSchedules: [],
                },
              ]
            : [],
        },
      })
    },
  } as unknown as Client

  const wrapper: React.FC<PropsWithChildren> = ({ children }) => (
    <Provider value={client}>{children}</Provider>
  )

  const { result } = renderHook(() => useCoursePrice(courseData), { wrapper })

  expect(result.current.price).toBe(price)
})

it("returns default price if pricing schedule doesn't exist for course start date", () => {
  const price = 20

  const date = new Date()

  const courseData: Parameters<typeof useCoursePrice>[0] = {
    type: Course_Type_Enum.Open,
    courseLevel: Course_Level_Enum.Level_1,
    blendedLearning: false,
    reaccreditation: false,
    accreditedBy: Accreditors_Enum.Icm,
    startDateTime: date,
  }

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CoursePriceQueryVariables
      query: TypedDocumentNode
    }) => {
      const queryMatches = matches({
        query: COURSE_PRICE_QUERY,
        variables: {
          type: courseData.type,
          level: courseData.courseLevel,
          blended: courseData.blendedLearning,
          reaccreditation: courseData.reaccreditation,
          startDate: date.toISOString(),
          withSchedule: true,
        },
      })

      return fromValue<{ data: CoursePriceQuery }>({
        data: {
          coursePrice: queryMatches({ query, variables })
            ? [
                {
                  priceAmount: price,
                  priceCurrency: 'GBP',
                  pricingSchedules: [],
                },
              ]
            : [],
        },
      })
    },
  } as unknown as Client

  const wrapper: React.FC<PropsWithChildren> = ({ children }) => (
    <Provider value={client}>{children}</Provider>
  )

  const { result } = renderHook(() => useCoursePrice(courseData), { wrapper })

  expect(result.current.price).toBe(price)
})

it('returns scheduled price if pricing is scheduled', () => {
  const price = 20
  const scheduledPrice = 30

  const date = new Date()

  const courseData: Parameters<typeof useCoursePrice>[0] = {
    type: Course_Type_Enum.Open,
    courseLevel: Course_Level_Enum.Level_1,
    blendedLearning: false,
    reaccreditation: false,
    accreditedBy: Accreditors_Enum.Icm,
    startDateTime: date,
  }

  const client = {
    executeQuery: ({
      variables,
      query,
    }: {
      variables: CoursePriceQueryVariables
      query: TypedDocumentNode
    }) => {
      const queryMatches = matches({
        query: COURSE_PRICE_QUERY,
        variables: {
          type: courseData.type,
          level: courseData.courseLevel,
          blended: courseData.blendedLearning,
          reaccreditation: courseData.reaccreditation,
          startDate: date.toISOString(),
          withSchedule: true,
        },
      })

      return fromValue<{ data: CoursePriceQuery }>({
        data: {
          coursePrice: queryMatches({ query, variables })
            ? [
                {
                  priceAmount: price,
                  priceCurrency: 'GBP',
                  pricingSchedules: [
                    {
                      id: chance.guid(),
                      priceAmount: scheduledPrice,
                      priceCurrency: 'GBP',
                    },
                  ],
                },
              ]
            : [],
        },
      })
    },
  } as unknown as Client

  const wrapper: React.FC<PropsWithChildren> = ({ children }) => (
    <Provider value={client}>{children}</Provider>
  )

  const { result } = renderHook(() => useCoursePrice(courseData), { wrapper })

  expect(result.current.price).toBe(scheduledPrice)
})
