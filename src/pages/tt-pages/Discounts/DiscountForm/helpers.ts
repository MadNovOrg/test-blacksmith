import { TFunction } from 'i18next'

import { Promo_Code_Type_Enum, Course_Level_Enum } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { RoleName } from '@app/types'

export type FormInputs = {
  code: string
  description: string
  type: Promo_Code_Type_Enum
  amount: number
  appliesTo: APPLIES_TO // Frontend only. Needed for yup schema
  levels: Course_Level_Enum[]
  courses: number[]
  validFrom: Date | null
  validTo: Date | null
  bookerSingleUse: boolean
  usesMax: number | null
  createdBy: string
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

export const schema = ({ t }: { t: TFunction }) => {
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
      .required(t('validation-errors.this-field-is-required')),
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

export const requiresApproval = (data: FormInputs, role?: RoleName) => {
  if (role && (role === RoleName.TT_ADMIN || role === RoleName.FINANCE)) {
    return false
  }
  if (data.type === Promo_Code_Type_Enum.Percent) {
    return data.amount >= 15
  }
  if (data.type === Promo_Code_Type_Enum.FreePlaces) {
    return data.amount > 3
  }
}

export const getAmountPreset = (value: number) => {
  switch (value) {
    case 5:
      return AMOUNT_PRESETS.FIVE
    case 10:
      return AMOUNT_PRESETS.TEN
    case 15:
      return AMOUNT_PRESETS.FIFTEEN
    default:
      return AMOUNT_PRESETS.OTHER
  }
}
