import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Spinner from '@app/components/Spinner'
import ProgressBar from '@app/components/ProgressBar'

import { COURSE_COLOR_BY_LEVEL } from '../CourseColorScheme'

import { ModuleCard } from './ModuleCard'

import { CourseLevel, ModuleGroup } from '@app/types'
import {
  ParamsType as GetModuleGroupsParamsType,
  QUERY as GetModuleGroups,
  ResponseType as GetModuleGroupsResponseType,
} from '@app/queries/modules/get-module-groups'
import {
  ParamsType as GetCourseByIdParamsType,
  QUERY as GetCourseById,
  ResponseType as GetCourseByIdResponseType,
} from '@app/queries/courses/get-course-by-id'
import { ModuleSlot } from '@app/pages/TrainerBase/components/Course/components/ModuleSlot'
import {
  AvailableModule,
  ModuleGroupSlot,
} from '@app/pages/TrainerBase/components/Course'
import { formatDurationShort, getPercentage } from '@app/util'
import { CourseHero } from '@app/pages/TrainerBase/components/Course/components/CourseHero'

type CourseViewProps = unknown

const MAX_COURSE_DURATION_MAP = {
  normal: {
    [CourseLevel.LEVEL_1]: 6 * 60, // 1 training day
    [CourseLevel.LEVEL_2]: 2 * 6 * 60, // 2 training days
    [CourseLevel.INTERMEDIATE]: 5 * 6 * 60, // 5 training days
    [CourseLevel.ADVANCED]: 4 * 6 * 60, // 4 training days
  },
  reaccreditation: {
    [CourseLevel.LEVEL_1]: 6 * 60, // 1 training day
    [CourseLevel.LEVEL_2]: 6 * 60, // 1 training day
    [CourseLevel.INTERMEDIATE]: 2 * 6 * 60, // 2 training days
    [CourseLevel.ADVANCED]: 3 * 6 * 60, // 3 training days
  },
}

