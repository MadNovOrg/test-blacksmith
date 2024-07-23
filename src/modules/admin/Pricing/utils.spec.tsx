import { addDays, subDays } from 'date-fns'

import {
  validatePricingDates,
  datesValidationMap,
  DatesValidation,
} from './utils'

describe(validatePricingDates.name, () => {
  describe('tests new pricings', () => {
    const isNewPricingMock = true
    it('throws error if entered effective from date is not later than today', () => {
      const effectiveFromMock = subDays(new Date(), 1)
      validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: null,
        pricingScheduleEffectiveTo: null,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_FROM_EARLIER_THAN_TODAY]: true,
      })
    })
    it('doesnt throw if entered effective from date is later than today', () => {
      const effectiveFromMock = addDays(new Date(), 1)
      validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: null,
        pricingScheduleEffectiveTo: null,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({})
    })
    it('throws if effectiveFrom date is within another dates interval', () => {
      const effectiveFromMock = addDays(new Date(), 1)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_FROM_RESIDES_IN_OTHER_INTERVAL]: true,
      })
    })
    it('creates if effectiveFrom date is not within another interval', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({})
    })
    it('throws if there is an existing interval with no end date', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: null,
      }
      validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.SET_EFFECTIVE_TO_FOR_EXISTING_SCHEDULE]: true,
      })
    })
    it('throws if two intervals overlap', () => {
      const effectiveFromMock = addDays(new Date(), 1)
      const effectiveToMock = addDays(new Date(), 3)
      const existingIntervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      validatePricingDates({
        isNewPricing: isNewPricingMock,
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: effectiveToMock,
        pricingScheduleEffectiveFrom: existingIntervalMock.start,
        pricingScheduleEffectiveTo: existingIntervalMock.end,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.INTERVALS_OVERLAP]: true,
      })
    })
  })
  describe('validates editing', () => {
    it('throws if effective from date is earlier than today', () => {
      const effectiveFromMock = subDays(new Date(), 10)
      const intervalMock = {
        start: addDays(new Date(), 1),
        end: addDays(new Date(), 2),
      }
      validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: intervalMock.end,
      })
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
      validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: intervalMock.end,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({})
    })
    it('throws if intervals overlap and no end date set', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const intervalMock = {
        start: subDays(new Date(), 1),
      }
      validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: null,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.SET_EFFECTIVE_TO_FOR_EXISTING_SCHEDULE]: true,
      })
    })
    it('throws if effective from date is within another interval', () => {
      const effectiveFromMock = addDays(new Date(), 3)
      const intervalMock = {
        start: subDays(new Date(), 1),
        end: addDays(new Date(), 5),
      }
      validatePricingDates({
        selectedEffectiveFrom: effectiveFromMock,
        selectedEffectiveTo: null,
        pricingScheduleEffectiveFrom: intervalMock.start,
        pricingScheduleEffectiveTo: intervalMock.end,
      })
      expect(Object.fromEntries(datesValidationMap)).toEqual({
        [DatesValidation.EFFECTIVE_FROM_RESIDES_IN_OTHER_INTERVAL]: true,
      })
    })
  })
})
