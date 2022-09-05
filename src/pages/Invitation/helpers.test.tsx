import { getTimeDifferenceAndContext } from './helpers'

describe('getTimeDifferenceAndContext() -', () => {
  describe('>1 day && <2 days', () => {
    const start = new Date('2022-01-01 00:00')
    const end = new Date('2022-01-02 00:01')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 1', () => {
      expect(count).toEqual(1)
    })
    test('context: days', () => {
      expect(context).toEqual('days')
    })
  })

  describe('1 day', () => {
    const start = new Date('2022-01-01 00:00')
    const end = new Date('2022-01-02 00:00')
    const { count, context } = getTimeDifferenceAndContext(end, start)
    test('count: 1', () => {
      expect(count).toEqual(1)
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
