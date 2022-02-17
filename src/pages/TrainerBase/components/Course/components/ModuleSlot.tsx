import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import clsx from 'clsx'

import { ModuleGroup } from '@app/types'
import { ModuleCard } from '@app/pages/TrainerBase/components/Course/components/ModuleCard'

type ModuleSlotProps = {
  module?: ModuleGroup
  droppableId: string
  draggableId: string
}

export const ModuleSlot: React.FC<ModuleSlotProps> = ({
  droppableId,
  draggableId,
  module,
}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => {
        return module ? (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <ModuleCard
              className={clsx({ hidden: snapshot.isDraggingOver })}
              index={0}
              data={module}
              draggableId={draggableId}
            />
            {provided.placeholder}
          </div>
        ) : (
          <div
            className={clsx(
              'm-2 w-24 h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-md text-white p-2 flex flex-col justify-center transition-colors',
              { 'bg-fuschia-600': snapshot.isDraggingOver }
            )}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {provided.placeholder}
          </div>
        )
      }}
    </Droppable>
  )
}
