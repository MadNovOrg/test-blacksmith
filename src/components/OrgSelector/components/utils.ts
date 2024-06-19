import { TFunction } from 'i18next'
import * as yup from 'yup'

import { Establishment } from '@app/types'
import { isValidUKPostalCode } from '@app/util'

import { isDfeSuggestion } from '../utils'

export const getSchema = ({
  t,
  useInternationalCountriesSelector,
  isInUK,
}: {
  t: TFunction
  useInternationalCountriesSelector: boolean
  isInUK: boolean
}) => {
  return yup.object({
    organisationName: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.organisation-name'),
      })
    ),
    sector: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.sector'),
      })
    ),
    organisationType: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.organisation-type'),
      })
    ),
    orgTypeSpecifyOther: yup.string().when('specifyOther', {
      is: true,
      then: ot =>
        ot.required(
          t('validation-errors.required-field', {
            name: t(
              'components.add-organisation.fields.organisation-specify-other'
            ),
          })
        ),
    }),
    organisationEmail: yup
      .string()
      .required(
        t('validation-errors.required-field', {
          name: t('components.add-organisation.fields.organisation-email'),
        })
      )
      .email(t('validation-errors.email-invalid')),
    addressLine1: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.primary-address-line'),
      })
    ),
    addressLine2: yup.string(),
    city: yup.string().required(
      t('validation-errors.required-composed-field', {
        field1: t('pages.create-organization.fields.addresses.town'),
        field2: t('pages.create-organization.fields.addresses.city'),
      })
    ),
    ...(useInternationalCountriesSelector
      ? {
          ...(isInUK
            ? {
                postCode: yup
                  .string()
                  .required(
                    t('validation-errors.required-field', {
                      name: t('components.add-organisation.fields.postCode'),
                    })
                  )
                  .test(
                    'is-uk-postcode',
                    t('validation-errors.invalid-postcode'),
                    isValidUKPostalCode
                  ),
              }
            : {
                postCode: yup.string(),
              }),
        }
      : {
          postCode: yup
            .string()
            .required(
              t('validation-errors.required-field', {
                name: t('components.add-organisation.fields.postCode'),
              })
            )
            .test(
              'is-uk-postcode',
              t('validation-errors.invalid-postcode'),
              isValidUKPostalCode
            ),
        }),

    country: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.country'),
      })
    ),
  })
}

export const getDefaultValues = ({
  option,
  getCountryLabel,
  countryCode,
}: {
  option: Establishment | { name: string }
  getCountryLabel: (code: string) => string | undefined
  countryCode: string
}) => {
  return isDfeSuggestion(option)
    ? {
        organisationName: option.name,
        addressLine1: option.addressLineOne ?? '',
        addressLine2: option.addressLineTwo ?? '',
        city: option.town ?? '',
        country: getCountryLabel(countryCode),
        countryCode: countryCode,
        postCode: option.postcode ?? '',
        sector: '',
        organisationType: '',
      }
    : {
        organisationName: option.name,
        addressLine1: '',
        sector: '',
        addressLine2: '',
        city: '',
        country: getCountryLabel(countryCode),
        countryCode: countryCode,
        organisationType: '',
        postCode: '',
      }
}

export type AddNewOrganizationFormInputs = {
  id?: string | null
  organisationName: string
  sector: string
  organisationType: string
  orgTypeSpecifyOther?: string
  organisationEmail: string
  addressLine1: string
  addressLine2: string
  city: string
  postCode: string
  country: string
  countryCode: string
}
