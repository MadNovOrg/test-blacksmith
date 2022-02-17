import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import clsx from 'clsx'

import { ModuleGroup } from '@app/types'

type ModuleCardProps = {
  data: ModuleGroup
  index: number
  draggableId: string
  isDragDisabled?: boolean
  className?: string
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  data,
  draggableId,
  index,
  isDragDisabled,
  className,
}) => {
  return (
    <Draggable
      draggableId={draggableId}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <div
          className={clsx(
            className,
            'm-2 w-24 h-24 lg:w-28 lg:h-28 rounded-md text-white p-2 flex flex-col justify-center transition-colors',
            isDragDisabled ? 'bg-fuschia-200' : 'bg-fuschia-500',
            { 'bg-fuschia-600': snapshot.isDragging }
          )}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <p className="text-xs text-center font-bold mb-2">{data.name}</p>
          {/* <p className="text-xs text-center">{data.description}</p> */}
        </div>
      )}
    </Draggable>
  )
}
