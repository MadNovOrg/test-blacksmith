import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import clsx from 'clsx'

import { ModuleGroup } from '@app/types'
import { ModuleCard } from '@app/pages/TrainerBase/components/Course/components/ModuleCard'
import CourseColorScheme from '@app/pages/TrainerBase/components/Course/CourseColorScheme'

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
  const moduleColors = module
    ? CourseColorScheme.BY_MODULE_LEVEL[
        module.level as keyof typeof CourseColorScheme.BY_MODULE_LEVEL
      ]
    : undefined
  return (
    <Droppable droppableId={droppableId}>
      {(droppableProvided, droppableSnapshot) => {
        return module ? (
          <div
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            <Draggable draggableId={draggableId} index={0}>
              {(draggableProvided, draggableSnapshot) => (
                <div ref={draggableProvided.innerRef}>
                  <ModuleCard
                    className={clsx(
                      { hidden: droppableSnapshot.isDraggingOver },
                      draggableSnapshot.isDragging
                        ? moduleColors?.draggingColor
                        : moduleColors?.color
                    )}
                    data={module}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  />
                  {draggableSnapshot.isDragging &&
                    droppableSnapshot.isDraggingOver && (
                      <div className="m-2 w-24 h-24 lg:w-28 lg:h-28 bg-gray-500 rounded-md text-white p-2 flex flex-col justify-center transition-colors"></div>
                    )}
                </div>
              )}
            </Draggable>
            {droppableProvided.placeholder}
          </div>
        ) : (
          <div
            className={clsx(
              'm-2 w-24 h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-md text-white p-2 flex flex-col justify-center transition-colors',
              { 'bg-gray-500': droppableSnapshot.isDraggingOver }
            )}
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            {droppableProvided.placeholder}
          </div>
        )
      }}
    </Droppable>
  )
}
