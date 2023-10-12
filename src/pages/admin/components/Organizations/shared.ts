import { TFunction } from 'i18next'

import { yup } from '@app/schemas'
import { isValidUKPostalCode } from '@app/util'

export type FormInputs = {
  name: string
  orgEmail: string
  orgPhone: string
  organisationType: string
  sector: string
  localAuthority: string
  ofstedRating: string
  ofstedLastInspection: Date | null
  headFirstName: string
  headSurname: string
  headEmailAddress: string
  settingName: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  country: string
  postcode: string
  workEmail?: string
}
export const defaultValues = {
  name: '',
  orgEmail: '',
  orgPhone: '',
  organisationType: '',
  sector: '',
  localAuthority: '',
  ofstedRating: '',
  ofstedLastInspection: null,
  headFirstName: '',
  headSurname: '',
  headEmailAddress: '',
  settingName: '',
  website: '',
  workEmail: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  country: '',
  postcode: '',
}

export const getFormSchema = (t: TFunction, _t: TFunction) =>
  yup.object({
    name: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-name'),
      })
    ),
    sector: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-sector'),
      })
    ),
    organisationType: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-type'),
      })
    ),
    orgPhone: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-phone'),
      })
    ),
    orgEmail: yup
      .string()
      .required(
        _t('validation-errors.required-field', {
          name: t('fields.organization-email'),
        })
      )
      .email(_t('validation-errors.email-invalid')),
    website: yup.string(),
    workEmail: yup.string().email(_t('validation-errors.email-invalid')),
    localAuthority: yup.string(),
    ofstedRating: yup.string(),
    ofstedLastInspection: yup.date().nullable(),
    addressLine1: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.addresses.line1'),
      })
    ),
    addressLine2: yup.string(),
    city: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.addresses.city'),
      })
    ),
    country: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.addressess.country'),
      })
    ),
    postcode: yup
      .string()
      .required(
        _t('validation-errors.required-field', {
          name: t('fields.addresses.postcode'),
        })
      )
      .test(
        'is-uk-postcode',
        _t('validation-errors.invalid-postcode'),
        isValidUKPostalCode
      ),
  })
