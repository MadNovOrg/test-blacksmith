import { addDays, subDays } from 'date-fns'

import {
  validatePricingDates,
  datesValidationMap,
  DatesValidation,
} from './utils'

describe(validatePricingDates.name, () => {
  beforeEach(() => {
    datesValidationMap.clear()
  })

  describe('tests new pricings', () => {
    const isNewPricingMock = true
    it('throws error if entered effective from date is not later than today', () => {
      const effectiveFromMock = subDays(new Date(), 1)
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: null,
        pricingScheduleEffectiveTo: null,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_FROM_EARLIER_THAN_TODAY]: true,
      })
    })
    it('doesnt throw if entered effective from date is later than today', () => {
      const effectiveFromMock = addDays(new Date(), 1)
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: null,
        pricingScheduleEffectiveTo: null,
      })
      expect(isValid).toBe(true)
      expect(Object.fromEntries(datesValidationMap)).toEqual({})
    })
    it('throws if effectiveFrom date is within another dates interval', () => {
      const effectiveFromMock = addDays(new Date(), 1)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.INTERVALS_OVERLAP]: true,
      })
    })
    it('creates if effectiveFrom date is not within another interval', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(true)
      expect(Object.fromEntries(datesValidationMap)).toEqual({})
    })
    it('throws if two intervals overlap', () => {
      const effectiveFromMock = addDays(new Date(), 1)
      const effectiveToMock = addDays(new Date(), 3)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: effectiveToMock,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.INTERVALS_OVERLAP]: true,
      })
    })

    it('throws if the "effective to" date is before the "effective from" date.', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const effectiveToMock = addDays(new Date(), 1)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: effectiveToMock,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_TO_BEFORE_EFFECTIVE_FROM]: true,
      })
    })

    it('throws if the "effective from" date is nullish', () => {
      const effectiveFromMock = null
      const effectiveToMock = addDays(new Date(), 1)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: effectiveToMock,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(false)
    })
  })
  describe('validates editing', () => {
    it('throws if effective from date is earlier than today', () => {
      const effectiveFromMock = subDays(new Date(), 10)
      const intervalMock = {
        start: addDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        isAgainstSelf: true,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: intervalMock.end,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_FROM_EARLIER_THAN_TODAY]: true,
      })
    })
    it('edits if effective from date is later than today', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const intervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: intervalMock.end,
      })
      expect(isValid).toBe(true)
      expect(Object.fromEntries(datesValidationMap)).toEqual({})
    })
    it('throws if effective from date is within another interval', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const intervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 5),
      }
      const isValid = validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: intervalMock.end,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.INTERVALS_OVERLAP]: true,
      })
    })
    it('throws if the "effective to" date is before the "effective from" date.', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const effectiveToMock = addDays(new Date(), 1)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: effectiveToMock,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(false)
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_TO_BEFORE_EFFECTIVE_FROM]: true,
      })
    })
    it('throws if the "effective from" date is nullish', () => {
      const effectiveFromMock = null
      const effectiveToMock = addDays(new Date(), 1)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      const isValid = validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: effectiveToMock,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(isValid).toBe(false)
    })
  })
})
