import { TFunction } from 'i18next'

import { Dfe_Establishment } from '@app/generated/graphql'
import { yup } from '@app/schemas'
import { isValidUKPostalCode } from '@app/util'

export type FormInputs = {
  name: string
  orgEmail: string
  orgPhone: string
  organisationType: string
  orgTypeSpecifyOther?: string
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
  countryCode: string
  postcode: string
  workEmail?: string
  dfeId?: string | null
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
  countryCode: 'GB-ENG',
  postcode: '',
}

export const getFormSchema = (t: TFunction, _t: TFunction, isInUK: boolean) =>
  yup.object({
    name: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-name'),
      }),
    ),
    sector: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-sector'),
      }),
    ),
    organisationType: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.organization-type'),
      }),
    ),
    orgTypeSpecifyOther: yup.string().when('organisationType', {
      is: (value: string) => value && value.toLocaleLowerCase() === 'other',
      then: schema =>
        schema.required(
          _t('validation-errors.required-field', {
            name: t('fields.organisation-specify-other'),
          }),
        ),
    }),

    orgPhone: yup

      .string()
      .required(
        _t('validation-errors.required-field', {
          name: t('fields.organization-phone'),
        }),
      )
      .phoneNumber(_t)
      .isPossiblePhoneNumber(_t),
    orgEmail: yup
      .string()
      .required(
        _t('validation-errors.required-field', {
          name: t('fields.organization-email'),
        }),
      )
      .email(_t('validation-errors.email-invalid')),
    website: yup.string(),
    workEmail: yup.string().email(_t('validation-errors.email-invalid')),
    localAuthority: yup.string(),
    ofstedRating: yup.string().nullable(),
    ofstedLastInspection: yup.date().nullable(),
    addressLine1: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.addresses.line1'),
      }),
    ),
    addressLine2: yup.string(),
    city: yup.string().required(
      _t('validation-errors.required-composed-field', {
        field1: t('fields.addresses.town'),
        field2: t('fields.addresses.city'),
      }),
    ),
    country: yup.string().required(
      _t('validation-errors.required-field', {
        name: t('fields.addresses.country'),
      }),
    ),

    ...(isInUK
      ? {
          postcode: yup
            .string()
            .required(
              _t('validation-errors.required-field', {
                name: t('fields.addresses.postcode'),
              }),
            )
            .test(
              'is-uk-postcode',
              _t('validation-errors.invalid-postcode'),
              isValidUKPostalCode,
            ),
        }
      : {
          postcode: yup.string(),
        }),

    dfeId: yup.string().nullable(),
  })

export type MapDfePropsToSchemaKeys =
  | keyof Pick<
      Dfe_Establishment,
      | 'addressLineOne'
      | 'addressLineTwo'
      | 'headFirstName'
      | 'headJobTitle'
      | 'headLastName'
      | 'localAuthority'
      | 'ofstedLastInspection'
      | 'ofstedRating'
      | 'postcode'
      | 'town'
    >
  | 'headLastName'
  | 'headPreferredJobTitle'

export type MapDfePropsToSchemaValues = keyof Pick<
  typeof defaultValues,
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'headFirstName'
  | 'headSurname'
  | 'localAuthority'
  | 'ofstedLastInspection'
  | 'ofstedRating'
  | 'postcode'
  | 'settingName'
>

export const mapDfePropsToSchema = new Map<
  MapDfePropsToSchemaKeys,
  MapDfePropsToSchemaValues
>([
  ['addressLineOne', 'addressLine1'],
  ['addressLineTwo', 'addressLine2'],
  ['headFirstName', 'headFirstName'],
  ['headJobTitle', 'settingName'],
  ['headLastName', 'headSurname'],
  ['localAuthority', 'localAuthority'],
  ['ofstedLastInspection', 'ofstedLastInspection'],
  ['ofstedRating', 'ofstedRating'],
  ['postcode', 'postcode'],
  ['town', 'city'],
  ['headPreferredJobTitle', 'settingName'],
])
