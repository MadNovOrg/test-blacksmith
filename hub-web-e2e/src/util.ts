import * as fs from 'fs'

import { addDays, format } from 'date-fns'

import { TARGET_ENV, TEMP_DIR } from './constants'
import { CourseTableRow, ModuleGroup } from './data/types'

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
  `${TEMP_DIR}/storage-${userKey}-${TARGET_ENV}.json`

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getAdminIdToken: () => string = () => {
  const data = JSON.parse(
    fs.readFileSync(stateFilePath('admin')).toString() ?? '{}'
  )
  return data.origins[0].localStorage.filter((pair: KeyValue) =>
    pair.name.endsWith('idToken')
  )[0].value
}

export const sortModulesByName = (a: ModuleGroup, b: ModuleGroup) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

export const sortCoursesByAllFields = (
  a: CourseTableRow,
  b: CourseTableRow
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
