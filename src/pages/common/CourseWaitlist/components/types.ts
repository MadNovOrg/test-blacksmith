import { TFunction } from 'i18next'

import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas.email(t).required(t('validation-errors.email-required')),

    phone: yup
      .string()
      .required(requiredMsg(t, 'phone'))
      .min(10, t('validation-errors.phone-invalid')),

    orgName: yup.string().required(requiredMsg(t, 'org-name')),
    recaptchaToken: yup
      .string()
      .required(t('validation-errors.recaptcha-required')),
  })
}
