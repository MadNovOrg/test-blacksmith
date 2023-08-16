import { ModuleGroupsQuery } from '@app/generated/graphql'

export type ModuleGroup = ModuleGroupsQuery['groups'][0]

export type AvailableModule = ModuleGroup & {
  used?: boolean
  draggableId: string
}

export type ModuleGroupSlot = {
  module?: ModuleGroup
  droppableId: string
  draggableId: string
}
