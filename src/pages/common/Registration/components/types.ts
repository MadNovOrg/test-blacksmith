import { subYears } from 'date-fns'
import { TFunction } from 'i18next'

import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

export type FormInputs = {
  firstName: string
  surname: string
  email: string
  phone: string
  password: string
  dob: Date | null
  tcs: boolean
  recaptchaToken: string
  position: string
  otherPosition: string
}

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas.email(t),

    phone: schemas.phone(t),
    password: schemas.password(t),

    dob: yup
      .date()
      .typeError(t('validation-errors.invalid-date'))
      .required(t('validation-errors.date-required'))
      .max(subYears(new Date(), 16), t('validation-errors.date-too-early')),

    tcs: yup.boolean().oneOf([true], t('pages.signup.tcs-required')),
    recaptchaToken: yup
      .string()
      .required(t('validation-errors.recaptcha-required')),

    position: yup.string().required(requiredMsg(t, 'position')),
    otherPosition: yup.string().when('position', ([position], schema) => {
      return position === 'Other'
        ? schema.required(t('validation-errors.other-position-required'))
        : schema
    }),
  })
}
