import React, { useCallback, useState } from 'react'
import {
  DragDropContext,
  DragDropContextProps,
  Droppable,
} from 'react-beautiful-dnd'
import clsx from 'clsx'

import { Typography } from '@app/components/Typography'

import { ModuleCard } from './components/ModuleCard'

import { CourseModule } from '@app/types'

type CourseProps = unknown

const mockedCourseModules = [
  {
    id: 'm1',
    name: 'Module A',
    description: 'Brief description of the module',
  },
]

const mockedModules = [
  {
    id: 'm2',
    name: 'Module B',
    description: 'Brief description of the module',
  },
  {
    id: 'm3',
    name: 'Module C',
    description: 'Brief description of the module',
  },
  {
    id: 'm4',
    name: 'Module D',
    description: 'Brief description of the module',
  },
]

export const Course: React.FC<CourseProps> = () => {
  // TODO: mocked data, will be plugged with API
  const [courseModules, setCourseModules] =
    useState<CourseModule[]>(mockedCourseModules)
  const [allModules, setAllModules] = useState<CourseModule[]>(mockedModules)

  const handleDrop = useCallback<DragDropContextProps['onDragEnd']>(
    result => {
      const { draggableId, source, destination } = result

      // if drop happened outside of droppable
      if (!destination) return

      // No need to allow sorting within all module list
      if (
        destination.droppableId === source.droppableId &&
        source.droppableId === 'all-modules'
      ) {
        return
      }

      if (destination.droppableId === 'course-modules') {
        const isReordering = source.droppableId === 'course-modules'

        const targetItem = (isReordering ? courseModules : allModules).find(
          m => m.id === draggableId
        ) as CourseModule

        const newCourseModules = Array.from(courseModules)
        const newAllModules = isReordering ? allModules : Array.from(allModules)

        if (isReordering) {
          newCourseModules.splice(source.index, 1)
        } else {
          newAllModules.splice(source.index, 1)
        }

        newCourseModules.splice(destination.index, 0, targetItem)

        setCourseModules(newCourseModules)
        setAllModules(newAllModules)
        return
      }

      if (destination.droppableId === 'all-modules') {
        const targetItem = courseModules.find(
          m => m.id === draggableId
        ) as CourseModule

        const newAllModules = Array.from(allModules)
        newAllModules.splice(destination.index, 0, targetItem)
        setAllModules(newAllModules)

        const newCourseModules = Array.from(courseModules)
        newCourseModules.splice(source.index, 1)
        setCourseModules(newCourseModules)
        return
      }
    },
    [allModules, courseModules]
  )

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <div className="">
        <Typography variant="h4" className="mb-4">
          Level Two
        </Typography>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <Typography variant="body2">
              To meet the acceptance crteria, this course must contain tier 1
              (green) and two tier 2 (yellow) modules. Drag and drop modules in
              the area provided below and submit when complete.
            </Typography>
          </div>
          <div className="flex-1 flex justify-end">
            <label className="block">
              <Typography variant="body2">Add to booking</Typography>
              <select
                className="px-0 pr-10 border-0 border-b border-grey3 focus:ring-0 focus:border-navy"
                placeholder="Please choose"
              >
                <option>Birchwood Academy, 3rd-4th May 2022</option>
              </select>
            </label>
          </div>
        </div>

        <Typography variant="subtitle3">My Course</Typography>

        <Droppable droppableId="course-modules" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={clsx(
                'flex flex-wrap mt-2 mb-3 -m-2 transition-colors ease-in-out h-32',
                {
                  'bg-lime4': snapshot.isDraggingOver,
                }
              )}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {courseModules.map((m, index) => (
                <ModuleCard key={m.id} data={m} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="flex items-center justify-end mb-3">
          <button className="btn btn-tertiary">Submit Course</button>
        </div>

        <Typography variant="subtitle3">Modules Available</Typography>

        <Droppable droppableId="all-modules" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={clsx(
                'flex flex-wrap mt-2 mb-3 -m-2 transition-colors ease-in-out h-32',
                {
                  'bg-lime4': snapshot.isDraggingOver,
                }
              )}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {allModules.map((m, index) => (
                <ModuleCard key={m.id} data={m} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}
