import { GridRowsProp } from '@mui/x-data-grid'
import {
  areIntervalsOverlapping,
  format,
  isAfter,
  isBefore,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfToday,
} from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TFunction, t } from 'i18next'
import { isEqual } from 'lodash'
import * as yup from 'yup'

import {
  Course_Pricing_Schedule,
  Course_Pricing,
  Course_Level_Enum,
  PricingChangelogQuery,
} from '@app/generated/graphql'
import { isNotNullish } from '@app/util'

type PricingDates = {
  pricingScheduleEffectiveFrom: Date | null
  pricingScheduleEffectiveTo: Date | null
  selectedEffectiveFrom?: Date | null
  selectedEffectiveTo?: Date | null
  isNewPricing?: boolean
  isAgainstSelf?: boolean
}

export enum DatesValidation {
  EFFECTIVE_TO_RESIDES_IN_OTHER_INTERVAL = 'EFFECTIVE_TO_RESIDES_IN_OTHER_INTERVAL',
  EFFECTIVE_FROM_RESIDES_IN_OTHER_INTERVAL = 'EFFECTIVE_FROM_RESIDES_IN_OTHER_INTERVAL',
  INCLUDES_DATES_FROM_OTHER_INTERVAL = 'INCLUDES_DATES_FROM_OTHER_INTERVAL',
  SET_EFFECTIVE_TO_FOR_EXISTING_SCHEDULE = 'SET_EFFECTIVE_TO_FOR_EXISTING_SCHEDULE',
  EFFECTIVE_FROM_EARLIER_THAN_TODAY = 'EFFECTIVE_FROM_EARLIER_THAN_TODAY',
  INTERVALS_OVERLAP = 'INTERVALS_OVERLAP',
  EFFECTIVE_DATE_VALID_INTERVAL = 'EFFECTIVE_DATE_VALID_INTERVAL',
}
export const datesValidationMap = new Map<DatesValidation, boolean | string>()
export const validationAsMessages = new Map<DatesValidation, boolean | string>()

export function getCourseAttributes(
  t: TFunction,
  coursePricing?: Course_Pricing | null,
): string {
  return [
    coursePricing?.reaccreditation && t('reaccreditation'),
    coursePricing?.blended && t('blended-learning'),
  ]
    .filter(Boolean)
    .join(', ')
}

const today = startOfToday()

export const getInitialRows = (
  pricingSchedules: Course_Pricing_Schedule[] | undefined,
): GridRowsProp => {
  return (pricingSchedules ?? []).map(schedule => ({
    id: schedule.id,
    effectiveFrom: schedule.effectiveFrom,
    effectiveTo: schedule.effectiveTo,
    priceAmount: schedule.priceAmount,
    isNew: false,
  }))
}

export const validatePricingDates = ({
  pricingScheduleEffectiveFrom,
  pricingScheduleEffectiveTo,
  selectedEffectiveFrom,
  selectedEffectiveTo,
  isNewPricing,
  isAgainstSelf,
}: PricingDates) => {
  datesValidationMap.clear()
  if (isNewPricing) {
    validateDatesForNewPricings({
      selectedEffectiveFrom,
      selectedEffectiveTo,
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
    })
  } else {
    validateEditingExistingPrices({
      selectedEffectiveFrom,
      selectedEffectiveTo,
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
      isAgainstSelf,
    })
  }
  mapValidationToMessage()
}

// Validates new pricing

