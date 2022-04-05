import { Box, useTheme } from '@mui/material'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { ModuleCard } from '@app/pages/TrainerBase/components/Course/components/ModuleCard'
import { ModuleGroup } from '@app/types'

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
  const theme = useTheme()
  const color = module ? theme.colors[module.color] : undefined
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
                    bgColor={
                      color
                        ? color[draggableSnapshot.isDragging ? 600 : 500] || ''
                        : ''
                    }
                    hide={droppableSnapshot.isDraggingOver}
                    data={module}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    data-testid="module-card"
                  />
                  {draggableSnapshot.isDragging &&
                    droppableSnapshot.isDraggingOver && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          m: 1,
                          p: 1,
                          width: {
                            xs: '6rem',
                            md: '7rem',
                          },
                          height: {
                            xs: '6rem',
                            md: '7rem',
                          },
                          color: 'white',
                          borderRadius: '0.375rem',
                          bgcolor: 'grey.500',
                          justifyContent: 'center',
                        }}
                      />
                    )}
                </div>
              )}
            </Draggable>
            {droppableProvided.placeholder}
          </div>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 1,
              p: 1,
              width: {
                xs: '6rem',
                md: '7rem',
              },
              height: {
                xs: '6rem',
                md: '7rem',
              },
              color: 'white',
              borderRadius: '0.375rem',
              bgcolor: droppableSnapshot.isDraggingOver
                ? 'grey.600'
                : 'grey.400',
              justifyContent: 'center',
            }}
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
            data-testid="empty-slot"
          >
            {droppableProvided.placeholder}
          </Box>
        )
      }}
    </Droppable>
  )
}
