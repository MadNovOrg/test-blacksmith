import { ModuleGroup } from '@app/types'

export type AvailableModule = ModuleGroup & {
  used?: boolean
  draggableId: string
}

export type ModuleGroupSlot = {
  module?: ModuleGroup
  droppableId: string
  draggableId: string
}