function validateDatesForNewPricings({
  pricingScheduleEffectiveFrom,
  pricingScheduleEffectiveTo,
  selectedEffectiveFrom,
  selectedEffectiveTo,
}: PricingDates) {
  if (!isNotNullish(selectedEffectiveFrom)) {
    return
  }

  if (
    isEffectiveDateValidInterval(selectedEffectiveFrom, selectedEffectiveTo)
  ) {
    return setValidationError(DatesValidation.EFFECTIVE_DATE_VALID_INTERVAL)
  }

  if (!isEffectiveDateGreaterThanToday(selectedEffectiveFrom)) {
    return setValidationError(DatesValidation.EFFECTIVE_FROM_EARLIER_THAN_TODAY)
  }

  if (
    isIntervalsOverlapForNewPricing(
      selectedEffectiveFrom,
      selectedEffectiveTo,
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
    )
  ) {
    return setValidationError(DatesValidation.INTERVALS_OVERLAP)
  }

  if (
    isEffectiveFromResidesInOtherInterval(
      selectedEffectiveFrom,
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
      false,
    )
  ) {
    return setValidationError(
      DatesValidation.EFFECTIVE_FROM_RESIDES_IN_OTHER_INTERVAL,
    )
  }

  if (
    shouldSetEffectiveToForExistingSchedule(
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
    )
  ) {
    return setValidationError(
      DatesValidation.SET_EFFECTIVE_TO_FOR_EXISTING_SCHEDULE,
    )
  }

  if (
    includesDatesFromOtherInterval(
      selectedEffectiveFrom,
      selectedEffectiveTo,
      pricingScheduleEffectiveFrom,
    )
  ) {
    return setValidationError(
      DatesValidation.INCLUDES_DATES_FROM_OTHER_INTERVAL,
    )
  }
}

// Validates Editing
function validateEditingExistingPrices({
  selectedEffectiveFrom,
  pricingScheduleEffectiveFrom,
  pricingScheduleEffectiveTo,
  isAgainstSelf,
  selectedEffectiveTo,
}: PricingDates) {
  if (!isNotNullish(selectedEffectiveFrom)) {
    return
  }

  if (
    !isAgainstSelf &&
    shouldSetEffectiveToForExistingSchedule(
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
    )
  ) {
    return setValidationError(
      DatesValidation.SET_EFFECTIVE_TO_FOR_EXISTING_SCHEDULE,
    )
  }

  if (
    isEffectiveFromEarlierThanToday(
      selectedEffectiveFrom,
      pricingScheduleEffectiveFrom,
    )
  ) {
    return setValidationError(DatesValidation.EFFECTIVE_FROM_EARLIER_THAN_TODAY)
  }

  if (
    isEffectiveDateValidInterval(selectedEffectiveFrom, selectedEffectiveTo)
  ) {
    return setValidationError(DatesValidation.EFFECTIVE_DATE_VALID_INTERVAL)
  }

  if (
    isEffectiveFromResidesInOtherInterval(
      selectedEffectiveFrom,
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
      isAgainstSelf,
    )
  ) {
    return setValidationError(
      DatesValidation.EFFECTIVE_FROM_RESIDES_IN_OTHER_INTERVAL,
    )
  }

  if (
    isIntervalsOverlap(
      selectedEffectiveFrom,
      selectedEffectiveTo,
      pricingScheduleEffectiveFrom,
      pricingScheduleEffectiveTo,
      isAgainstSelf,
    )
  ) {
    return setValidationError(DatesValidation.INTERVALS_OVERLAP)
  }
}

// Helper functions for validation

function isIntervalsOverlapForNewPricing(
  selectedEffectiveFrom: Date,
  selectedEffectiveTo: Date | null | undefined,
  pricingScheduleEffectiveFrom: Date | null,
  pricingScheduleEffectiveTo: Date | null,
) {
  return (
    selectedEffectiveFrom &&
    selectedEffectiveTo &&
    pricingScheduleEffectiveFrom &&
    areIntervalsOverlapping(
      { start: selectedEffectiveFrom, end: selectedEffectiveTo },
      {
        start: pricingScheduleEffectiveFrom,
        end: pricingScheduleEffectiveTo ?? new Date(2199, 11, 31),
      },
      { inclusive: true },
    )
  )
}

function includesDatesFromOtherInterval(
  selectedEffectiveFrom: Date,
  selectedEffectiveTo: Date | null | undefined,
  pricingScheduleEffectiveFrom: Date | null,
) {
  return (
    selectedEffectiveFrom &&
    !selectedEffectiveTo &&
    pricingScheduleEffectiveFrom &&
    (isAfter(pricingScheduleEffectiveFrom, selectedEffectiveFrom) ||
      isEqual(pricingScheduleEffectiveFrom, selectedEffectiveFrom))
  )
}