export const CourseView: React.FC<CourseViewProps> = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const [mandatoryModules, setMandatoryModules] = useState<ModuleGroup[]>([])
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>(
    []
  )
  const [courseModuleSlots, setCourseModuleSlots] = useState<ModuleGroupSlot[]>(
    []
  )

  const { data: courseData, error: courseDataError } = useSWR<
    GetCourseByIdResponseType,
    Error,
    [string, GetCourseByIdParamsType] | null
  >(courseId ? [GetCourseById, { id: courseId }] : null)
  const { data, error: moduleDataError } = useSWR<
    GetModuleGroupsResponseType,
    Error,
    [string, GetModuleGroupsParamsType] | null
  >(
    courseData
      ? [
          GetModuleGroups,
          {
            level: CourseLevel.LEVEL_1,
            courseDeliveryType: courseData?.course.deliveryType,
            reaccreditation: courseData?.course.reaccreditation,
          },
        ]
      : null
  )

  const estimatedCourseDuration = useMemo(() => {
    if (!mandatoryModules || !courseModuleSlots) return 0
    const selectedModules = courseModuleSlots.flatMap(slot => slot.module ?? [])
    return [...mandatoryModules, ...selectedModules].reduce(
      (sum, module) => sum + (module?.duration?.aggregate.sum.duration ?? 0),
      0
    )
  }, [courseModuleSlots, mandatoryModules])

  const maxDuration = useMemo(() => {
    const course = courseData?.course
    return course
      ? MAX_COURSE_DURATION_MAP[
          course.reaccreditation ? 'reaccreditation' : 'normal'
        ][course.level]
      : 0
  }, [courseData])

  useEffect(() => {
    if (availableModules.length === 0 && data) {
      const modules = {
        mandatory: [] as ModuleGroup[],
        nonMandatory: [] as ModuleGroup[],
      }
      data.groups.forEach(group =>
        modules[group.mandatory ? 'mandatory' : 'nonMandatory'].push(group)
      )
      setMandatoryModules(modules.mandatory)
      setAvailableModules(
        modules.nonMandatory.map(module => ({
          ...module,
          draggableId: `all-modules-${module.id}`,
        }))
      )
      setCourseModuleSlots(
        modules.nonMandatory.map((_, i) => ({
          droppableId: `course-modules-slot-drop-${i}`,
          draggableId: `course-modules-slot-drag-${i}`,
        }))
      )
    }
  }, [availableModules, mandatoryModules, data])

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

  function getModuleCardColors(module: ModuleGroup) {
    return COURSE_COLOR_BY_LEVEL[module.level]
  }

  return (
    <DragDropContext onDragEnd={handleDrop}>
      {(courseDataError || moduleDataError) && (
        <div className="border-red/20 border rounded bg-red/10 text-red/80 font-bold p-2">
          {t('common.internal-error')}
        </div>
      )}
      {!data && !courseDataError && !moduleDataError && (
        <Spinner cls="w-16 h-16" />
      )}
      {data && courseData && (
        <div className="pb-12">
          <p className="font-light text-2xl sm:text-4xl mb-4">
            {courseData.course.name}
          </p>

          <div className="grid grid-cols-3 lg:grid-cols-8 gap-y-8 lg:pt-8">
            <div className="col-span-3 lg:col-span-8 lg:col-start-1 lg:col-end-4">
              <p className="text-sm">
                {t('pages.trainer-base.create-course.new-course.description', {
                  duration: maxDuration,
                })}
              </p>
            </div>
            <CourseHero
              className="col-span-3 lg:col-span-8 lg:col-start-5 lg:col-end-9 lg:items-end"
              data={courseData.course}
            />
            <div className="lg:col-start-1 lg:col-span-3 lg:col-end-4">
              <p className="text-sm lg:text-base">
                {t(
                  'pages.trainer-base.create-course.new-course.modules-available'
                )}
              </p>

              <Droppable droppableId="all-modules" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    className={clsx(
                      'flex flex-wrap mt-10 mb-3 -m-2 transition-colors ease-in-out',
                      {
                        'bg-lime-100': snapshot.isDraggingOver,
                      }
                    )}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {availableModules.map((m, index) => (
                      <Draggable
                        key={m.id}
                        draggableId={m.draggableId}
                        index={index}
                        isDragDisabled={m.used}
                      >
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef}>
                            <ModuleCard
                              key={m.id}
                              data={m}
                              className={clsx(
                                m.used
                                  ? getModuleCardColors(m).disabledColor
                                  : snapshot.isDragging
                                  ? getModuleCardColors(m).draggingColor
                                  : getModuleCardColors(m).color
                              )}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="col-start-2 col-span-2 col-end-4 lg:col-start-5 lg:col-span-4 lg:col-end-9">
              <p className="text-sm lg:text-base">
                {t('pages.trainer-base.create-course.new-course.my-course')}
              </p>

              <div className="flex flex-wrap mt-2 mb-3 -m-2 transition-colors ease-in-out">
                {mandatoryModules.length ? (
                  <div>
                    <p className="text-xs m-2">
                      {t(
                        'pages.trainer-base.create-course.new-course.mandatory-modules'
                      )}
                    </p>
                    <div className="flex flex-wrap border border-dashed rounded-lg border-navy-500">
                      {mandatoryModules.map(m => (
                        <ModuleCard
                          key={m.id}
                          data={m}
                          className={getModuleCardColors(m).color}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                {courseModuleSlots.map(slot => (
                  <ModuleSlot
                    key={slot.droppableId}
                    module={slot.module}
                    droppableId={slot.droppableId}
                    draggableId={slot.draggableId}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-end mb-3">
                <div>
                  {t(
                    'pages.trainer-base.create-course.new-course.estimated-duration'
                  )}
                  :{' '}
                  <ProgressBar
                    className="relative"
                    percentage={getPercentage(
                      estimatedCourseDuration,
                      maxDuration
                    )}
                    label={formatDurationShort(estimatedCourseDuration)}
                  />
                </div>
                <button
                  className="btn tertiary"
                  disabled={
                    getPercentage(estimatedCourseDuration, maxDuration) > 100
                  }
                >
                  {t(
                    'pages.trainer-base.create-course.new-course.submit-course'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  )
}
