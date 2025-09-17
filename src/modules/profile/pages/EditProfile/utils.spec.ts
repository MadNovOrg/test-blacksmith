import { useTranslation } from 'react-i18next'

import { renderHook } from '@test/index'

import {
  DietaryRestrictionRadioValues,
  DisabilitiesRadioValues,
} from '../../utils'

import { getDietaryRestrictionsValue, getDisabilitiesValue } from './utils'

describe('EditProfile utils', () => {
  describe(getDisabilitiesValue.name, () => [
    it('should return NO if there are no disabilities set', () => {
      expect(
        getDisabilitiesValue({
          disabilities: null,
        }),
      ).toEqual(DisabilitiesRadioValues.NO)
    }),
    it('should return YES if there are disabilities set', () => {
      expect(
        getDisabilitiesValue({
          disabilities: 'Some disabilities',
        }),
      ).toEqual(DisabilitiesRadioValues.YES)
    }),
    it('should return RATHER NOT SAY', () => {
      const {
        result: {
          current: { t },
        },
      } = renderHook(() => useTranslation())
      expect(
        getDisabilitiesValue({
          disabilities: t('rather-not-say'),
          ratherNotSaySpecificText: t('rather-not-say'),
        }),
      ).toEqual(DisabilitiesRadioValues.RATHER_NOT_SAY)
    }),
  ])
  describe(getDietaryRestrictionsValue.name, () => {
    it('should return NO if there are no disabilities set', () => {
      expect(
        getDietaryRestrictionsValue({
          restrictions: null,
        }),
      ).toEqual(DietaryRestrictionRadioValues.NO)
    })
    it('should return YES if there are disabilities set', () => {
      expect(
        getDietaryRestrictionsValue({
          restrictions: 'Some restrictions',
        }),
      ).toEqual(DietaryRestrictionRadioValues.YES)
    })
  })
})
