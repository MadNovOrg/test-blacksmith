// TODO RMX | https://behaviourhub.atlassian.net/browse/TTHP-2215

import { Accreditors_Enum } from '@app/generated/graphql'
import {
  CourseLevel,
  CourseTrainerType,
  CourseType,
  RoleName,
} from '@app/types'
import { REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL } from '@app/util'

import { buildCourse, buildProfile } from '@test/mock-data-utils'

import { getACL, injectACL } from './permissions'
import { AuthContextType } from './types'

describe(getACL.name, () => {
  const getACLStub = (
    auth: Pick<
      AuthContextType,
      | 'profile'
      | 'activeRole'
      | 'isOrgAdmin'
      | 'managedOrgIds'
      | 'allowedRoles'
      | 'activeCertificates'
    >
  ) => {
    const defaults = {
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      getJWT: vi.fn(),
      changeRole: vi.fn(),
      loadProfile: vi.fn(),
      reloadCurrentProfile: vi.fn(),
    }
    return getACL({
      ...auth,
      ...defaults,
    })
  }

  describe('isTTAdmin()', () => {
    it(`should return true when the activeRole is ${RoleName.TT_ADMIN}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TT_ADMIN,
      })

      // Act & Assert
      expect(acl.isTTAdmin()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isTTAdmin()).toBeFalsy()
    })
  })

  describe('isTTOps()', () => {
    it(`should return true when the activeRole is ${RoleName.TT_OPS}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TT_OPS,
      })

      // Act & Assert
      expect(acl.isTTOps()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isTTOps()).toBeFalsy()
    })
  })

  describe('isSalesAdmin()', () => {
    it(`should return true when the activeRole is ${RoleName.SALES_ADMIN}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.SALES_ADMIN,
      })

      // Act & Assert
      expect(acl.isSalesAdmin()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isSalesAdmin()).toBeFalsy()
    })
  })

  describe('isSalesRepresentative()', () => {
    it(`should return true when the activeRole is ${RoleName.SALES_REPRESENTATIVE}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.SALES_REPRESENTATIVE,
      })

      // Act & Assert
      expect(acl.isSalesRepresentative()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isSalesRepresentative()).toBeFalsy()
    })
  })

  describe('isFinance()', () => {
    it(`should return true when the activeRole is ${RoleName.FINANCE}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.FINANCE,
      })

      // Act & Assert
      expect(acl.isFinance()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isFinance()).toBeFalsy()
    })
  })

  describe('isTrainer()', () => {
    it(`should return true when the activeRole is ${RoleName.TRAINER}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
      })

      // Act & Assert
      expect(acl.isTrainer()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isTrainer()).toBeFalsy()
    })
  })

  describe('isUser()', () => {
    it(`should return true when the activeRole is ${RoleName.USER}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isUser()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
      })

      // Act & Assert
      expect(acl.isUser()).toBeFalsy()
    })
  })

  describe('isLD()', () => {
    it(`should return true when the activeRole is ${RoleName.LD}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.LD,
      })

      // Act & Assert
      expect(acl.isLD()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isLD()).toBeFalsy()
    })
  })

  describe('isAdmin()', () => {
    it.each([[RoleName.TT_OPS], [RoleName.TT_ADMIN], [RoleName.LD]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.isAdmin()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isAdmin()).toBeFalsy()
    })
  })

  describe('isOrgAdmin()', () => {
    it(`should return true when the isOrgAdmin is true and managedOrgIds includes the one from args`, () => {
      // Arrange
      const managedOrgId = '123'
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgId],
      })

      // Act & Assert
      expect(acl.isOrgAdmin(managedOrgId)).toBeTruthy()
    })

    it(`should return false when the isOrgAdmin is false`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: false,
      })

      // Act & Assert
      expect(acl.isOrgAdmin()).toBeFalsy()
    })
  })

  describe('isBookingContact()', () => {
    it(`should return true when the allowedRoles contains ${RoleName.BOOKING_CONTACT}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.BOOKING_CONTACT]),
      })

      // Act & Assert
      expect(acl.isBookingContact()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        allowedRoles: new Set(),
      })

      // Act & Assert
      expect(acl.isBookingContact()).toBeFalsy()
    })
  })

  describe('isInternalUser()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.isInternalUser()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.isInternalUser()).toBeFalsy()
    })
  })

  describe('canViewRevokedCert()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewRevokedCert()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewRevokedCert()).toBeFalsy()
    })
  })

  describe('canSeeActionableCourseTable()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.LD]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canSeeActionableCourseTable()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canSeeActionableCourseTable()).toBeFalsy()
    })
  })

  describe('canApproveCourseExceptions()', () => {
    it.each([[RoleName.TT_ADMIN, RoleName.LD]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canApproveCourseExceptions()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canApproveCourseExceptions()).toBeFalsy()
    })
  })

  describe('canViewAdmin()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
      [RoleName.LD],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewAdmin()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewAdmin()).toBeFalsy()
    })
  })

  describe('canViewAdminDiscount()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewAdminDiscount()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewAdminDiscount()).toBeFalsy()
    })
  })

  describe('canViewAdminPricing()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.FINANCE]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canViewAdminPricing()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewAdminPricing()).toBeFalsy()
    })
  })

  describe('canApproveDiscount()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.FINANCE]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canApproveDiscount()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canApproveDiscount()).toBeFalsy()
    })
  })

  describe('canViewAdminCancellationsTransfersReplacements()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.FINANCE],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewAdminCancellationsTransfersReplacements()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewAdminCancellationsTransfersReplacements()).toBeFalsy()
    })
  })

  describe('canViewContacts()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.TRAINER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewContacts()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewContacts()).toBeFalsy()
    })
  })

  describe('canViewCertifications()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewCertifications()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewCertifications()).toBeFalsy()
    })
  })

  describe('canViewOrders()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewOrders()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewOrders()).toBeFalsy()
    })
  })

  describe('canViewOrders()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewOrders()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewOrders()).toBeFalsy()
    })
  })

  describe('canViewCourseOrder()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
      [RoleName.TRAINER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewCourseOrder()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canViewCourseOrder()).toBeTruthy()
    })

    it(`should return true when the the user is a ${RoleName.BOOKING_CONTACT}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        allowedRoles: new Set([RoleName.BOOKING_CONTACT]),
      })

      // Act & Assert
      expect(acl.canViewCourseOrder()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin or a booking contact`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewCourseOrder()).toBeFalsy()
    })
  })

  describe('canViewProfiles()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
      [RoleName.TRAINER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewProfiles()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canViewProfiles()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewProfiles()).toBeFalsy()
    })
  })

  describe('canEditProfiles()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canEditProfiles()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is just a user`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canEditProfiles()).toBeFalsy()
    })
  })

  describe('canViewEmailContacts()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
      [RoleName.USER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewEmailContacts(CourseType.INDIRECT)).toBeTruthy()
    })

    it(`should return true when the courseType is ${CourseType.INDIRECT}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
      })

      // Act & Assert
      expect(acl.canViewEmailContacts(CourseType.INDIRECT)).toBeTruthy()
    })

    it.each([[CourseType.OPEN], [CourseType.CLOSED]])(
      `should return false when the courseType is %s`,
      courseType => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.TRAINER,
        })

        // Act & Assert
        expect(acl.canViewEmailContacts(courseType)).toBeFalsy()
      }
    )
  })

  describe('canInviteAttendees()', () => {
    describe(`when courseType is ${CourseType.OPEN}`, () => {
      it.each([
        [RoleName.TT_ADMIN],
        [RoleName.TT_OPS],
        [RoleName.SALES_REPRESENTATIVE],
        [RoleName.SALES_ADMIN],
      ])(`should return true when activeRole is %s`, activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.OPEN)).toBeTruthy()
      })

      it(`should return true when the the user is an org admin`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.USER,
          isOrgAdmin: true,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.OPEN)).toBeTruthy()
      })

      it(`should return false when the activeRole is just a user and not an org admin`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.USER,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.OPEN)).toBeFalsy()
      })
    })

    describe(`when courseType is ${CourseType.CLOSED}`, () => {
      it.each([
        [RoleName.TT_ADMIN],
        [RoleName.TT_OPS],
        [RoleName.SALES_REPRESENTATIVE],
        [RoleName.SALES_ADMIN],
      ])(`should return true when activeRole is %s`, activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.CLOSED)).toBeTruthy()
      })

      it(`should return true when the the user is an org admin`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.USER,
          isOrgAdmin: true,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.CLOSED)).toBeTruthy()
      })

      it(`should return false when the activeRole is just a user and not an org admin`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.USER,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.CLOSED)).toBeFalsy()
      })
    })

    describe(`when courseType is ${CourseType.INDIRECT}`, () => {
      it.each([
        [RoleName.TT_ADMIN],
        [RoleName.TT_OPS],
        [RoleName.SALES_ADMIN],
        [RoleName.TRAINER],
      ])(`should return true when activeRole is %s`, activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.INDIRECT)).toBeTruthy()
      })

      it(`should return true when the the user is an org admin`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.USER,
          isOrgAdmin: true,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.INDIRECT)).toBeTruthy()
      })

      it(`should return false when the activeRole is just a user and not an org admin`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.USER,
        })

        // Act & Assert
        expect(acl.canInviteAttendees(CourseType.INDIRECT)).toBeFalsy()
      })
    })
  })

  describe('canViewUsers()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewUsers()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewUsers()).toBeFalsy()
    })
  })

  describe('canViewAllOrganizations()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewAllOrganizations()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewAllOrganizations()).toBeFalsy()
    })
  })

  describe('canInviteToOrganizations()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canInviteToOrganizations()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canInviteToOrganizations()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canInviteToOrganizations()).toBeFalsy()
    })
  })

  describe('canViewOrganizations()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewOrganizations()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canViewOrganizations()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewOrganizations()).toBeFalsy()
    })
  })

  describe('canEditOrAddOrganizations()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canEditOrAddOrganizations()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canEditOrAddOrganizations()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canEditOrAddOrganizations()).toBeFalsy()
    })
  })

  describe('canSetOrgAdminRole()', () => {
    it.each([
      [RoleName.TT_OPS],
      [RoleName.TT_ADMIN],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canSetOrgAdminRole()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canSetOrgAdminRole()).toBeFalsy()
    })
  })

  describe('canCreateCourses()', () => {
    it.each([
      [RoleName.TT_OPS],
      [RoleName.TT_ADMIN],
      [RoleName.SALES_ADMIN],
      [RoleName.TRAINER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canCreateCourses()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canCreateCourses()).toBeFalsy()
    })
  })

  describe('canCreateCourse()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should always return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canCreateCourse(CourseType.CLOSED)).toBeTruthy()
      }
    )

    it.each([[CourseType.CLOSED], [CourseType.OPEN]])(
      `should return true when activeRole is ${RoleName.SALES_ADMIN} and the courseType is %s`,
      courseType => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.SALES_ADMIN,
        })

        // Act & Assert
        expect(acl.canCreateCourse(courseType)).toBeTruthy()
      }
    )

    it(`should return true when the activeRole is ${RoleName.TRAINER} and the course type is ${CourseType.INDIRECT}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
        activeCertificates: [CourseLevel.IntermediateTrainer],
      })

      // Act & Assert
      expect(acl.canCreateCourse(CourseType.INDIRECT)).toBeTruthy()
    })

    it.each([
      [RoleName.LD],
      [RoleName.FINANCE],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.USER],
    ])(`should return false when the role is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canCreateCourse(CourseType.CLOSED)).toBeFalsy()
    })
  })

  describe('canEditCourses()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should always return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canEditCourses(CourseType.CLOSED, false)).toBeTruthy()
      }
    )

    it.each([[CourseType.CLOSED], [CourseType.OPEN]])(
      `should return true when activeRole is ${RoleName.SALES_ADMIN} and the courseType is %s`,
      courseType => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.SALES_ADMIN,
        })

        // Act & Assert
        expect(acl.canEditCourses(courseType, false)).toBeTruthy()
      }
    )

    it(`should return true when the activeRole is ${RoleName.TRAINER}, course type is ${CourseType.INDIRECT} and active user is leader on a course`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
      })

      // Act & Assert
      expect(acl.canEditCourses(CourseType.INDIRECT, true)).toBeTruthy()
    })

    it.each([
      [RoleName.LD],
      [RoleName.FINANCE],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.USER],
    ])(`should return false when the role is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canCreateCourse(CourseType.CLOSED)).toBeFalsy()
    })
  })

  describe('canAssignLeadTrainer()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canAssignLeadTrainer()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canAssignLeadTrainer()).toBeFalsy()
    })
  })

  describe('canAssignLeadTrainer()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canAssignLeadTrainer()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canAssignLeadTrainer()).toBeFalsy()
    })
  })

  describe('canRevokeCert()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canRevokeCert()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canRevokeCert()).toBeFalsy()
    })
  })

  describe('canHoldCert()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canHoldCert()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canHoldCert()).toBeFalsy()
    })
  })

  describe('canOverrideGrades()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canOverrideGrades()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canOverrideGrades()).toBeFalsy()
    })
  })

  describe('canViewXeroConnect()', () => {
    it.each([[RoleName.TT_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canViewXeroConnect()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewXeroConnect()).toBeFalsy()
    })
  })

  describe('canViewArloConnect()', () => {
    it.each([[RoleName.TT_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canViewArloConnect()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewArloConnect()).toBeFalsy()
    })
  })

  describe('canCreateOrgs()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canCreateOrgs()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canCreateOrgs()).toBeFalsy()
    })
  })

  describe('canEditOrgUser()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canEditOrgUser()).toBeTruthy()
      }
    )

    it(`should return true when the user is org admin for an organization`, () => {
      // Arrange
      const managedOrgId = '123'
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgId],
      })

      // Act & Assert
      expect(acl.canEditOrgUser([managedOrgId])).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canEditOrgUser()).toBeFalsy()
    })
  })

  describe('canEditOrgs()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canEditOrgs()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canEditOrgs()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canEditOrgs()).toBeFalsy()
    })
  })

  describe('canCancelCourses()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canCancelCourses()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canCancelCourses()).toBeFalsy()
    })
  })

  describe('canManageOrgCourses()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canManageOrgCourses()).toBeTruthy()
    })

    it(`should return true when the the user is an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
      })

      // Act & Assert
      expect(acl.canManageOrgCourses()).toBeTruthy()
    })

    it(`should return false when the activeRole is just a user and not an org admin`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canManageOrgCourses()).toBeFalsy()
    })
  })

  describe('canSeeWaitingLists()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canSeeWaitingLists()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canSeeWaitingLists()).toBeFalsy()
    })
  })

  describe('canRescheduleWithoutWarning()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canRescheduleWithoutWarning()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canRescheduleWithoutWarning()).toBeFalsy()
    })
  })

  describe('canEditWithoutRestrictions()', () => {
    it('should return false when there is no active role', () => {
      // Arrange
      const acl = getACLStub({
        activeRole: undefined,
      })

      // Act & Assert
      expect(acl.canEditWithoutRestrictions(CourseType.INDIRECT)).toBeFalsy()
    })

    it(`should return true when the activeRole is ${RoleName.TT_ADMIN}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: undefined,
      })

      // Act & Assert
      expect(acl.canEditWithoutRestrictions(CourseType.INDIRECT)).toBeFalsy()
    })

    it(`should return false when courseType is ${CourseType.INDIRECT}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: undefined,
      })

      // Act & Assert
      expect(acl.canEditWithoutRestrictions(CourseType.INDIRECT)).toBeFalsy()
    })

    it(`should return true when courseType is ${CourseType.CLOSED} and the active role is ${RoleName.TT_OPS}`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.TT_OPS,
      })

      // Act & Assert
      expect(acl.canEditWithoutRestrictions(CourseType.INDIRECT)).toBeFalsy()
    })

    it.each([[RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when the courseType is ${CourseType.OPEN} and the activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canEditWithoutRestrictions(CourseType.OPEN)).toBeTruthy()
      }
    )
  })

  describe('canViewResources()', () => {
    it.each([[RoleName.USER], [RoleName.TRAINER]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
          activeCertificates: [CourseLevel.Level_1],
        })

        // Act & Assert
        expect(acl.canViewResources()).toBeTruthy()
      }
    )

    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canViewResources()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewResources()).toBeFalsy()
    })
  })

  describe('canViewCourseHistory()', () => {
    it.each([[RoleName.TT_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canViewCourseHistory()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewCourseHistory()).toBeFalsy()
    })
  })

  describe('isOrgAdminOf()', () => {
    it('should return true when the user is an org admin that can manage participants', () => {
      // Arrange
      const managedOrgId = '123'
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgId],
      })

      // Act & Assert
      expect(acl.isOrgAdminOf([managedOrgId])).toBeTruthy()
    })
  })

  describe('canParticipateInCourses()', () => {
    it.each([[RoleName.USER], [RoleName.TRAINER]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canParticipateInCourses()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.UNVERIFIED,
      })

      // Act & Assert
      expect(acl.canParticipateInCourses()).toBeFalsy()
    })
  })

  describe('canTransferParticipant()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canTransferParticipant([])).toBeTruthy()
      }
    )

    it(`should return true when user is org admin for an organization`, () => {
      // Arrange
      const managedOrgIds = '123'
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgIds],
      })

      // Act & Assert
      expect(acl.canTransferParticipant([managedOrgIds])).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canTransferParticipant([])).toBeFalsy()
    })
  })

  describe('canReplaceParticipant()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canReplaceParticipant([], Accreditors_Enum.Bild)).toBeTruthy()
    })

    it(`should return true when the org admin is accredited by ${Accreditors_Enum.Icm}`, () => {
      // Arrange
      const managedOrgIds = '123'
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgIds],
      })

      // Act & Assert
      expect(
        acl.canReplaceParticipant([managedOrgIds], Accreditors_Enum.Icm)
      ).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canReplaceParticipant([], Accreditors_Enum.Bild)).toBeFalsy()
    })
  })

  describe('canRemoveParticipant()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canRemoveParticipant([])).toBeTruthy()
      }
    )

    it(`should return true when user is org admin for an organization`, () => {
      // Arrange
      const managedOrgIds = '123'
      const acl = getACLStub({
        activeRole: RoleName.USER,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgIds],
      })

      // Act & Assert
      expect(acl.canRemoveParticipant([managedOrgIds])).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canRemoveParticipant([])).toBeFalsy()
    })
  })

  describe('canSendCourseInformation()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.TRAINER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
      })

      // Act & Assert
      expect(acl.canSendCourseInformation()).toBeTruthy()
    })

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canSendCourseInformation()).toBeFalsy()
    })
  })

  describe('canManageParticipantAttendance()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.SALES_ADMIN],
      [RoleName.TRAINER],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const managedOrgIds = '123'
      const acl = getACLStub({
        activeRole: activeRole,
        isOrgAdmin: true,
        managedOrgIds: [managedOrgIds],
      })

      // Act & Assert
      expect(
        acl.canManageParticipantAttendance(
          [managedOrgIds],
          Accreditors_Enum.Icm
        )
      ).toBeTruthy()
    })
  })

  describe('canOnlySendCourseInformation()', () => {
    it.each([[RoleName.TRAINER]])(
      `should return true when activeRole is %s and the visited org id does not match the managed one`,
      activeRole => {
        // Arrange
        const managedOrgId = '123'
        const visitedOrgId = '456'
        const acl = getACLStub({
          activeRole: activeRole,
          isOrgAdmin: true,
          managedOrgIds: [managedOrgId],
        })

        // Act & Assert
        expect(
          acl.canOnlySendCourseInformation([visitedOrgId], Accreditors_Enum.Icm)
        ).toBeTruthy()
      }
    )
  })

  describe('canGradeParticipants()', () => {
    it('should return true when trainer is not moderator and the profiles matches', () => {
      // Arrange
      const profileId = '123'
      const trainerType = CourseTrainerType.Leader
      const acl = getACLStub({
        profile: buildProfile({
          overrides: {
            id: profileId,
          },
        }),
        activeRole: RoleName.TRAINER,
      })

      // Act & Assert
      expect(
        acl.canGradeParticipants([
          {
            profile: { id: profileId },
            type: trainerType,
          },
        ])
      ).toBeTruthy()
    })

    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange

        const acl = getACLStub({
          activeRole: activeRole,
        })

        // Act & Assert
        expect(acl.canGradeParticipants([])).toBeTruthy()
      }
    )
  })

  describe('canBuildCourse()', () => {
    it.each([[RoleName.TRAINER]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole: activeRole,
        })

        // Act & Assert
        expect(acl.canBuildCourse()).toBeTruthy()
      }
    )
  })

  describe('canManageBlendedLicenses()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.FINANCE],
      [RoleName.SALES_ADMIN],
      [RoleName.TT_OPS],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole: activeRole,
      })

      // Act & Assert
      expect(acl.canManageBlendedLicenses()).toBeTruthy()
    })
  })

  describe('canSeeProfileRoles()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole: activeRole,
      })

      // Act & Assert
      expect(acl.canSeeProfileRoles()).toBeTruthy()
    })
  })

  describe('canMergeProfiles()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.SALES_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole: activeRole,
        })

        // Act & Assert
        expect(acl.canMergeProfiles()).toBeTruthy()
      }
    )
  })

  describe('canArchiveProfile()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole: activeRole,
        })

        // Act & Assert
        expect(acl.canArchiveProfile()).toBeTruthy()
      }
    )
  })

  describe('canViewArchivedProfileData()', () => {
    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
    ])(`should return true when activeRole is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole: activeRole,
      })

      // Act & Assert
      expect(acl.canViewArchivedProfileData()).toBeTruthy()
    })
  })

  describe('canManageCert()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole: activeRole,
        })

        // Act & Assert
        expect(acl.canManageCert()).toBeTruthy()
      }
    )
  })

  describe('canCreateBildCourse()', () => {
    it('should return false when there is no active role', () => {
      // Arrange
      const acl = getACLStub({
        activeRole: undefined,
      })

      // Act & Assert
      expect(acl.canCreateBildCourse(CourseType.CLOSED)).toBeFalsy()
    })

    describe(`when the courseType is ${CourseType.INDIRECT}`, () => {
      it(`should return true when the ${RoleName.TRAINER}
         has ${CourseLevel.BildIntermediateTrainer} or ${CourseLevel.BildAdvancedTrainer} certificates`, () => {
        // Arrange
        const acl = getACLStub({
          activeRole: RoleName.TRAINER,
          activeCertificates: [
            CourseLevel.BildIntermediateTrainer,
            CourseLevel.BildAdvancedTrainer,
          ],
        })

        // Act & Assert
        expect(acl.canCreateBildCourse(CourseType.CLOSED)).toBeTruthy()
      })

      it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS]])(
        `should return true when activeRole is %s`,
        activeRole => {
          // Arrange
          const acl = getACLStub({
            activeRole: activeRole,
          })

          // Act & Assert
          expect(acl.canCreateBildCourse(CourseType.CLOSED)).toBeTruthy()
        }
      )
    })

    describe.each([[CourseType.OPEN], [CourseType.CLOSED]])(
      `when the courseType is %s`,
      () => {
        it.each([
          [RoleName.TT_ADMIN],
          [RoleName.TT_OPS],
          [RoleName.SALES_ADMIN],
          /**
           * TODO: Patch this bug.
           * @see https://behaviourhub.atlassian.net/browse/TTHP-761
           */
          [RoleName.FINANCE],
          [RoleName.SALES_REPRESENTATIVE],
          [RoleName.LD],
        ])(`should return true when the role is %s`, activeRole => {
          // Arrange
          const acl = getACLStub({
            activeRole: activeRole,
            activeCertificates: [
              CourseLevel.BildIntermediateTrainer,
              CourseLevel.BildAdvancedTrainer,
            ],
          })

          // Act & Assert
          expect(acl.canCreateBildCourse(CourseType.CLOSED)).toBeTruthy()
        })
      }
    )
  })

  describe('canDeliveryTertiaryAdvancedStrategy()', () => {
    it(`should return true for a ${RoleName.TRAINER} role with ${CourseLevel.BildAdvancedTrainer} active certificate`, () => {
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
        activeCertificates: [CourseLevel.BildAdvancedTrainer],
      })

      // Act & Assert
      expect(acl.canDeliveryTertiaryAdvancedStrategy()).toBeTruthy()
    })

    it(`should return false for a ${RoleName.TRAINER} role with no active certificates`, () => {
      const acl = getACLStub({
        activeRole: RoleName.TRAINER,
        activeCertificates: [],
      })

      // Act & Assert
      expect(acl.canDeliveryTertiaryAdvancedStrategy()).toBeFalsy()
    })

    it.each([
      [RoleName.TT_ADMIN],
      [RoleName.TT_OPS],
      [RoleName.LD],
      [RoleName.SALES_ADMIN],
      [RoleName.SALES_REPRESENTATIVE],
      [RoleName.FINANCE],
    ])(`should always return true when the role is %s`, activeRole => {
      // Arrange
      const acl = getACLStub({
        activeRole,
        activeCertificates: [],
      })

      // Act & Assert
      expect(acl.canDeliveryTertiaryAdvancedStrategy()).toBeTruthy()
    })
  })

  describe('canDisableDiscounts()', () => {
    it.each([[RoleName.TT_ADMIN], [RoleName.TT_OPS], [RoleName.FINANCE]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canDisableDiscounts()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canDisableDiscounts()).toBeFalsy()
    })
  })

  describe('canViewCourseBuilderOnEditPage', () => {
    it.each([
      RoleName.TRAINER,
      RoleName.TT_OPS,
      RoleName.LD,
      RoleName.TT_ADMIN,
    ])('should return true if activerole is %s', activeRole => {
      // Arrange
      const acl = getACLStub({ activeRole })
      const course = buildCourse({
        overrides: {
          accreditedBy: Accreditors_Enum.Icm,
          type: CourseType.CLOSED,
        },
      })

      // Act & Assert
      expect(acl.canViewCourseBuilderOnEditPage(course))
    })
    it('should return false if course is not icm', () => {
      // Arrange
      const acl = getACLStub({ activeRole: RoleName.TRAINER })
      const course = buildCourse({
        overrides: {
          accreditedBy: Accreditors_Enum.Bild,
          type: CourseType.CLOSED,
        },
      })

      // Act & Assert
      expect(acl.canViewCourseBuilderOnEditPage(course)).toBeFalsy()
    })
    it('should return false if course is not closed or indirect', () => {
      // Arrange
      const acl = getACLStub({ activeRole: RoleName.TRAINER })
      const course = buildCourse({
        overrides: {
          accreditedBy: Accreditors_Enum.Icm,
          type: CourseType.OPEN,
        },
      })

      // Act & Assert
      expect(acl.canViewCourseBuilderOnEditPage(course)).toBeFalsy()
    })
  })

  describe('canViewArchivedUsersCertificates()', () => {
    it.each([[RoleName.TT_ADMIN]])(
      `should return true when activeRole is %s`,
      activeRole => {
        // Arrange
        const acl = getACLStub({
          activeRole,
        })

        // Act & Assert
        expect(acl.canViewArchivedUsersCertificates()).toBeTruthy()
      }
    )

    it(`should return false when the activeRole is any other`, () => {
      // Arrange
      const acl = getACLStub({
        activeRole: RoleName.USER,
      })

      // Act & Assert
      expect(acl.canViewArchivedUsersCertificates()).toBeFalsy()
    })
  })
  describe('allowedCourseLevels', () => {
    const allLevels = Object.values(CourseLevel)

    it('should return an empty array when there is no active role', () => {
      const acl = getACLStub({
        activeRole: undefined,
      })

      expect(acl.allowedCourseLevels(allLevels)).toEqual([])
    })

    it.each([RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN])(
      'should allow any course level when the activeRole is %s',
      activeRole => {
        const acl = getACLStub({
          activeRole,
        })

        expect(acl.allowedCourseLevels(allLevels)).toEqual(allLevels)
      }
    )

    it.each(Object.values(CourseLevel))(
      'should allow only specific levels when trainer holds %s certificate',
      activeCertificate => {
        const acl = getACLStub({
          activeRole: RoleName.TRAINER,
          activeCertificates: [activeCertificate],
        })
        const expected = Object.keys(
          REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL
        ).filter(courseLevel =>
          REQUIRED_TRAINER_CERTIFICATE_FOR_COURSE_LEVEL[
            courseLevel as CourseLevel
          ].includes(activeCertificate)
        )

        expect(acl.allowedCourseLevels(allLevels)).toEqual(expected)
      }
    )
  })
})

/**
 * TODO @RMX | Fill separetely
 */
describe(injectACL.name, () => {
  it('should do something', () => {
    expect(true).toBeTruthy()
  })
})
