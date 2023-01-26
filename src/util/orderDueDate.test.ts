import { sub } from 'date-fns'

import { PaymentMethod } from '@app/generated/graphql'

import { getOrderDueDate, isOrderDueDateImmediate } from './orderDueDate'

describe('orderDueDate utils', () => {
  describe('getOrderDueDate', () => {
    it('works correctly when input dates are strings', () => {
      const creationDate = '2023-01-13T10:00:00.000000+00:00'
      const startDate = '2023-02-20T10:00:00.000000+00:00'

      const dueDate = getOrderDueDate(creationDate, startDate)

      const expectedDueDate = new Date(creationDate)
      expect(dueDate.toISOString()).toBe(expectedDueDate.toISOString())
    })

    it('works correctly when input dates Date objects', () => {
      const creationDate = new Date('2023-01-13T10:00:00.000000+00:00')
      const startDate = new Date('2023-02-20T10:00:00.000000+00:00')

      const dueDate = getOrderDueDate(creationDate, startDate)
      expect(dueDate.toISOString()).toBe(creationDate.toISOString())
    })

    it('returns a due date 8 weeks before the start date, if the course start date is more than 8 weeks', () => {
      const creationDate = '2023-01-13T10:00:00.000000+00:00'
      const startDate = '2023-08-13T10:00:00.000000+00:00'

      const dueDate = getOrderDueDate(creationDate, startDate)

      const expectedDueDate = sub(new Date(startDate), { weeks: 8 })
      expect(dueDate.toISOString()).toBe(expectedDueDate.toISOString())
    })

    it('returns a due date equal to the creation date, if the course start date is more than 8 weeks but the payment method is credit card', () => {
      const creationDate = '2023-01-13T10:00:00.000000+00:00'
      const startDate = '2023-08-13T10:00:00.000000+00:00'

      const dueDate = getOrderDueDate(creationDate, startDate, PaymentMethod.Cc)

      const expectedDueDate = new Date(creationDate)
      expect(dueDate.toISOString()).toBe(expectedDueDate.toISOString())
    })

    it('returns a due date equal to the creation date, if the course start date is less then 8 weeks from the start date', () => {
      const creationDate = '2023-01-13T10:00:00.000000+00:00'
      const startDate = '2023-02-20T10:00:00.000000+00:00'

      const dueDate = getOrderDueDate(creationDate, startDate)

      const expectedDueDate = new Date(creationDate)
      expect(dueDate.toISOString()).toBe(expectedDueDate.toISOString())
    })
  })

  describe('isOrderDueDateImmediate', () => {
    it('returns false if the course start date is more then 8 weeks from start date', () => {
      const creationDate = new Date('2023-01-13T10:00:00.000000+00:00')
      const startDate = new Date('2023-08-13T10:00:00.000000+00:00')

      const result = isOrderDueDateImmediate(creationDate, startDate)

      expect(result).toBe(false)
    })

    it('returns true if the course start date is less then 8 weeks from start date', () => {
      const creationDate = new Date('2023-01-13T10:00:00.000000+00:00')
      const startDate = new Date('2023-02-20T10:00:00.000000+00:00')

      const result = isOrderDueDateImmediate(creationDate, startDate)

      expect(result).toBe(true)
    })

    it('returns true if the payment method is credit cards', () => {
      const creationDate = new Date('2023-01-13T10:00:00.000000+00:00')
      const startDate = new Date('2023-08-13T10:00:00.000000+00:00')

      const result = isOrderDueDateImmediate(
        creationDate,
        startDate,
        PaymentMethod.Cc
      )

      expect(result).toBe(true)
    })
  })
})
