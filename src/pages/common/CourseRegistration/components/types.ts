import { schemas, yup, TFunction } from '@app/schemas'
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

    phone: yup.string().required(requiredMsg(t, 'phone')),
    password: schemas.password(t),

    dob: yup.date().typeError(t('validation-errors.invalid-date')),

    tcs: yup.boolean().oneOf([true], t('pages.signup.tcs-required')),
  })
}
