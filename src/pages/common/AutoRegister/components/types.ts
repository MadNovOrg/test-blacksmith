import { subYears } from 'date-fns'
import { TFunction } from 'i18next'

import { Organization } from '@app/generated/graphql'
import { schemas, yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

export type FormInputs = {
  firstName: string
  surname: string
  phone: string
  password: string
  dob: Date | null
  tcs: boolean
  jobTitle: string
  otherJobTitle: string
  organization?: Pick<Organization, 'name' | 'id'>
}

export const getFormSchema = (t: TFunction) => {
  return yup.object({
    firstName: yup.string().required(requiredMsg(t, 'first-name')),
    surname: yup.string().required(requiredMsg(t, 'surname')),
    password: schemas.password(t),

    phone: schemas.phone(t),
    dob: yup
      .date()
      .typeError(t('validation-errors.invalid-date'))
      .required(t('validation-errors.date-required'))
      .max(subYears(new Date(), 16), t('validation-errors.date-too-early')),

    tcs: yup.boolean().oneOf([true], t('pages.signup.tcs-required')),

    jobTitle: yup.string().required(requiredMsg(t, 'job-title')),
    organization: yup.object<Pick<Organization, 'name' | 'id'>>().required(
      t('validation-errors.required-field', {
        name: t('components.org-selector.placeholder'),
      })
    ),
    otherJobTitle: yup.string().when('jobTitle', ([jobTitle], schema) => {
      return jobTitle === 'Other'
        ? schema.required(t('validation-errors.other-job-title-required'))
        : schema
    }),
  })
}