function shouldSetEffectiveToForExistingSchedule(
  pricingScheduleEffectiveFrom: Date | null,
  pricingScheduleEffectiveTo: Date | null,
) {
  return !pricingScheduleEffectiveTo && pricingScheduleEffectiveFrom
}

function isEffectiveFromEarlierThanToday(
  selectedEffectiveFrom: Date,
  pricingScheduleEffectiveFrom: Date | null,
) {
  return (
    selectedEffectiveFrom &&
    pricingScheduleEffectiveFrom &&
    yyyyMMddDateFormat(selectedEffectiveFrom) !==
      yyyyMMddDateFormat(pricingScheduleEffectiveFrom) &&
    !isEffectiveDateGreaterThanToday(selectedEffectiveFrom)
  )
}

function isEffectiveDateValidInterval(
  selectedEffectiveFrom: Date,
  selectedEffectiveTo: Date | null | undefined,
) {
  return (
    selectedEffectiveTo &&
    isBefore(
      startOfDay(new Date(selectedEffectiveTo)),
      startOfDay(new Date(selectedEffectiveFrom)),
    )
  )
}

function isEffectiveFromResidesInOtherInterval(
  selectedEffectiveFrom: Date,
  pricingScheduleEffectiveFrom: Date | null,
  pricingScheduleEffectiveTo: Date | null,
  isAgainstSelf: boolean | undefined,
) {
  return (
    !isAgainstSelf &&
    pricingScheduleEffectiveFrom &&
    pricingScheduleEffectiveTo &&
    isEffectiveDateWithinInterval(selectedEffectiveFrom, {
      start: pricingScheduleEffectiveFrom,
      end: pricingScheduleEffectiveTo,
    })
  )
}

function isIntervalsOverlap(
  selectedEffectiveFrom: Date,
  selectedEffectiveTo: Date | null | undefined,
  pricingScheduleEffectiveFrom: Date | null,
  pricingScheduleEffectiveTo: Date | null,
  isAgainstSelf: boolean | undefined,
) {
  return (
    !isAgainstSelf &&
    selectedEffectiveFrom &&
    pricingScheduleEffectiveFrom &&
    areIntervalsOverlapping(
      {
        start: startOfDay(selectedEffectiveFrom),
        end: startOfDay(selectedEffectiveTo ?? new Date(2199, 11, 31)),
      },
      {
        start: startOfDay(pricingScheduleEffectiveFrom),
        end: startOfDay(pricingScheduleEffectiveTo ?? new Date(2199, 11, 31)),
      },
      { inclusive: true },
    )
  )
}

function isEffectiveDateGreaterThanToday(effectiveDate: Date): boolean {
  const dateToCheck = startOfDay(effectiveDate)
  return (
    isAfter(dateToCheck, today) ||
    (isToday(dateToCheck) && !isBefore(dateToCheck, today))
  )
}

function isEffectiveDateWithinInterval(
  effectiveDate: Date,
  interval: Interval,
): boolean {
  const datesWithEqualHours = {
    effectiveDate: startOfDay(effectiveDate),
    interval: {
      start: startOfDay(interval.start),
      end: startOfDay(interval.end),
    },
  }

  const {
    effectiveDate: effectiveDateWithZeroGMT,
    interval: intervalWithZeroGMT,
  } = datesWithEqualHours
  return isWithinInterval(effectiveDateWithZeroGMT, {
    start: intervalWithZeroGMT.start,
    end: intervalWithZeroGMT.end,
  })
}

function setValidationError(validationType: DatesValidation) {
  return datesValidationMap.set(validationType, true)
}

function mapValidationToMessage() {
  validationAsMessages.clear()
  datesValidationMap.forEach((value, key) =>
    validationAsMessages.set(
      key,
      value === true
        ? t(`pages.course-pricing.validation-errors.${key}`)
        : value,
    ),
  )
}

