import { ImportOrganisationsConfig } from '@app/generated/graphql'

export const necessaryColumns: ImportOrganisationsConfig = {
  name: 'Organisation name',
  country: 'Residing country',
  state: 'State/Territory',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2',
  city: 'Town/City',
  postcode: 'Post code',
  sector: 'Sector',
  type: 'Organisation type',
  phone: 'Organisation phone',
  email: 'Organisation email',
  website: 'Organisation website',
  mainOrganisation: 'Email of the Main organisation',
  mainContactFirstName: 'Organisation main contact First name',
  mainContactSurname: 'Organisation main contact Surname',
  mainContactEmail: 'Organisation main contact email address',
  mainContactSetting: 'Organisation main contact Setting name',
  organisationAdminEmail: 'Organisation admin Work email',
}

export const transformOrganisationsData = (
  data: Record<string, string>[],
): ImportOrganisationsConfig[] => {
  return data
    .map(entry => {
      const filteredEntry = Object.keys(necessaryColumns).reduce((acc, key) => {
        const columnKey = necessaryColumns[key as keyof typeof necessaryColumns]
        for (const key in entry) {
          const formattedKey = key
            .replace('(optional)', '')
            .replace('( optional )', '')
            .trim()
          entry[formattedKey] = entry[key]
        }
        const columnValue = columnKey ? entry[columnKey] || '' : ''
        acc[key] = columnValue
        return acc
      }, {} as Record<string, string>)
      return filteredEntry
    })
    .filter(entry => {
      return Object.values(entry).join('').trim() !== ''
    })
    .map(entry => {
      const transformedEntry: ImportOrganisationsConfig = {
        name: entry.name || '',
        country: entry.country || '',
        state: entry.state || '',
        addressLine1: entry.addressLine1 || '',
        addressLine2: entry.addressLine2 || '',
        city: entry.city || '',
        postcode: entry.postcode || '',
        sector: entry.sector || '',
        type: entry.type || '',
        phone: entry.phone || '',
        email: entry.email || '',
        website: entry.website || '',
        mainOrganisation: entry.mainOrganisation || '',
        mainContactFirstName: entry.mainContactFirstName || '',
        mainContactSurname: entry.mainContactSurname || '',
        mainContactEmail: entry.mainContactEmail || '',
        mainContactSetting: entry.mainContactSetting || '',
        organisationAdminEmail: entry.organisationAdminEmail || '',
      }
      return transformedEntry
    })
}

export enum CHUNK_RESULT_ERROR {
  'OrganisationExists' = 'ORGANISATION_EXISTS',
  'MissingMandatoryFields' = 'MISSING_MANDATORY_FIELDS',
  'MainOrganisationDoesNotExist' = 'MAIN_ORGANISATION_DOES_NOT_EXIST',
  'InvalidEmail' = 'INVALID_EMAIL',
  'InvalidPhone' = 'INVALID_PHONE',
}
