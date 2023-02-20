import { TFunction } from 'i18next'

import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

export type FormInputs = {
  firstName: string
  surname: string
  email: string
  marketing: boolean
  phone: string
  password: string
  dob: Date | null
  tcs: boolean
}

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas.email(t),
    marketing: yup.boolean(),

    phone: schemas.phone(t),
    password: schemas.password(t),

    dob: yup
      .date()
      .typeError(t('validation-errors.invalid-date'))
      .required(t('validation-errors.date-required')),

    tcs: yup.boolean().oneOf([true], t('pages.signup.tcs-required')),
  })
}
