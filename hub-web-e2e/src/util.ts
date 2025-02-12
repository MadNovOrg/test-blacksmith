import * as fs from 'fs'

import { addDays, addMonths, format } from 'date-fns'

import { AWS_REGION, TARGET_ENV, TEMP_DIR } from './constants'
import {
  CourseTableRow,
  ModuleGroup,
  TransferEligibleCourses,
} from './data/types'

type KeyValue = {
  name: string
  value: string
}

export type StoredCredentialKey =
  | 'admin'
  | 'ops'
  | 'trainer'
  | 'trainerWithOrg'
  | 'user1'
  | 'userOrgAdmin'
  | 'salesAdmin'
  | 'ttOrgAdmin'

export const stateFilePath = (userKey: StoredCredentialKey) =>
  `${TEMP_DIR}/storage-${userKey}-${TARGET_ENV}-${AWS_REGION}.json`

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getAdminIdToken: () => string = () => {
  const data = JSON.parse(
    fs.readFileSync(stateFilePath('admin')).toString() ?? '{}',
  )
  return data.origins[0].localStorage.filter((pair: KeyValue) =>
    pair.name.endsWith('idToken'),
  )[0].value
}

export const sortModulesByName = (a: ModuleGroup, b: ModuleGroup) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

export const sortCoursesByAllFields = (
  a: CourseTableRow,
  b: CourseTableRow,
) => {
  const strA = JSON.stringify(a)
  const strB = JSON.stringify(b)
  return strA.localeCompare(strB)
}

export const toUiTime = (date: Date) => {
  return date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}

export const sectors = {
  edu: 'Education',
  hsc_child: "H & SC Children's",
  hsc_adult: "H & SC Adult's",
  anz_edu: 'Education',
  anz_ss: 'Social Services',
  anz_health: 'Health',
  other: 'Other',
} as const

export const isAustraliaCountry = (countryCode: string) => {
  return countryCode === 'AU'
}

export const isNewZealandCountry = (countryCode: string) => {
  return countryCode === 'NZ'
}

export const isAustraliaOrNewZealandCountry = (countryCode: string) => {
  return isAustraliaCountry(countryCode) || isNewZealandCountry(countryCode)
}

export const getFormattedDate = (daysToAdd: number) => {
  const newDate = addDays(new Date(), daysToAdd)
  return format(newDate, 'ddMMyyyy')
}

