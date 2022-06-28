import { TFunction } from 'i18next'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { CourseLevel } from '@app/types'

export type FormInputs = {
  code: string
  description: string
  type: Promo_Code_Type_Enum
  amount: number
  appliesTo: APPLIES_TO // Frontend only. Needed for yup schema
  levels: CourseLevel[]
  courses: number[]
  validFrom: Date | null
  validTo: Date | null
  bookerSingleUse: boolean
  usesMax: number | null
  createdBy: string
  approvedBy?: string
}

export enum AMOUNT_PRESETS {
  FIVE = 'FIVE',
  TEN = 'TEN',
  FIFTEEN = 'FIFTEEN',
  OTHER = 'OTHER',
}

export const AMOUNT_PRESET_VALUE = {
  [AMOUNT_PRESETS.FIVE]: 5,
  [AMOUNT_PRESETS.TEN]: 10,
  [AMOUNT_PRESETS.FIFTEEN]: 15,
}

export enum APPLIES_TO {
  ALL = 'ALL',
  LEVELS = 'LEVELS',
  COURSES = 'COURSES',
}

export const DEFAULT_AMOUNT_PER_TYPE = {
  [Promo_Code_Type_Enum.Percent]: 5,
  [Promo_Code_Type_Enum.FreePlaces]: 1,
}

export const schema = ({ t, minDate }: { t: TFunction; minDate: Date }) => {
  return yup.object({
    code: yup.string().required(
      t('validation-errors.required-field', {
        name: t('pages.promoCodes.fld-code-label'),
      })
    ),
    description: yup.string(),
    amount: yup
      .number()
      .label(t('pages.promoCodes.fld-amount-label'))
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .required()
      .min(0)
      .max(100),
    appliesTo: yup.string(),
    levels: yup
      .array()
      .when('appliesTo', { is: APPLIES_TO.LEVELS, then: s => s.min(1) }),
    courses: yup
      .array()
      .when('appliesTo', { is: APPLIES_TO.COURSES, then: s => s.min(1) }),
    validFrom: yup
      .date()
      .typeError(t('validation-errors.this-field-is-required'))
      .required(t('validation-errors.this-field-is-required'))
      .min(
        minDate,
        t('validation-errors.date-gte', {
          date: t('dates.default', { date: minDate }),
        })
      ),
    validTo: yup
      .date()
      .nullable()
      .min(
        yup.ref('validFrom'),
        t('validation-errors.date-gte-field', {
          field: t('pages.promoCodes.fld-validFrom-label'),
        })
      ),
    bookerSingleUse: yup.bool().required(),
    usesMax: yup
      .number()
      .label(t('pages.promoCodes.fld-usesMax-label'))
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .nullable()
      .min(1),
  })
}

export const canSelfApprove = (data: FormInputs) => {
  if (data.type === Promo_Code_Type_Enum.Percent) {
    return data.amount < 15
  }
  if (data.type === Promo_Code_Type_Enum.FreePlaces) {
    return data.amount < 3
  }
}
