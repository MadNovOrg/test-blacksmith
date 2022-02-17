import React, { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  DragDropContext,
  DragDropContextProps,
  Droppable,
} from 'react-beautiful-dnd'
import clsx from 'clsx'

import Spinner from '@app/components/Spinner'

import { ModuleCard } from './ModuleCard'

import { ModuleGroup } from '@app/types'
import {
  QUERY as GetModuleGroups,
  ResponseType as GetModuleGroupsResponseType,
  ParamsType as GetModuleGroupsParamsType,
} from '@app/queries/modules/get-module-groups'
import { ModuleSlot } from '@app/pages/TrainerBase/components/Course/components/ModuleSlot'

type CourseViewProps = unknown

type AvailableModule = ModuleGroup & {
  used?: boolean
  draggableId: string
}

type ModuleSlot = {
  module?: ModuleGroup
  droppableId: string
  draggableId: string
}

export const CourseView: React.FC<CourseViewProps> = () => {
  // @TODO - we could/should be able to identify the level early based on course type etc
  const { data } = useSWR<
    GetModuleGroupsResponseType,
    Error,
    [string, GetModuleGroupsParamsType]
  >([GetModuleGroups, { level: 1 }])

  const [availableModules, setAvailableModules] = useState<AvailableModule[]>(
    []
  )
  const [courseModuleSlots, setCourseModuleSlots] = useState<ModuleSlot[]>([])

  useEffect(() => {
    if (availableModules.length === 0 && data) {
      setAvailableModules(
        data.groups.map(module => ({
          ...module,
          draggableId: `all-modules-${module.id}`,
        }))
      )
      setCourseModuleSlots(
        data.groups.map((_, i) => ({
          droppableId: `course-modules-slot-drop-${i}`,
          draggableId: `course-modules-slot-drag-${i}`,
        }))
      )
    }
  }, [availableModules, data])

  const handleDrop = useCallback<DragDropContextProps['onDragEnd']>(
    result => {
      const { draggableId, source, destination } = result
      if (!data || !destination) return

      if (destination.droppableId === source.droppableId) {
        return
      }

      function setModuleUsage(moduleId: string, used: boolean) {
        setAvailableModules(prevState =>
          prevState.map(module => {
            return {
              ...module,
              used: module.id === moduleId ? used : module.used,
            }
          })
        )
      }

      if (source.droppableId.startsWith('course-modules')) {
        if (destination.droppableId.startsWith('course-modules')) {
          // move module between slots
          const draggedSlot = courseModuleSlots.find(
            module => draggableId === module.draggableId
          )
          const draggedModule = draggedSlot?.module
          setCourseModuleSlots(prevState =>
            prevState.map(slot => {
              if (destination.droppableId === slot.droppableId) {
                if (slot.module) {
                  setModuleUsage(slot.module.id, false)
                }
                slot.module = draggedModule
              } else if (source.droppableId === slot.droppableId) {
                slot.module = undefined
              }
              return slot
            })
          )
        } else {
          // remove module from course
          const draggedSlot = courseModuleSlots.find(
            module => draggableId === module.draggableId
          )
          const draggedModule = draggedSlot?.module
          if (!draggedModule) return
          setCourseModuleSlots(prevState =>
            prevState.map(slot => ({
              ...slot,
              module:
                slot.draggableId === draggableId ? undefined : slot.module,
            }))
          )
          setModuleUsage(draggedModule.id, false)
        }
      } else if (destination.droppableId.startsWith('course-modules')) {
        // add module to course
        const draggedModule = availableModules.find(
          module => draggableId === module.draggableId
        )
        if (!draggedModule) return
        setCourseModuleSlots(prevState =>
          prevState.map(slot => {
            if (destination.droppableId === slot.droppableId) {
              if (slot.module) {
                setModuleUsage(slot.module.id, false)
              }
              slot.module = draggedModule
            }
            return slot
          })
        )
        setModuleUsage(draggedModule.id, true)
      }
    },
    [availableModules, courseModuleSlots, data]
  )

  if (!data) {
    return <Spinner cls="w-16 h-16" />
  }

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <div className="pb-12">
        <div className="font-light text-2xl sm:text-4xl mb-4">Level Two</div>

        <div className="grid grid-cols-3 lg:grid-cols-8 gap-y-8 lg:pt-8">
          <div className="col-span-3 lg:col-span-8 lg:col-start-1 lg:col-span-3 lg:col-end-4">
            <div className="text-sm">
              To meet the acceptance criteria, this course must contain tier 1
              (green) and two tier 2 (yellow) modules. Drag and drop modules in
              the area provided below and submit when complete.
            </div>
          </div>
          <div className="col-span-3 lg:col-span-8 lg:col-start-5 lg:col-span-4 lg:col-end-9 flex flex-col lg:items-end text-sm">
            <div>
              <b>Location: </b>Birchwood Academy, Wrotham, Kent
            </div>
            <div>
              <b>Starts: </b>20/01/22 09:00
            </div>
            <div>
              <b>Course Type: </b>Blended
            </div>
          </div>
          <div className="lg:col-start-1 lg:col-span-3 lg:col-end-4">
            <div className="text-sm lg:text-base">Modules Available</div>

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
                  {availableModules.map((m, index) => (
                    <ModuleCard
                      key={m.id}
                      index={index}
                      data={m}
                      isDragDisabled={m.used}
                      draggableId={m.draggableId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="col-start-2 col-span-2 col-end-4 lg:col-start-5 lg:col-span-4 lg:col-end-9">
            <div className="text-sm lg:text-base">My Course</div>

            <div className="flex flex-wrap mt-2 mb-3 -m-2 transition-colors ease-in-out">
              {courseModuleSlots.map(slot => (
                <ModuleSlot
                  key={slot.droppableId}
                  module={slot.module}
                  droppableId={slot.droppableId}
                  draggableId={slot.draggableId}
                />
              ))}
            </div>

            <div className="flex items-center justify-end mb-3">
              <button className="btn tertiary">Submit Course</button>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}
