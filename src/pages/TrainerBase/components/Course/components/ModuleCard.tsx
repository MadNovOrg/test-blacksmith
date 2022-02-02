import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import clsx from 'clsx'

import { CourseModule } from '@app/types'

type ModuleCardProps = {
  data: CourseModule
  index: number
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ data, index }) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx(
            'm-2 w-28 h-28 bg-fuschia-500 rounded-md text-white p-2 flex flex-col justify-center transition-colors',
            { 'bg-fuschia-600': snapshot.isDragging }
          )}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <p className="text-xs text-center font-bold mb-2">{data.name}</p>
          <p className="text-xs text-center">{data.description}</p>
        </div>
      )}
    </Draggable>
  )
}
