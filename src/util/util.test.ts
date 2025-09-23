import {
  Certificate_Status_Enum,
  Course_Level_Enum,
} from '@app/generated/graphql'

import { chance } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { getBookingContact, getCertificatesChain, getOrgKeyContact } from '.'

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

describe('getCertificatesChain', () => {
  it('filters out revoked and inactive', () => {
    const input = [
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Revoked,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Inactive,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ]
    const output = getCertificatesChain(input)
    expect(output).toEqual([
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('deduplicates by level and keeps best status', () => {
    const input = [
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Expired,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.OnHold,
      },
    ]
    const output = getCertificatesChain(input)

    expect(output).toEqual([
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.OnHold,
      },
    ])
  })

  it('includes Advanced certs if no active BildAdvancedTrainer or AdvancedTrainer', () => {
    const input = [
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.BildAdvancedTrainer,
        status: Certificate_Status_Enum.Expired,
      },
      {
        level: Course_Level_Enum.AdvancedTrainer,
        status: Certificate_Status_Enum.Expired,
      },
    ]
    const output = getCertificatesChain(input)
    expect(output).toEqual([
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('does NOT include Advanced if active AdvancedTrainer or BildAdvancedTrainer exists', () => {
    const input = [
      {
        level: Course_Level_Enum.BildAdvancedTrainer,
        status: Certificate_Status_Enum.Expired,
      },
      {
        level: Course_Level_Enum.AdvancedTrainer,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ]
    const output = getCertificatesChain(input)
    expect(output).toEqual([
      {
        level: Course_Level_Enum.AdvancedTrainer,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('includes Advanced if only ExpiredRecently AdvancedTrainer or BildAdvancedTrainer exists', () => {
    const input = [
      {
        level: Course_Level_Enum.AdvancedTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.BildAdvancedTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ]
    const output = getCertificatesChain(input)

    expect(output).toEqual([
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('chains multiple ExpiredRecently certificates and includes next active-ish cert', () => {
    const input = [
      {
        level: Course_Level_Enum.BildAdvancedTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.AdvancedTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
    ]

    const output = getCertificatesChain(input)

    expect(output).toEqual([
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('chains ExpiredRecently certificates and stops on active', () => {
    const input = [
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.IntermediateTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
    ]
    const output = getCertificatesChain(input)
    expect(output).toEqual([
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('returns empty array if input empty or all revoked/inactive', () => {
    const input = [
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Inactive,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Revoked,
      },
    ]
    const output = getCertificatesChain(input)
    expect(output).toEqual([])
  })

  it('complex scenario: deduplication, expiredRecently chaining, advanced special rule, filtering revoked/inactive', () => {
    const input = [
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },

      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Expired,
      },

      {
        level: Course_Level_Enum.IntermediateTrainer,
        status: Certificate_Status_Enum.Revoked,
      },
      {
        level: Course_Level_Enum.IntermediateTrainer,
        status: Certificate_Status_Enum.OnHold,
      },
      {
        level: Course_Level_Enum.BildAdvancedTrainer,
        status: Certificate_Status_Enum.Revoked,
      },
      {
        level: Course_Level_Enum.AdvancedTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
    ]

    const output = getCertificatesChain(input)

    expect(output).toEqual([
      {
        level: Course_Level_Enum.Advanced,
        status: Certificate_Status_Enum.Active,
      },
      {
        level: Course_Level_Enum.IntermediateTrainer,
        status: Certificate_Status_Enum.OnHold,
      },
    ])
  })

  it('continues searching for active certificates through ExpiredRecently chain until an expired active is encountered', () => {
    const input = [
      {
        level: Course_Level_Enum.IntermediateTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.Expired,
      },
      {
        level: Course_Level_Enum.Level_2,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ]

    const output = getCertificatesChain(input)

    expect(output).toEqual([
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.Active,
      },
    ])
  })

  it('should NOT return higher level ExpiredRecently certificate when chaining', () => {
    const certificates = [
      {
        level: Course_Level_Enum.Level_1,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
      {
        level: Course_Level_Enum.FoundationTrainer,
        status: Certificate_Status_Enum.ExpiredRecently,
      },
    ]

    const result = getCertificatesChain(certificates)

    expect(result).toHaveLength(1)
    expect(result[0].status).toBe(Certificate_Status_Enum.ExpiredRecently)
    expect(result[0].level).toBe(Course_Level_Enum.FoundationTrainer)
  })
})