export const searchTrainerLead = () => {
  return {
    data: {
      trainers: [
        {
          id: '13a223a8-2184-42f1-ba37-b49e115e59a2',
          fullName: 'John Trainer',
          avatar: null,
          email: 'trainer@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'principal',
                id: '31d9c695-5769-4fe9-8806-8bdd6f9974ab',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'moderator',
                id: '7c935b11-ba5e-4949-9b04-c1be535809ec',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
      ],
    },
  }
}

export const searchModerator = () => {
  return {
    data: {
      trainers: [
        {
          id: 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25',
          fullName: 'Noah Assistant',
          avatar: null,
          email: 'assistant.with.org@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'principal',
                id: '01eceb5f-e745-42ba-99a2-cb4d50bcd3a2',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'moderator',
                id: '558ae8cb-6701-4993-900f-4267c8519ff5',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
      ],
    },
  }
}

export const searchBildTrainerLead = () => {
  return {
    data: {
      trainers: [
        {
          id: '2be41d95-40ee-49d5-810c-fae16135cccc',
          fullName: 'Bild Senior',
          avatar: null,
          email: 'bild.senior@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'BILD_ADVANCED_TRAINER',
              expiryDate: '2025-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'bild-senior',
                id: 'f77ab567-ff9d-4eeb-b17d-487450238c68',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'principal',
                id: '2c40e637-0d02-44a2-94d8-847f9a7fc9b4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
      ],
    },
  }
}

export const searchBildTrainerModerator = () => {
  return {
    data: {
      trainers: [
        {
          id: 'd1c5fa19-30da-4512-88f6-dc9ef6a26958',
          fullName: 'Bild 2 Senior',
          avatar: null,
          email: 'bild.senior2@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'BILD_ADVANCED_TRAINER',
              expiryDate: '2025-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'bild-senior',
                id: 'f77ab567-ff9d-4eeb-b17d-487450238c68',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'senior',
                id: 'fb8d2ffa-d46b-47ff-9587-b68fc9ae85f5',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: '4c6194ad-6dd3-461e-b4da-d3562b1007d1',
          fullName: 'Bild 3 Senior',
          avatar: null,
          email: 'bild.senior3@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'BILD_ADVANCED_TRAINER',
              expiryDate: '2025-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'bild-senior',
                id: 'f77ab567-ff9d-4eeb-b17d-487450238c68',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'trainer-eta',
                id: '2650e4b4-cdee-41da-91ee-ee528ae25033',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: '2be41d95-40ee-49d5-810c-fae16135cccc',
          fullName: 'Bild Senior',
          avatar: null,
          email: 'bild.senior@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'BILD_ADVANCED_TRAINER',
              expiryDate: '2025-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'bild-senior',
                id: 'f77ab567-ff9d-4eeb-b17d-487450238c68',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'principal',
                id: '2c40e637-0d02-44a2-94d8-847f9a7fc9b4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: '62946c00-1da3-44f7-97a6-4b1c8da4f2ef',
          fullName: 'Five Trainer',
          avatar: null,
          email: 'trainer05@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'principal',
                id: '2c40e637-0d02-44a2-94d8-847f9a7fc9b4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'moderator',
                id: '20b80bd7-99cf-4f55-914e-c8b870006af4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'moderator',
                id: '20b80bd7-99cf-4f55-914e-c8b870006af4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: '13a223a8-2184-42f1-ba37-b49e115e59a2',
          fullName: 'John Trainer',
          avatar: null,
          email: 'trainer@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'UNAVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'principal',
                id: '2c40e637-0d02-44a2-94d8-847f9a7fc9b4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'moderator',
                id: '20b80bd7-99cf-4f55-914e-c8b870006af4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25',
          fullName: 'Noah Assistant',
          avatar: null,
          email: 'assistant.with.org@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'principal',
                id: '2c40e637-0d02-44a2-94d8-847f9a7fc9b4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'moderator',
                id: '20b80bd7-99cf-4f55-914e-c8b870006af4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: '88072bb2-10e0-4417-b9ce-ec05265b8b56',
          fullName: 'TeamTeach Principal-Trainer',
          avatar: null,
          email: 'tt.principal.trainer@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2025-06-12',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'principal',
                id: '2c40e637-0d02-44a2-94d8-847f9a7fc9b4',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: 'dccd780a-9745-4972-a43e-95ec3ef361df',
          fullName: 'TeamTeach Senior-Trainer',
          avatar: null,
          email: 'tt.senior.trainer@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2025-06-12',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'senior',
                id: 'fb8d2ffa-d46b-47ff-9587-b68fc9ae85f5',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
            {
              trainer_role_type: {
                name: 'assistant',
                id: '01a993de-b3b8-4402-966f-5f56679f6f77',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9',
          fullName: 'Three Trainer',
          avatar: null,
          email: 'trainer03@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'senior',
                id: 'fb8d2ffa-d46b-47ff-9587-b68fc9ae85f5',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
        {
          id: '30ebb1e1-0491-44f8-b0a2-3087bd454b19',
          fullName: 'Two Trainer',
          avatar: null,
          email: 'trainer02@teamteach.testinator.com',
          levels: [
            {
              courseLevel: 'ADVANCED_TRAINER',
              expiryDate: '2030-05-05',
              __typename: 'CourseCertificateLevel',
            },
          ],
          availability: 'AVAILABLE',
          trainer_role_types: [
            {
              trainer_role_type: {
                name: 'senior-assist',
                id: '5c8c8b23-bff8-435e-998e-d74e8a593cc1',
                __typename: 'TrainerRoleTypeObj',
              },
              __typename: 'TrainerRoleType',
            },
          ],
          __typename: 'SearchTrainer',
        },
      ],
    },
  }
}

export const createOrderForBooking = (orderId: string) => {
  return {
    data: {
      order: {
        id: orderId,
        success: true,
        error: null,
        __typename: 'CreateOrderOutput',
      },
    },
  }
}

export const getOrderForBookingDone = (
  orderId: string,
  xeroInvoiceNumber: string,
) => {
  return {
    data: {
      order: {
        id: orderId,
        xeroInvoiceNumber: xeroInvoiceNumber,
        paymentMethod: 'INVOICE',
        __typename: 'order',
      },
    },
  }
}

export const getTransferEligibleCourses = (
  transferEligibleCourses: TransferEligibleCourses,
) => {
  return {
    data: {
      eligibleTransferCourses: [
        {
          id: transferEligibleCourses.courseId,
          freeSlots: 1,
          courseCode: transferEligibleCourses.courseCode,
          courseResidingCountry: 'GB-ENG',
          startDate: addMonths(new Date(), 1).toISOString(),
          endDate: addMonths(new Date(), 2).toISOString(),
          virtualLink: null,
          venue: null,
          venueName: transferEligibleCourses.venueName,
          venueCity: transferEligibleCourses.venueCity,
          venueCountry: transferEligibleCourses.venueCountry,
          level: transferEligibleCourses.level,
          reaccreditation: transferEligibleCourses.reaccreditation,
          type: transferEligibleCourses.type,
          deliveryType: transferEligibleCourses.deliveryType,
          timezone: 'Europe/London',
          __typename: 'TransferCourse',
        },
      ],
    },
  }
}

export const getOrganisationProifiles = () => {
  return {
    data: {
      profiles: {
        profilesByOrganisation: [
          {
            orgId: '6d08b3de-d08a-4a4a-8c63-5a4b638ffcd7',
            profiles: [
              {
                id: '30ebb1e1-0491-44f8-b0a2-3087bd454b19',
                fullName: 'Two Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25',
                fullName: 'Noah Assistant',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6',
                fullName: 'One Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
            profiles: [
              {
                id: '30ebb1e1-0491-44f8-b0a2-3087bd454b19',
                fullName: 'Two Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '62946c00-1da3-44f7-97a6-4b1c8da4f2ef',
                fullName: 'Five Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6',
                fullName: 'One Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '8ba2c43e-a7e5-47c5-8d03-0383719d77df',
                fullName: 'Six Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2024-12-25',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9',
                fullName: 'Three Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '2a451ef2-99fe-4350-9f0e-2081b6f3f87f',
                fullName: 'Seven Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'd54f86ca-0181-4264-8c73-7b73ff395405',
                fullName: 'Four Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: '562446fd-60c5-4f3d-93ab-a9768ed5ff0e',
            profiles: [
              {
                id: '62946c00-1da3-44f7-97a6-4b1c8da4f2ef',
                fullName: 'Five Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '8ba2c43e-a7e5-47c5-8d03-0383719d77df',
                fullName: 'Six Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2024-12-25',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9',
                fullName: 'Three Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'd54f86ca-0181-4264-8c73-7b73ff395405',
                fullName: 'Four Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
            profiles: [
              {
                id: 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25',
                fullName: 'Noah Assistant',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '13a223a8-2184-42f1-ba37-b49e115e59a2',
                fullName: 'John Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '5c6434fd-d4ee-47f5-8200-0d7b767e2e95',
                fullName: 'Mark Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'd1c5fa19-30da-4512-88f6-dc9ef6a26958',
                fullName: 'Bild 2 Senior',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'BILD_ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '00d14fc3-7fa6-4d52-9ae4-f3bcb26baade',
                fullName: 'Bild 2 Advanced',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'BILD_ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '9b236919-918d-45ad-84e4-fb063c1938f0',
                fullName: 'Bild 2 Intermediate',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'BILD_INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'c15a4b34-bb98-4096-ae2e-ea280fb14e05',
                fullName: 'Bild 2 Certified',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'BILD_INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: '46c34024-ea2f-4146-962d-c3e0fc3b923b',
            profiles: [
              {
                id: 'ae8f617c-2411-42aa-9501-f2f08b16a76e',
                fullName: 'Lynda Claud',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'fbe6eb48-ad58-40f9-9388-07e743240ce3',
                fullName: 'Lilac Reuben',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '47b5b128-0a47-4094-86f6-87005eb12d71',
                fullName: 'Linwood Darien',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '2e06729d-7436-427a-a5cf-ff7c9496b85c',
                fullName: 'Cheyanne Kathryn',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'b5702c04-35a6-4c55-b24a-592dc0a05142',
                fullName: 'Cassandra Jess',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: '022aa49b-1ba9-40e4-aab2-58c3e1afef54',
            profiles: [
              {
                id: '13a223a8-2184-42f1-ba37-b49e115e59a2',
                fullName: 'John Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '5c6434fd-d4ee-47f5-8200-0d7b767e2e95',
                fullName: 'Mark Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: 'c370432a-6aa4-4990-9e64-5a02f80588c7',
            profiles: [
              {
                id: '2a451ef2-99fe-4350-9f0e-2081b6f3f87f',
                fullName: 'Seven Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
            profiles: [
              {
                id: '38290d3f-7614-44be-ac70-cd0db7b71b1e',
                fullName: 'Levi Tromp',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRING_SOON',
                    expiryDate: '2025-02-11',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '49f34a78-a73d-46c3-a17f-5cee00feb1ca',
                fullName: 'Martin Cartwright',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-02-02',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e',
                fullName: 'Tim Hintz',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '85687c6e-d8a4-4e98-a47e-a66c8059919b',
                fullName: 'Ralph Smith',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-08-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '117c12fc-d7c6-4987-9841-a499765ade4b',
                fullName: 'Krista Kuhn',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed',
                fullName: 'Curtis Ondricka',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
          {
            orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
            profiles: [
              {
                id: '749791ef-e4c4-4a5f-881a-461e4724138d',
                fullName: 'TeamTeach Intermediate-Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '6ea4e91b-9856-4533-9544-949caba236fb',
                fullName: 'TeamTeach Exp-Adv-Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '5dd7b79c-9ef2-4712-833e-e2f12bdd672d',
                fullName: 'TeamTeach Advanced-Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '30f8fdda-a7ec-44d5-afa0-26d5147d0ea5',
                fullName: 'TeamTeach Exp-Int-Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'dccd780a-9745-4972-a43e-95ec3ef361df',
                fullName: 'TeamTeach Senior-Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '88072bb2-10e0-4417-b9ce-ec05265b8b56',
                fullName: 'TeamTeach Principal-Trainer',
                archived: false,
                avatar: null,
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByOrganization',
          },
        ],
        profilesByLevel: [
          {
            level: 'ADVANCED_TRAINER',
            profiles: [
              {
                id: '30ebb1e1-0491-44f8-b0a2-3087bd454b19',
                fullName: 'Two Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '3a0534b3-bcb2-4d9b-b21f-48791b2824cc',
                    position: null,
                    organization: {
                      id: '6d08b3de-d08a-4a4a-8c63-5a4b638ffcd7',
                      name: 'Australia First Affiliated Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '7b046b63-6e58-4def-aae1-768edb13105e',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '62946c00-1da3-44f7-97a6-4b1c8da4f2ef',
                fullName: 'Five Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '284b3a38-ec52-44d2-91e0-99ed67583edc',
                    position: null,
                    organization: {
                      id: '562446fd-60c5-4f3d-93ab-a9768ed5ff0e',
                      name: 'New Zealand Main Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '03ae7b1f-bf6f-4993-9238-df4c8f9b3837',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'b9b0eb9f-374c-4d39-9370-a8e8cdc90d25',
                fullName: 'Noah Assistant',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '2227f396-fa6c-498f-b1f2-9d48c123a544',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: 'f5787e53-5708-4a28-ade2-fc9955915bf7',
                    position: null,
                    organization: {
                      id: '6d08b3de-d08a-4a4a-8c63-5a4b638ffcd7',
                      name: 'Australia First Affiliated Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '921ddd50-6d03-4bec-a0f4-6bd6f2da20a6',
                fullName: 'One Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: 'b05a2ad8-b9da-4304-99c2-cf7bf53799dc',
                    position: null,
                    organization: {
                      id: '6d08b3de-d08a-4a4a-8c63-5a4b638ffcd7',
                      name: 'Australia First Affiliated Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '4c60d709-8dfe-4ad4-b84d-6619f3f5ca2a',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '13a223a8-2184-42f1-ba37-b49e115e59a2',
                fullName: 'John Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10088,
                      course_code: 'INT.F.OP-10088',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10089,
                      course_code: 'INT.F.CL-10089',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10090,
                      course_code: 'INT.F.INDR-10090',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10091,
                      course_code: 'INT.F.INDR-10091',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10092,
                      course_code: 'INT.F.OP-10092',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10093,
                      course_code: 'INT.F.CL-10093',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10094,
                      course_code: 'INT.F.INDR-10094',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10088,
                      course_code: 'INT.F.OP-10088',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10092,
                      course_code: 'INT.F.OP-10092',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '9e437fec-1d78-4b70-a71f-d9e24c24cf51',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: 'ae1c7f1b-94f3-4370-a978-b87d693a66ce',
                    position: null,
                    organization: {
                      id: '022aa49b-1ba9-40e4-aab2-58c3e1afef54',
                      name: 'Australia Main Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '5c6434fd-d4ee-47f5-8200-0d7b767e2e95',
                fullName: 'Mark Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '8838cd48-dbf0-4534-943f-fea9ebb11246',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '926632c3-f23b-4690-a1a3-bc004bf92714',
                    position: null,
                    organization: {
                      id: '022aa49b-1ba9-40e4-aab2-58c3e1afef54',
                      name: 'Australia Main Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '8ba2c43e-a7e5-47c5-8d03-0383719d77df',
                fullName: 'Six Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2024-12-25',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: 'd0009b15-3710-4d4e-9287-4ba7360042c1',
                    position: null,
                    organization: {
                      id: '562446fd-60c5-4f3d-93ab-a9768ed5ff0e',
                      name: 'New Zealand Main Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '6dfb75dc-e39c-4cce-a013-24c3e3c68bb5',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'e05cef9b-6b13-4c4c-b7b0-31181b6ad0a9',
                fullName: 'Three Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '7fba27b8-7bfb-46ac-92f3-e28a27ca93f8',
                    position: null,
                    organization: {
                      id: '562446fd-60c5-4f3d-93ab-a9768ed5ff0e',
                      name: 'New Zealand Main Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '757c116b-2026-4d8e-94c1-9e1a16c81f2a',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '2a451ef2-99fe-4350-9f0e-2081b6f3f87f',
                fullName: 'Seven Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: 'acc4438a-cad9-4c2a-9ef9-5260090e2925',
                    position: null,
                    organization: {
                      id: 'c370432a-6aa4-4990-9e64-5a02f80588c7',
                      name: 'New Zealand First Affiliated Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: 'd4afbade-c9e0-4485-bb34-ad9627ef3576',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'd54f86ca-0181-4264-8c73-7b73ff395405',
                fullName: 'Four Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2030-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '57db770f-3a17-498e-97da-5f050a6a1166',
                    position: null,
                    organization: {
                      id: '562446fd-60c5-4f3d-93ab-a9768ed5ff0e',
                      name: 'New Zealand Main Organisation',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                  {
                    id: '3e3405bb-479f-4034-9d4e-63b9892082b9',
                    position: null,
                    organization: {
                      id: '55320dc6-cfb0-41fb-9000-ca7eb9d2894d',
                      name: 'NearForm',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '6ea4e91b-9856-4533-9544-949caba236fb',
                fullName: 'TeamTeach Exp-Adv-Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '3a72d306-3f5b-4fb7-b38b-7790daf0ac77',
                    position: null,
                    organization: {
                      id: 'a24397aa-b059-46b9-a728-955580823ce4',
                      name: 'Team Teach',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '5dd7b79c-9ef2-4712-833e-e2f12bdd672d',
                fullName: 'TeamTeach Advanced-Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '8aea0a91-e1b9-45b4-a36b-9d67cf7f9514',
                    position: null,
                    organization: {
                      id: 'a24397aa-b059-46b9-a728-955580823ce4',
                      name: 'Team Teach',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'dccd780a-9745-4972-a43e-95ec3ef361df',
                fullName: 'TeamTeach Senior-Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: 'aaf2e25a-fef5-4c12-adb3-3f816b22cf11',
                    position: null,
                    organization: {
                      id: 'a24397aa-b059-46b9-a728-955580823ce4',
                      name: 'Team Teach',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '88072bb2-10e0-4417-b9ce-ec05265b8b56',
                fullName: 'TeamTeach Principal-Trainer',
                certificates: [
                  {
                    courseLevel: 'ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '477831b8-7be5-46b1-93a3-29d1dbea2ccd',
                    position: null,
                    organization: {
                      id: 'a24397aa-b059-46b9-a728-955580823ce4',
                      name: 'Team Teach',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
          {
            level: 'LEVEL_1',
            profiles: [
              {
                id: 'ae8f617c-2411-42aa-9501-f2f08b16a76e',
                fullName: 'Lynda Claud',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '4ae369e3-cf8d-45e5-a8f9-b459e6c092e4',
                    position: null,
                    organization: {
                      id: '46c34024-ea2f-4146-962d-c3e0fc3b923b',
                      name: 'Example organization',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'fbe6eb48-ad58-40f9-9388-07e743240ce3',
                fullName: 'Lilac Reuben',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10004,
                      course_code: 'L2.F.OP-10004',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10013,
                      course_code: 'L1.F.OP-10013',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10085,
                      course_code: 'L1.F.OP-10085',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: 'c8e4d879-bbde-4ac5-979b-dec4d3f2b917',
                    position: null,
                    organization: {
                      id: '46c34024-ea2f-4146-962d-c3e0fc3b923b',
                      name: 'Example organization',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '47b5b128-0a47-4094-86f6-87005eb12d71',
                fullName: 'Linwood Darien',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: 'ed77b5ab-ed68-487d-abb7-945f48137e9f',
                    position: null,
                    organization: {
                      id: '46c34024-ea2f-4146-962d-c3e0fc3b923b',
                      name: 'Example organization',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '2e06729d-7436-427a-a5cf-ff7c9496b85c',
                fullName: 'Cheyanne Kathryn',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10088,
                      course_code: 'INT.F.OP-10088',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10089,
                      course_code: 'INT.F.CL-10089',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10090,
                      course_code: 'INT.F.INDR-10090',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10091,
                      course_code: 'INT.F.INDR-10091',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10092,
                      course_code: 'INT.F.OP-10092',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10093,
                      course_code: 'INT.F.CL-10093',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10094,
                      course_code: 'INT.F.INDR-10094',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10088,
                      course_code: 'INT.F.OP-10088',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10092,
                      course_code: 'INT.F.OP-10092',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '223c75f5-291a-4723-9c07-7ff82b30b693',
                    position: null,
                    organization: {
                      id: '46c34024-ea2f-4146-962d-c3e0fc3b923b',
                      name: 'Example organization',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'b5702c04-35a6-4c55-b24a-592dc0a05142',
                fullName: 'Cassandra Jess',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-12-06',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10088,
                      course_code: 'INT.F.OP-10088',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10089,
                      course_code: 'INT.F.CL-10089',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10090,
                      course_code: 'INT.F.INDR-10090',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10091,
                      course_code: 'INT.F.INDR-10091',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10092,
                      course_code: 'INT.F.OP-10092',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10093,
                      course_code: 'INT.F.CL-10093',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'a24397aa-b059-46b9-a728-955580823ce4',
                    orgName: 'Team Teach',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10094,
                      course_code: 'INT.F.INDR-10094',
                      schedule: [
                        {
                          start: '2026-02-03T09:00:00+00:00',
                          end: '2026-02-03T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10088,
                      course_code: 'INT.F.OP-10088',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10092,
                      course_code: 'INT.F.OP-10092',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '0e87a4d8-e512-42cc-90f0-be4383ea7ab5',
                    position: null,
                    organization: {
                      id: '46c34024-ea2f-4146-962d-c3e0fc3b923b',
                      name: 'Example organization',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '49f34a78-a73d-46c3-a17f-5cee00feb1ca',
                fullName: 'Martin Cartwright',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-02-02',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'LEVEL_1',
                    course: {
                      id: 10104,
                      course_code: 'L1.F.CL-10104',
                      schedule: [
                        {
                          start: '2025-01-05T09:00:00+00:00',
                          end: '2025-03-01T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: 'd7578d18-8d1c-43c5-8fab-45e09634fb7e',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '85687c6e-d8a4-4e98-a47e-a66c8059919b',
                fullName: 'Ralph Smith',
                certificates: [
                  {
                    courseLevel: 'LEVEL_1',
                    status: 'ACTIVE',
                    expiryDate: '2025-08-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'LEVEL_1',
                    course: {
                      id: 10104,
                      course_code: 'L1.F.CL-10104',
                      schedule: [
                        {
                          start: '2025-01-05T09:00:00+00:00',
                          end: '2025-03-01T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '8e8fdbd4-3cf5-41d3-8877-f553f00fb412',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
          {
            level: 'ADVANCED',
            profiles: [
              {
                id: '38290d3f-7614-44be-ac70-cd0db7b71b1e',
                fullName: 'Levi Tromp',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRING_SOON',
                    expiryDate: '2025-02-11',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: 'deb8a25a-f8eb-4266-9bf5-5f20ef49af21',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '117c12fc-d7c6-4987-9841-a499765ade4b',
                fullName: 'Krista Kuhn',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '75a8094a-1dd4-472f-b135-8419655b182b',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed',
                fullName: 'Curtis Ondricka',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'ADVANCED',
                    course: {
                      id: 10100,
                      course_code: 'ADVMOD.F.CL-10100',
                      schedule: [
                        {
                          start: '2025-03-05T10:27:18.661906+00:00',
                          end: '2025-03-10T10:27:18.661906+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'ADVANCED',
                    course: {
                      id: 10100,
                      course_code: 'ADVMOD.F.CL-10100',
                      schedule: [
                        {
                          start: '2025-03-05T10:27:18.661906+00:00',
                          end: '2025-03-10T10:27:18.661906+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '1dcb36c9-ad88-4c6a-821e-2984533f38b7',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
          {
            level: 'INTERMEDIATE_TRAINER',
            profiles: [
              {
                id: '38290d3f-7614-44be-ac70-cd0db7b71b1e',
                fullName: 'Levi Tromp',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRING_SOON',
                    expiryDate: '2025-02-11',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: 'deb8a25a-f8eb-4266-9bf5-5f20ef49af21',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'b9bea8d0-cde4-4c01-94e2-d6bcf56dcd0e',
                fullName: 'Tim Hintz',
                certificates: [
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '35aa4822-d33a-4bf9-82e4-41e0ad714023',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '749791ef-e4c4-4a5f-881a-461e4724138d',
                fullName: 'TeamTeach Intermediate-Trainer',
                certificates: [
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '33f0fa15-5bd7-47f0-b76d-2a98cc9c1303',
                    position: null,
                    organization: {
                      id: 'a24397aa-b059-46b9-a728-955580823ce4',
                      name: 'Team Teach',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '30f8fdda-a7ec-44d5-afa0-26d5147d0ea5',
                fullName: 'TeamTeach Exp-Int-Trainer',
                certificates: [
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '38b3e7e1-0eab-4a55-b3bf-d06676accd79',
                    position: null,
                    organization: {
                      id: 'a24397aa-b059-46b9-a728-955580823ce4',
                      name: 'Team Teach',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
          {
            level: 'LEVEL_2',
            profiles: [
              {
                id: '38290d3f-7614-44be-ac70-cd0db7b71b1e',
                fullName: 'Levi Tromp',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-14',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRING_SOON',
                    expiryDate: '2025-02-11',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'INTERMEDIATE_TRAINER',
                    course: {
                      id: 10103,
                      course_code: 'INT.F.CL-10103',
                      schedule: [
                        {
                          start: '2025-01-04T09:00:00+00:00',
                          end: '2025-03-02T17:00:00+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: 'deb8a25a-f8eb-4266-9bf5-5f20ef49af21',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '117c12fc-d7c6-4987-9841-a499765ade4b',
                fullName: 'Krista Kuhn',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '75a8094a-1dd4-472f-b135-8419655b182b',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '95e897bf-6d61-43d5-9c5c-efc0d0a5aaed',
                fullName: 'Curtis Ondricka',
                certificates: [
                  {
                    courseLevel: 'LEVEL_2',
                    status: 'ACTIVE',
                    expiryDate: '2026-02-03',
                    __typename: 'CourseCertificate',
                  },
                  {
                    courseLevel: 'ADVANCED',
                    status: 'EXPIRED_RECENTLY',
                    expiryDate: '2025-01-29',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'ADVANCED',
                    course: {
                      id: 10100,
                      course_code: 'ADVMOD.F.CL-10100',
                      schedule: [
                        {
                          start: '2025-03-05T10:27:18.661906+00:00',
                          end: '2025-03-10T10:27:18.661906+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                  {
                    orgId: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                    orgName: 'Park Community School',
                    courseLevel: 'ADVANCED',
                    course: {
                      id: 10100,
                      course_code: 'ADVMOD.F.CL-10100',
                      schedule: [
                        {
                          start: '2025-03-05T10:27:18.661906+00:00',
                          end: '2025-03-10T10:27:18.661906+00:00',
                          __typename: 'EnrollmentCourseSchedule',
                        },
                      ],
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '1dcb36c9-ad88-4c6a-821e-2984533f38b7',
                    position: null,
                    organization: {
                      id: 'd787defd-481c-414b-95ff-ecbcc12ae500',
                      name: 'Park Community School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
          {
            level: 'BILD_ADVANCED_TRAINER',
            profiles: [
              {
                id: 'd1c5fa19-30da-4512-88f6-dc9ef6a26958',
                fullName: 'Bild 2 Senior',
                certificates: [
                  {
                    courseLevel: 'BILD_ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10034,
                      course_code: 'B.ADV.F.OP-10034',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '5c3089da-5b7f-4fcb-9af3-0aefeb0335df',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: '00d14fc3-7fa6-4d52-9ae4-f3bcb26baade',
                fullName: 'Bild 2 Advanced',
                certificates: [
                  {
                    courseLevel: 'BILD_ADVANCED_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10034,
                      course_code: 'B.ADV.F.OP-10034',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '40debe66-fb47-4f9b-8deb-d9755fdccde5',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
          {
            level: 'BILD_INTERMEDIATE_TRAINER',
            profiles: [
              {
                id: '9b236919-918d-45ad-84e4-fb063c1938f0',
                fullName: 'Bild 2 Intermediate',
                certificates: [
                  {
                    courseLevel: 'BILD_INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [],
                organizations: [
                  {
                    id: '6796931f-80cc-47e0-8698-053e0605cca6',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
              {
                id: 'c15a4b34-bb98-4096-ae2e-ea280fb14e05',
                fullName: 'Bild 2 Certified',
                certificates: [
                  {
                    courseLevel: 'BILD_INTERMEDIATE_TRAINER',
                    status: 'ACTIVE',
                    expiryDate: '2025-05-05',
                    __typename: 'CourseCertificate',
                  },
                ],
                upcomingEnrollments: [
                  {
                    orgId: null,
                    orgName: null,
                    courseLevel: null,
                    course: {
                      id: 10034,
                      course_code: 'B.ADV.F.OP-10034',
                      __typename: 'UpcomingEnrollmentCourse',
                    },
                    __typename: 'UpcominEnrollment',
                  },
                ],
                organizations: [
                  {
                    id: '7fffcee1-23a9-41df-a9d5-d6befea14534',
                    position: null,
                    organization: {
                      id: 'c43b2ba0-8630-43e5-9558-f59ee9a224f0',
                      name: 'London First School',
                      __typename: 'OrganizationInfo',
                    },
                    __typename: 'ProfileOrganization',
                  },
                ],
                __typename: 'OrganizationProfile',
              },
            ],
            __typename: 'ProfilesByLevel',
          },
        ],
        __typename: 'OrganizationProfilesOutput',
      },
    },
  }
}