export function yyyyMMddDateFormat(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export const getSchema = ({
  pricings,
  isNewPricing,
  rowId,
}: {
  pricings?: Course_Pricing_Schedule[]
  isNewPricing: boolean
  rowId: string
}) => {
  return yup.object({
    effectiveFrom: yup
      .string()
      .required(
        t('pages.course-pricing.validation-errors.effective-from-required'),
      )
      .test('validEffectiveFrom', '', (value, context) => {
        const effectiveFrom = value
        const effectiveTo = context.parent.effectiveTo
        if (!pricings?.length) {
          validatePricingDates({
            pricingScheduleEffectiveFrom: null,
            pricingScheduleEffectiveTo: null,
            selectedEffectiveFrom: new Date(effectiveFrom),
            selectedEffectiveTo: effectiveTo ? new Date(effectiveTo) : null,
            isNewPricing,
          })
        }

        pricings?.forEach(schedule => {
          if (rowId === schedule.id) return
          validatePricingDates({
            pricingScheduleEffectiveFrom: new Date(schedule.effectiveFrom),
            pricingScheduleEffectiveTo: schedule.effectiveTo
              ? new Date(schedule.effectiveTo)
              : null,
            selectedEffectiveFrom: new Date(effectiveFrom),
            selectedEffectiveTo: effectiveTo ? new Date(effectiveTo) : null,
            isNewPricing,
          })
        })
        if (datesValidationMap.size === 0) return true
      }),
    effectiveTo: yup
      .string()
      .test('validEffectiveTo', '', (value, context) => {
        const effectiveTo = value
        const effectiveFrom = context.parent.effectiveFrom
        if (!pricings?.length && effectiveTo) {
          validatePricingDates({
            pricingScheduleEffectiveFrom: null,
            pricingScheduleEffectiveTo: null,
            selectedEffectiveTo: new Date(effectiveTo),
            selectedEffectiveFrom: new Date(effectiveFrom),
            isNewPricing,
          })
        }

        pricings?.forEach(schedule => {
          validatePricingDates({
            pricingScheduleEffectiveFrom: new Date(schedule.effectiveFrom),
            pricingScheduleEffectiveTo: schedule.effectiveTo
              ? new Date(schedule.effectiveTo)
              : null,
            selectedEffectiveTo: effectiveTo ? new Date(effectiveTo) : null,
            selectedEffectiveFrom: new Date(effectiveFrom),
            isNewPricing,
            isAgainstSelf: rowId === schedule.id,
          })
        })
        if (datesValidationMap.size === 0) return true
      })
      .test(
        'EffectiveToBeforeEffectiveFrom',
        t(
          'pages.course-pricing.validation-errors.EFFECTIVE_DATE_VALID_INTERVAL',
        ),
        (value, context) => {
          if (!value) return true
          return (
            zonedTimeToUtc(new Date(value), 'GMT') >=
            zonedTimeToUtc(new Date(context?.parent.effectiveFrom), 'GMT')
          )
        },
      )
      .nullable(),
    priceAmount: yup
      .number()
      .positive(
        t('pages.course-pricing.validation-errors.price-amount-positive'),
      )
      .required(
        t('pages.course-pricing.validation-errors.price-amount-required'),
      ),
  })
}

export const BILD_COURSE_LEVELS = [
  Course_Level_Enum.BildRegular,
  Course_Level_Enum.BildAdvancedTrainer,
  Course_Level_Enum.BildIntermediateTrainer,
]

export const formatChangelogDate = (
  date: PricingChangelogQuery['course_pricing_changelog'][number]['newEffectiveFrom'],
  separator: '-' | '/' = '-',
) => {
  return format(new Date(date), `yyyy${separator}MM${separator}dd`)
}

export const formatSchedulePriceDuration = (
  changelog: Pick<
    PricingChangelogQuery['course_pricing_changelog'][number],
    | 'courseSchedulePrice'
    | 'newEffectiveFrom'
    | 'newEffectiveTo'
    | 'oldEffectiveFrom'
    | 'oldEffectiveTo'
  >,
) => {
  const {
    courseSchedulePrice,
    newEffectiveFrom,
    newEffectiveTo,
    oldEffectiveFrom,
    oldEffectiveTo,
  } = changelog

  let from = ''
  let to = ''

  if (
    !newEffectiveFrom &&
    !newEffectiveTo &&
    !oldEffectiveFrom &&
    !oldEffectiveTo
  ) {
    from = format(new Date(courseSchedulePrice?.effectiveFrom), 'yyyy/MM/dd')
    to = format(new Date(courseSchedulePrice?.effectiveTo), 'yyyy/MM/dd')
  } else {
    const isInsertChangelog =
      newEffectiveFrom && newEffectiveTo && !oldEffectiveFrom && !oldEffectiveTo

    from = format(
      new Date(isInsertChangelog ? newEffectiveFrom : oldEffectiveFrom),
      'yyyy/MM/dd',
    )

    to = format(
      new Date(isInsertChangelog ? newEffectiveTo : oldEffectiveTo),
      'yyyy/MM/dd',
    )
  }

  return `${from ?? ''}${to ? ` - ${to}` : ''}`
}

export const getChangelogEvents = (
  changelog: Pick<
    PricingChangelogQuery['course_pricing_changelog'][number],
    | 'coursePricing'
    | 'newEffectiveFrom'
    | 'newEffectiveTo'
    | 'newPrice'
    | 'oldEffectiveFrom'
    | 'oldEffectiveTo'
    | 'oldPrice'
  >,
  t: TFunction,
) => {
  const events: string[] = []
  const {
    newEffectiveFrom,
    newEffectiveTo,
    newPrice,
    oldEffectiveFrom,
    oldEffectiveTo,
    oldPrice,
  } = changelog

  const isChangelogPriceCreation =
    !oldPrice && !oldEffectiveFrom && !oldEffectiveTo

  const isChangelogPriceDelete =
    !newPrice && !newEffectiveFrom && !newEffectiveTo

  if (isChangelogPriceCreation) {
    events.push(
      t('pages.course-pricing.modal-changelog-insert-event', {
        newPrice: t('currency', {
          amount: changelog.newPrice,
          currency: changelog.coursePricing.priceCurrency,
        }),
      }),
    )
  } else if (isChangelogPriceDelete) {
    events.push(
      t('pages.course-pricing.modal-changelog-delete-event', {
        oldPrice: t('currency', {
          amount: changelog.oldPrice,
          currency: changelog.coursePricing.priceCurrency,
        }),
      }),
    )
  } else {
    const changedPrice = oldPrice && newPrice
    const effectiveFromChanged = oldEffectiveFrom && newEffectiveFrom
    const effectiveToChanged = oldEffectiveTo && newEffectiveTo

    if (changedPrice) {
      events.push(
        t('pages.course-pricing.modal-changelog-update-price-event', {
          oldPrice: t('currency', {
            amount: changelog.oldPrice,
            currency: changelog.coursePricing.priceCurrency,
          }),
          newPrice: t('currency', {
            amount: changelog.newPrice,
            currency: changelog.coursePricing.priceCurrency,
          }),
        }),
      )
    }

    if (effectiveFromChanged) {
      events.push(
        t('pages.course-pricing.modal-changelog-update-effective-from-event', {
          newDate: formatChangelogDate(newEffectiveFrom),
          oldDate: formatChangelogDate(oldEffectiveFrom),
        }),
      )
    }

    if (effectiveToChanged) {
      events.push(
        t('pages.course-pricing.modal-changelog-update-effective-to-event', {
          newDate: formatChangelogDate(newEffectiveTo),
          oldDate: formatChangelogDate(oldEffectiveTo),
        }),
      )
    }
  }

  return events
}

export const getChangelogDuration = (
  changelogs: PricingChangelogQuery['course_pricing_changelog'],
) => {
  if (changelogs[0].courseSchedulePrice) {
    return {
      from: changelogs[0].courseSchedulePrice.effectiveFrom,
      to: changelogs[0].courseSchedulePrice.effectiveTo,
    }
  }

  const deleteChangelog = changelogs.find(
    changelog =>
      !(
        changelog.newPrice &&
        changelog.newEffectiveFrom &&
        changelog.newEffectiveTo
      ),
  )

  if (deleteChangelog) {
    return {
      from: deleteChangelog.oldEffectiveFrom,
      to: deleteChangelog.oldEffectiveTo,
    }
  }
}
