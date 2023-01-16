import { add } from 'date-fns'

import { getOrderDueDate } from './orderDueDate'

describe('orderDueDate utils', () => {
  describe('if the course start date is more then 8 weeks from start date', () => {
    it('returns a due date 8 weeks from the start date', () => {
      const creationDate = '2023-01-13T10:00:00.000000+00:00'
      const startDate = '2023-08-13T10:00:00.000000+00:00'

      const dueDate = getOrderDueDate(creationDate, startDate)

      const expectedDueDate = add(new Date(startDate), { weeks: 8 })
      expect(dueDate.toISOString()).toBe(expectedDueDate.toISOString())
    })
  })

  describe('if the course start date is less then 8 weeks from start date', () => {
    it('returns a due date equal to creation date', () => {
      const creationDate = '2023-01-13T10:00:00.000000+00:00'
      const startDate = '2023-02-20T10:00:00.000000+00:00'

      const dueDate = getOrderDueDate(creationDate, startDate)

      const expectedDueDate = new Date(creationDate)
      expect(dueDate.toISOString()).toBe(expectedDueDate.toISOString())
    })
  })
})
