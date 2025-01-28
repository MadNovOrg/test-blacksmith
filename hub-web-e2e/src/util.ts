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
