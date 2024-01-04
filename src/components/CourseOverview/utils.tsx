import { Submodule_Aggregate } from '@app/generated/graphql'

export function submodulesCount(
  modules: {
    submodules_aggregate: Pick<Submodule_Aggregate, 'aggregate'>
  }[]
) {
  return Number(
    modules.length
      ? modules
          .map(module => module.submodules_aggregate?.aggregate?.count)
          .reduce((acc, sum) => (acc ?? 0) + (sum ?? 0))
      : 0
  )
}
