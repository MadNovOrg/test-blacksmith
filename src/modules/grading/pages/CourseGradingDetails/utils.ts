import { Accreditors_Enum } from '@app/generated/graphql'

export function getGradingDetailsSteps(
  accreditedBy: Accreditors_Enum,
): Array<'modules' | 'grading-clearance'> {
  return accreditedBy === Accreditors_Enum.Bild
    ? ['grading-clearance']
    : ['grading-clearance', 'modules']
}
