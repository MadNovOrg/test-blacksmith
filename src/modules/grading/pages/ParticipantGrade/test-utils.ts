import {
  Accreditors_Enum,
  Grade_Enum,
  GradedParticipantQuery,
} from '@app/generated/graphql'

import { chance } from '@test/index'

export function buildGradedParticipant(
  overrides?: Partial<NonNullable<GradedParticipantQuery['participant']>>
): NonNullable<GradedParticipantQuery['participant']> {
  return {
    id: chance.guid(),
    gradedOn: [],
    gradingModules: [],
    notes: [],
    course: {
      accreditedBy: Accreditors_Enum.Icm,
      name: chance.name(),
    },
    profile: {
      fullName: chance.name({ full: true }),
    },
    grade: Grade_Enum.Pass,
    ...overrides,
  }
}
