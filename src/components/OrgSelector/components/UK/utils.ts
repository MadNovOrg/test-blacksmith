import { TFunction } from 'i18next'
import { isPossibleNumber } from 'libphonenumber-js'
import isEmail from 'validator/lib/isEmail'
import * as yup from 'yup'

import { Establishment } from '@app/types'
import { isValidUKPostalCode } from '@app/util'

import { isDfeSuggestion } from '../../UK/utils'

export const getSchema = ({
  t,
  isInUK,
  isDfeSuggestion,
}: {
  t: TFunction
  isInUK: boolean
  isDfeSuggestion: boolean
}) => {
  return yup.object({
    organisationName: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.organisation-name'),
      }),
    ),
    sector: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.sector'),
      }),
    ),
    organisationType: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.organisation-type'),
      }),
    ),
    orgTypeSpecifyOther: yup.string().when('specifyOther', {
      is: true,
      then: ot =>
        ot.required(
          t('validation-errors.required-field', {
            name: t(
              'components.add-organisation.fields.organisation-specify-other',
            ),
          }),
        ),
    }),
    organisationEmail: yup
      .string()
      .required(
        t('validation-errors.required-field', {
          name: t('components.add-organisation.fields.organisation-email'),
        }),
      )
      .test('is-email', t('validation-errors.email-invalid'), email => {
        return isEmail(email)
      }),
    addressLine1: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.primary-address-line'),
      }),
    ),
    addressLine2: yup.string(),
    city: yup.string().required(
      t('validation-errors.required-composed-field', {
        field1: t('pages.create-organization.fields.addresses.town'),
        field2: t('pages.create-organization.fields.addresses.city'),
      }),
    ),
    ...(isInUK
      ? {
          postCode: yup
            .string()
            .required(
              t('validation-errors.required-field', {
                name: t('components.add-organisation.fields.postCode'),
              }),
            )
            .test(
              'is-uk-postcode',
              t('validation-errors.invalid-postcode'),
              isValidUKPostalCode,
            ),
        }
      : {
          postCode: yup.string(),
        }),
    country: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.country'),
      }),
    ),
    ...(isDfeSuggestion
      ? {
          organisationPhoneNumber: yup
            .string()
            .test(
              'organisationPhoneNumber',
              t('validation-errors.invalid-phone'),
              (value: string | undefined, context) => {
                if (
                  //if user has not interacted with phone number field, the context.parent.countryCallingCode will be undefined
                  !context.parent.countryCallingCode ||
                  value === context?.parent?.countryCallingCode
                ) {
                  return true
                }

                return isPossibleNumber(value ?? '')
              },
            ),
          countryCallingCode: yup.string(),
        }
      : {}),
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
        organisationPhoneNumber: '',
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
  organisationPhoneNumber?: string
  countryCallingCode?: string
}
