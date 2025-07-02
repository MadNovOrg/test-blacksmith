import { useMemo } from 'react'
import * as yup from 'yup'

import { Organization } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { schemas } from '@app/schemas'
import { requiredMsg } from '@app/util'

export const useOnboardingSchema = () => {
  const { t, _t } = useScopedTranslation('pages.onboarding')

  console.log(t('organisation-required-error'))

  const schema = useMemo(() => {
    return yup.object({
      country: yup.string().required(),
      countryCode: yup.string().required(),
      dob: yup
        .date()
        .nullable()
        .typeError(_t('validation-errors.invalid-date-optional'))
        .required(_t('validation-errors.date-required')),
      familyName: yup.string().required(requiredMsg(_t, 'surname')),
      givenName: yup.string().required(requiredMsg(_t, 'first-name')),
      jobTitle: yup.string().required(requiredMsg(_t, 'job-title')),
      organization: yup
        .object<Partial<Organization>>()
        .shape({
          id: yup.string().required(t('organisation-required-error')),
          name: yup.string().required(t('organisation-required-error')),
          moderatorRole: yup.boolean(),
        })
        .transform(value => (value === '' ? null : value))
        .test(
          'is-valid-organization',
          t('organisation-required-error'),
          value =>
            value !== null &&
            typeof value === 'object' &&
            !!value.id &&
            !!value.name,
        )
        .required(t('organisation-required-error')),
      otherJobTitle: yup
        .string()
        .when('jobTitle', ([jobTitle], schema) =>
          jobTitle === 'Other'
            ? schema.required(_t('validation-errors.other-job-title-required'))
            : schema,
        ),
      phone: schemas.phone(_t),
      phoneCountryCode: yup.string().optional(),
      tcs: yup.boolean().oneOf([true], t('tcs-required')),
    })
  }, [_t, t])

  return schema
}
