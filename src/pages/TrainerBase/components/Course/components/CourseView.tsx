import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  DragDropContext,
  DragDropContextProps,
  Droppable,
} from 'react-beautiful-dnd'
import clsx from 'clsx'

import { Typography } from '@app/components/Typography'
import Spinner from '@app/components/Spinner'

import { ModuleCard } from './ModuleCard'

import { ModuleGroup } from '@app/types'
import { getModuleGroups } from '@app/queries/modules'

type CourseViewProps = unknown

export const CourseView: React.FC<CourseViewProps> = () => {
  // @TODO - we could/should be able to identify the level early based on course type etc
  const { data } = useSWR<{ groups: ModuleGroup[] }>([
    getModuleGroups,
    { level: 1 },
  ])

  const [courseModules, setCourseModules] = useState<ModuleGroup[]>([])
  const [allModules, setAllModules] = useState<ModuleGroup[]>([])

  useEffect(() => {
    if (allModules.length === 0 && data) {
      setAllModules(data.groups)
    }
  }, [allModules, data])

  const handleDrop = useCallback<DragDropContextProps['onDragEnd']>(
    result => {
      const { draggableId, source, destination } = result
      if (!data) return
      if (!destination) return

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
        )

        const newCourseModules = Array.from(courseModules)
        const newAllModules = isReordering ? allModules : Array.from(allModules)

        if (isReordering) {
          newCourseModules.splice(source.index, 1)
        } else {
          newAllModules.splice(source.index, 1)
        }

        if (targetItem) {
          newCourseModules.splice(destination.index, 0, targetItem)
        }

        setCourseModules(newCourseModules)
        setAllModules(newAllModules)
        return
      }

      if (destination.droppableId === 'all-modules') {
        const targetItem = courseModules.find(m => m.id === draggableId)

        const newAllModules = Array.from(allModules)
        if (targetItem) {
          newAllModules.splice(destination.index, 0, targetItem)
        }
        setAllModules(newAllModules)

        const newCourseModules = Array.from(courseModules)
        newCourseModules.splice(source.index, 1)
        setCourseModules(newCourseModules)
        return
      }
    },
    [allModules, courseModules, data]
  )

  if (!data) {
    return <Spinner cls="w-16 h-16" />
  }

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <div className="pb-12">
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
                className="px-0 pr-10 border-0 border-b border-gray-300 focus:ring-0 focus:border-navy"
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
                  'bg-lime-100': snapshot.isDraggingOver,
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
          <button className="btn tertiary">Submit Course</button>
        </div>

        <Typography variant="subtitle3">Modules Available</Typography>

        <Droppable droppableId="all-modules" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={clsx(
                'flex flex-wrap mt-2 mb-3 -m-2 transition-colors ease-in-out',
                {
                  'bg-lime-100': snapshot.isDraggingOver,
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
