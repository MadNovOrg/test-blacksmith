import { TFunction } from 'i18next'
import isEmail from 'validator/lib/isEmail'

import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas
      .email(t)
      .required(t('validation-errors.email-required'))
      .test('is-email', t('validation-errors.email-invalid'), email => {
        return isEmail(email)
      }),

    phone: schemas.phone(t).required(),

    orgName: yup.string().required(requiredMsg(t, 'org-name')),
    recaptchaToken: yup
      .string()
      .required(t('validation-errors.recaptcha-required')),
  })
}
