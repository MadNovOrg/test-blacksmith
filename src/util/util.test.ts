import { chance } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { getBookingContact, getOrgKeyContact } from '.'

describe('getBookingContact', () => {
  it('returns contact info from bookingContact if present', () => {
    const course = {
      bookingContact: buildProfile({
        overrides: {
          email: chance.email(),
          givenName: chance.first(),
          familyName: chance.last(),
          id: chance.guid(),
          country: chance.country(),
          countryCode: chance.string({ length: 2 }),
        },
      }),
      bookingContactInviteData: undefined,
    }

    expect(getBookingContact(course)).toEqual({
      email: course.bookingContact.email,
      firstName: course.bookingContact.givenName,
      lastName: course.bookingContact.familyName,
      profileId: course.bookingContact.id,
      residingCountry: course.bookingContact.country,
      residingCountryCode: course.bookingContact.countryCode,
    })
  })

  it('returns contact info from bookingContactInviteData if bookingContact is not present', () => {
    const course = {
      bookingContact: undefined,
      bookingContactInviteData: {
        email: chance.email(),
        firstName: chance.first(),
        lastName: chance.last(),
        residingCountry: chance.country(),
        residingCountryCode: chance.string({ length: 2 }),
      },
    }

    expect(getBookingContact(course)).toEqual({
      email: course.bookingContactInviteData.email,
      firstName: course.bookingContactInviteData.firstName,
      lastName: course.bookingContactInviteData.lastName,
      residingCountry: course.bookingContactInviteData.residingCountry,
      residingCountryCode: course.bookingContactInviteData.residingCountryCode,
    })
  })

  it('returns null if neither bookingContact nor bookingContactInviteData is present', () => {
    const course = {
      bookingContact: undefined,
      bookingContactInviteData: undefined,
    }

    expect(getBookingContact(course)).toBeNull()
  })
})

describe('getOrgKeyContact', () => {
  it('returns contact info from organizationKeyContact if present', () => {
    const course = {
      organizationKeyContact: buildProfile({
        overrides: {
          email: chance.email(),
          givenName: chance.first(),
          familyName: chance.last(),
          id: chance.guid(),
          country: chance.country(),
          countryCode: chance.string({ length: 2 }),
        },
      }),
      organizationKeyContactInviteData: undefined,
    }

    expect(getOrgKeyContact(course)).toEqual({
      email: course.organizationKeyContact.email,
      firstName: course.organizationKeyContact.givenName,
      lastName: course.organizationKeyContact.familyName,
      profileId: course.organizationKeyContact.id,
      residingCountry: course.organizationKeyContact.country,
      residingCountryCode: course.organizationKeyContact.countryCode,
    })
  })

  it('returns contact info from organizationKeyContactInviteData if organizationKeyContact is not present', () => {
    const course = {
      organizationKeyContact: undefined,
      organizationKeyContactInviteData: {
        email: chance.email(),
        firstName: chance.first(),
        lastName: chance.last(),
        residingCountry: chance.country(),
        residingCountryCode: chance.string({ length: 2 }),
      },
    }

    expect(getOrgKeyContact(course)).toEqual({
      email: course.organizationKeyContactInviteData.email,
      firstName: course.organizationKeyContactInviteData.firstName,
      lastName: course.organizationKeyContactInviteData.lastName,
      residingCountry: course.organizationKeyContactInviteData.residingCountry,
      residingCountryCode:
        course.organizationKeyContactInviteData.residingCountryCode,
    })
  })

  it('returns null if neither organizationKeyContact nor organizationKeyContactInviteData is present', () => {
    const course = {
      organizationKeyContact: undefined,
      organizationKeyContactInviteData: undefined,
    }

    expect(getOrgKeyContact(course)).toBeNull()
  })
})
