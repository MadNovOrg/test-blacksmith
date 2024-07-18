import { subYears } from 'date-fns'
import { TFunction } from 'i18next'

import { schemas, yup } from '@app/schemas'
import { Organization } from '@app/types'
import { requiredMsg } from '@app/util'

export type FormInputs = {
  firstName: string
  surname: string
  email: string
  country: string
  countryCode: string
  phone: string
  phoneCountryCode: string
  password: string
  dob: Date | null
  tcs: boolean
  recaptchaToken: string
  jobTitle: string
  otherJobTitle: string
  organization?: Pick<Organization, 'name' | 'id'>
}

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),

    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: schemas.email(t),

    phone: schemas.phone(t),

    phoneCountryCode: yup.string().optional(),

    country: yup.string().required(),

    countryCode: yup.string().required(),

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

    jobTitle: yup.string().required(requiredMsg(t, 'job-title')),

    otherJobTitle: yup.string().when('jobTitle', ([jobTitle], schema) => {
      return jobTitle === 'Other'
        ? schema.required(t('validation-errors.other-job-title-required'))
        : schema
    }),

    organization: yup
      .object()
      .required(t('components.course-form.organisation-required')),
  })
}
