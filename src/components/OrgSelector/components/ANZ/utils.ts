import { TFunction } from 'i18next'
import isEmail from 'validator/lib/isEmail'
import * as yup from 'yup'

export const getSchema = ({ t }: { t: TFunction }) => {
  return yup.object({
    //Org Address
    country: yup.string().required(
      t('validation-errors.required-field', {
        name: t('components.add-organisation.fields.country'),
      }),
    ),
    region: yup.string().when('countryCode', (data: string[], schema) => {
      const countryCode = data[0]
      if (countryCode === 'AU') {
        return schema.required(
          t('validation-errors.required-composed-field', {
            field1: t('components.add-organisation.fields.state'),
            field2: t('components.add-organisation.fields.territory'),
          }),
        )
      }
      if (countryCode === 'NZ') {
        return schema.required(
          t('validation-errors.required-field', {
            name: t('components.add-organisation.fields.region'),
          }),
        )
      }
      return schema.nullable()
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
    postCode: yup.string(),
    //Org Details
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
  })
}

export const getDefaultValues = ({
  orgName,
  getCountryLabel,
  countryCode,
}: {
  orgName: string
  getCountryLabel: (code: string) => string | undefined
  countryCode: string
}) => {
  return {
    organisationName: orgName,
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

export type FormInputs = {
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
  region: string
  organisationPhoneNumber?: string
  countryCallingCode?: string
}

export const australiaRegions = [
  'Australian Capital Territory',
  'New South Wales',
  'Northern Territory',
  'Tasmania',
  'Queensland',
  'South Australia',
  'Victoria',
  'Western Australia',
]

export const newZealandRegions = [
  'Northland',
  'Auckland',
  'Waikato',
  'Bay of Plenty',
  'Gisborne',
  "Hawke's Bay",
  'Taranaki',
  'Manawatu-Wanganui',
  'Wellington',
  'Tasman',
  'Nelson',
  'Marlborough',
  'West Coast',
  'Canterbury',
  'Otago',
  'Southland',
  'Chatham Islands County',
]
