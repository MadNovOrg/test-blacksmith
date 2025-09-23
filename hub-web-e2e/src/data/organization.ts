import { Organization, Organization_Insert_Input } from '@app/generated/graphql'

import { isUK } from '@qa/constants'
export const ORGANIZATION_INSERT: (
  name?: string,
  country?: string,
  countryCode?: string,
  main_organisation_id?: string | null,
) => Organization_Insert_Input = (
  name,
  country,
  countryCode,
  main_organisation_id,
) => ({
  name: name || 'Random Org',
  address: {
    line1: 'Tankfield',
    line2: 'Convent Hill',
    city: 'Tramore',
    state: 'Waterford',
    postCode: 'X91 PV08',
    country: country || isUK() ? 'England' : 'Australia',
    countryCode: countryCode || isUK() ? 'UK' : 'AU',
    region: isUK() ? '' : 'Victoria',
  },
  attributes: {
    email: isUK()
      ? 'ukorg@teamteach.testinator.com'
      : 'anzorg@teamteach.testinator.com',
    phone: isUK() ? '+44 55 5555 5555' : '+61 0491 555 555',
    website: '',
    headSurname: '',
    settingName: '',
    headFirstName: '',
    headEmailAddress: '',
  },
  sector: isUK() ? 'edu' : 'anz_edu',
  organisationType: isUK() ? 'Academy' : 'State Education',
  main_organisation_id: main_organisation_id || null,
})

export const UNIQUE_ORGANIZATION: (
  name?: string,
  country?: string,
  countryCode?: string,
) => Organization = (name, country, countryCode) => ({
  id: 0,
  name: name || 'Random Org',
  address: {
    line1: 'Tankfield',
    line2: 'Convent Hill',
    city: 'Tramore',
    state: 'Waterford',
    postCode: 'WC2N 4JL',
    country: country || isUK() ? 'England' : 'Australia',
    countryCode: countryCode || isUK() ? 'UK' : 'AU',
    region: isUK() ? '' : 'Victoria',
  },
  go1Licenses: 10,
  affiliated_organisations: [],
  affiliated_organisations_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  attributes: {
    email: isUK()
      ? 'ukorg@teamteach.testinator.com'
      : 'anzorg@teamteach.testinator.com',
    phone: isUK() ? '+44 55 5555 5555' : '+61 0491 555 555',
    website: '',
    headSurname: '',
    settingName: '',
    headFirstName: '',
    headEmailAddress: '',
  },
  contactDetails: undefined,
  createdAt: undefined,
  go1LicensesHistory: [],
  go1LicensesHistory_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  invites: [],
  invites_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  members: [],
  members_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  organization_courses: [],
  organization_courses_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  organization_go1_licenses: [],
  organization_go1_licenses_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  organization_orders: [],
  organization_orders_aggregate: {
    __typename: undefined,
    aggregate: undefined,
    nodes: [],
  },
  preferences: undefined,
  sector: isUK() ? 'edu' : 'anz_edu',
  organisationType: isUK() ? 'Academy' : 'State Education',
  updatedAt: undefined,
})
