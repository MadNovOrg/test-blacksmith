import { TrainerRoleTypeName } from '@app/types'

import { getTrainerRoleLabels } from './utils'

vi.mock('react-i18next', () => ({
  getI18n: () => ({
    t: (key: string) => `translated:${key}`,
  }),
}))

describe('getTrainerRoleLabels', () => {
  it('translates single non-ETA trainer role correctly', () => {
    const roles = [TrainerRoleTypeName.INTERNAL]
    const result = getTrainerRoleLabels(roles)
    expect(result).toBe('translated:trainer-role-types.internal')
  })

  it('translates single ETA trainer role as "eta"', () => {
    const roles = [TrainerRoleTypeName.AOL_ETA]
    const result = getTrainerRoleLabels(roles)
    expect(result).toBe('translated:trainer-role-types.eta')
  })

  it('translates multiple roles with correct handling of ETA roles', () => {
    const roles = [
      TrainerRoleTypeName.ASSISTANT,
      TrainerRoleTypeName.TRAINER_ETA,
      TrainerRoleTypeName.INTERNAL,
    ]
    const result = getTrainerRoleLabels(roles)
    expect(result).toBe(
      'translated:trainer-role-types.assistant, translated:trainer-role-types.eta, translated:trainer-role-types.internal',
    )
  })

  it('returns an empty string when given an empty array', () => {
    const result = getTrainerRoleLabels([])
    expect(result).toBe('')
  })
})
