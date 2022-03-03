import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material'

import ProgressBar from '@app/components/ProgressBar'

import { useFetcher } from '@app/hooks/use-fetcher'

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
import { MUTATION as SaveCourseModules } from '@app/queries/courses/save-course-modules'
import { MUTATION as SubmitCourse } from '@app/queries/courses/submit-course'
import { ModuleSlot } from '@app/pages/TrainerBase/components/Course/components/ModuleSlot'
import {
  AvailableModule,
  ModuleGroupSlot,
} from '@app/pages/TrainerBase/components/Course'
import { formatDurationShort, getPercentage } from '@app/util'
import { CourseHero } from '@app/pages/TrainerBase/components/Course/components/CourseHero'
import { COURSE_COLOR } from '@app/pages/TrainerBase/components/Course/CourseColorScheme'

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
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const theme = useTheme()

  const [submitError, setSubmitError] = useState<string>()
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
    courseData?.course
      ? [
          GetModuleGroups,
          {
            level: courseData?.course.level,
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

  const onCourseSubmit = async () => {
    setSubmitError(undefined)
    try {
      const moduleGroups = [
        ...mandatoryModules,
        ...courseModuleSlots.flatMap(slot => slot.module || []),
      ]
      await fetcher(SaveCourseModules, {
        courseId: courseData?.course.id,
        modules: moduleGroups.flatMap(moduleGroup =>
          moduleGroup.modules.map(module => ({
            courseId: courseData?.course.id,
            moduleId: module.id,
          }))
        ),
      })
      // TODO redirect to course details page when available
      navigate({
        pathname: '/trainer-base/course',
      })
      await fetcher(SubmitCourse, { id: courseData?.course.id })
    } catch (e: unknown) {
      setSubmitError((e as Error).message)
    }
  }

  function getModuleCardColor(
    module: AvailableModule | ModuleGroup,
    isDragging: boolean
  ) {
    const color = theme.colors[COURSE_COLOR[module.level]]
    if ('used' in module) {
      return module.used ? color[200] : isDragging ? color[600] : color[500]
    }
    return color[500]
  }

  const onClearCourse = async () => {
    setAvailableModules(prevState =>
      prevState.map(module => ({
        ...module,
        used: false,
      }))
    )
    setCourseModuleSlots(prevState =>
      prevState.map(slot => ({
        ...slot,
        module: undefined,
      }))
    )
  }

  return (
    <DragDropContext onDragEnd={handleDrop}>
      {(courseDataError || moduleDataError) && (
        <Alert severity="error" variant="filled">
          {t('internal-error')}
        </Alert>
      )}
      {!data && !courseDataError && !moduleDataError && (
        <Box display="flex" margin="auto">
          <CircularProgress sx={{ m: 'auto' }} size={64} />
        </Box>
      )}
      {data && courseData?.course && (
        <Box
          pb={6}
          margin="auto"
          maxWidth={{
            xs: '340px',
            md: '1040px',
          }}
        >
          <Typography variant="h2">{courseData.course.name}</Typography>

          {submitError && (
            <Alert severity="error" variant="filled">
              {submitError}
            </Alert>
          )}

          <Box
            mt={{ xs: 2, md: 3 }}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3, 1fr)',
                md: 'repeat(8, 1fr)',
              },
              columnGap: 4,
              rowGap: {
                xs: 3,
                md: 4,
              },
            }}
          >
            <Box gridColumn="1 / 4">
              <Typography variant="body2">
                {t('pages.trainer-base.create-course.new-course.description', {
                  duration: maxDuration ? maxDuration / 60 : 0,
                })}
              </Typography>
            </Box>
            <Box gridColumn={{ xs: 'span 3', md: '5 / 9' }}>
              <CourseHero data={courseData.course} />
            </Box>

            {getPercentage(estimatedCourseDuration, maxDuration) > 100 && (
              <Box gridColumn={{ xs: 'span 3', md: 'span 8' }}>
                <Alert severity="error" variant="filled">
                  {t(
                    'pages.trainer-base.create-course.new-course.duration-exceeded'
                  )}
                </Alert>
              </Box>
            )}

            <Box gridColumn={{ xs: 'span 1', md: '1 / 4' }}>
              <Typography variant="h3">
                {t(
                  'pages.trainer-base.create-course.new-course.modules-available'
                )}
              </Typography>

              <Droppable droppableId="all-modules" direction="horizontal">
                {(provided, snapshot) => (
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    mt={{
                      xs: 2,
                      md: 4,
                    }}
                    mx={-1}
                    bgcolor={
                      snapshot.isDraggingOver ? theme.colors.lime[100] : ''
                    }
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
                              bgColor={
                                getModuleCardColor(m, snapshot.isDragging) ?? ''
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
            <Box gridColumn={{ xs: '2 / 4', md: '5 / 9' }}>
              <Typography variant="h3" px={1}>
                {t('pages.trainer-base.create-course.new-course.my-course')}
              </Typography>

              <Box
                display="flex"
                flexDirection="row-reverse"
                flexWrap="wrap"
                my={2}
                mx={-1}
              >
                {mandatoryModules.length ? (
                  <Box>
                    <Typography fontSize="10px" mx={1}>
                      {t(
                        'pages.trainer-base.create-course.new-course.mandatory-modules'
                      )}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row-reverse',
                        border: 1,
                        borderStyle: 'dashed',
                        borderRadius: '0.5rem',
                        borderColor: theme.colors.navy[500],
                      }}
                    >
                      {mandatoryModules.map(m => (
                        <ModuleCard
                          key={m.id}
                          data={m}
                          bgColor={getModuleCardColor(m, false) ?? ''}
                        />
                      ))}
                    </Box>
                  </Box>
                ) : null}
                {courseModuleSlots.map(slot => (
                  <ModuleSlot
                    key={slot.droppableId}
                    module={slot.module}
                    droppableId={slot.droppableId}
                    draggableId={slot.draggableId}
                  />
                ))}
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  },
                  columnGap: 4,
                  rowGap: 1,
                  mb: 1,
                  alignItems: 'center',
                  justifyContent: 'end',
                }}
              >
                <div>
                  {t(
                    'pages.trainer-base.create-course.new-course.estimated-duration'
                  )}
                  :{' '}
                  <ProgressBar
                    percentage={getPercentage(
                      estimatedCourseDuration,
                      maxDuration
                    )}
                    label={formatDurationShort(estimatedCourseDuration)}
                  />
                </div>
                <Button
                  variant="outlined"
                  onClick={onCourseSubmit}
                  disabled={
                    getPercentage(estimatedCourseDuration, maxDuration) > 100 ||
                    (!courseModuleSlots?.filter(slot => !!slot.module).length &&
                      !mandatoryModules?.length)
                  }
                >
                  {t(
                    'pages.trainer-base.create-course.new-course.submit-course'
                  )}
                </Button>
                {courseModuleSlots.find(slot => !!slot.module) && (
                  <Button
                    sx={{
                      gridColumn: {
                        xs: '1 / 2',
                        md: '2 / 3',
                      },
                    }}
                    variant="outlined"
                    color="warning"
                    onClick={onClearCourse}
                  >
                    {t('clear')}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </DragDropContext>
  )
}
