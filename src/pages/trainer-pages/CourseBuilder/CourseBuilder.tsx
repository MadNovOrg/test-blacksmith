import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { BackButton } from '@app/components/BackButton'
import { CourseStatusChip } from '@app/components/CourseStatusChip'
import ProgressBar from '@app/components/ProgressBar'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Status_Enum,
  Course_Trainer_Type_Enum,
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
  ModuleGroupsQuery,
  ModuleGroupsQueryVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { NotFound } from '@app/pages/common/NotFound'
import { CourseExceptionsConfirmation } from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation'
import {
  checkCourseDetailsForExceptions,
  CourseException,
} from '@app/pages/CreateCourse/components/CourseExceptionsConfirmation/utils'
import { FINALIZE_COURSE_BUILDER_MUTATION } from '@app/queries/courses/finalize-course-builder'
import { QUERY as GetCourseById } from '@app/queries/courses/get-course-by-id'
import { MUTATION as SaveCourseModules } from '@app/queries/courses/save-course-modules'
import { MUTATION as SetCourseStatus } from '@app/queries/courses/set-course-status'
import { QUERY as GetModuleGroups } from '@app/queries/modules/get-module-groups'
import { CourseLevel, TrainerRoleTypeName } from '@app/types'
import {
  formatDateForDraft,
  formatDurationShort,
  getPercentage,
  getSWRLoadingStatus,
  LoadingStatus,
} from '@app/util'

import { CourseHero } from './components/CourseHero'
import { ModuleCard } from './components/ModuleCard'
import { ModuleSlot } from './components/ModuleSlot'
import { AvailableModule, ModuleGroup, ModuleGroupSlot } from './types'

type CourseBuilderProps = unknown

const MAX_COURSE_DURATION_MAP = {
  normal: {
    [CourseLevel.Level_1]: 6 * 60, // 1 training day
    [CourseLevel.Level_2]: 2 * 6 * 60, // 2 training days
    [CourseLevel.IntermediateTrainer]: 5 * 6 * 60, // 5 training days
    [CourseLevel.BildActTrainer]: 5 * 6 * 60, // 5 training days
    [CourseLevel.AdvancedTrainer]: 5 * 6 * 60, // 5 training days
    [CourseLevel.Advanced]: 4 * 6 * 60, // 4 training days
    [CourseLevel.BildAct]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
  },
  reaccreditation: {
    [CourseLevel.Level_1]: 6 * 60, // 1 training day
    [CourseLevel.Level_2]: 6 * 60, // 1 training day
    [CourseLevel.IntermediateTrainer]: 2 * 6 * 60, // 2 training days
    [CourseLevel.BildActTrainer]: 2 * 6 * 60, // 2 training days
    [CourseLevel.AdvancedTrainer]: 2 * 6 * 60, // 2 training days
    [CourseLevel.Advanced]: 3 * 6 * 60, // 3 training days
    [CourseLevel.BildAct]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
  },
}

export const CourseBuilder: React.FC<CourseBuilderProps> = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const theme = useTheme()

  const { acl } = useAuth()

  const [courseExceptions, setCourseExceptions] = useState<CourseException[]>(
    []
  )
  const [submitError, setSubmitError] = useState<string>()
  const [mandatoryModules, setMandatoryModules] = useState<ModuleGroup[]>([])
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>(
    []
  )
  const [courseModuleSlots, setCourseModuleSlots] = useState<ModuleGroupSlot[]>(
    []
  )

  const {
    data: courseData,
    error: courseDataError,
    mutate: mutateCourse,
  } = useSWR<
    GetCourseByIdQuery,
    Error,
    [string, GetCourseByIdQueryVariables] | null
  >(courseId ? [GetCourseById, { id: Number(courseId) }] : null)

  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseDataError)

  const { data: modulesDataResponse, error: moduleDataError } = useSWR<
    ModuleGroupsQuery,
    Error,
    [string, ModuleGroupsQueryVariables] | null
  >(
    courseData?.course
      ? [
          GetModuleGroups,
          {
            level: courseData?.course.level ?? Course_Level_Enum.Level_1,
            courseDeliveryType:
              courseData?.course.deliveryType ?? Course_Delivery_Type_Enum.F2F,
            reaccreditation: courseData?.course.reaccreditation ?? false,
            go1Integration: courseData?.course.go1Integration ?? false,
          },
        ]
      : null
  )

  const modulesData = useMemo(
    () =>
      modulesDataResponse?.groups.filter(
        group => (group?.duration?.aggregate?.sum?.duration ?? 0) > 0
      ),
    [modulesDataResponse]
  )

  const modulesLoadingStatus = getSWRLoadingStatus(modulesData, moduleDataError)

  const estimatedCourseDuration = useMemo(() => {
    if (!mandatoryModules || !courseModuleSlots) return 0
    const selectedModules = courseModuleSlots.flatMap(slot => slot.module ?? [])
    return [...mandatoryModules, ...selectedModules].reduce(
      (sum, module) => sum + (module?.duration?.aggregate?.sum?.duration ?? 0),
      0
    )
  }, [courseModuleSlots, mandatoryModules])

  const maxDuration = useMemo(() => {
    const course = courseData?.course
    return course
      ? MAX_COURSE_DURATION_MAP[
          course.reaccreditation ? 'reaccreditation' : 'normal'
        ][course.level ?? Course_Level_Enum.Level_1]
      : 0
  }, [courseData])

  const saveModules = useCallback(
    async (modules: ModuleGroup[]) => {
      const course = courseData?.course
      if (!course) return

      const mappedModules = modules.flatMap(moduleGroup =>
        moduleGroup.modules.map(module => ({
          courseId: course.id,
          moduleId: module.id,
        }))
      )
      if (modules.length) {
        await fetcher(SaveCourseModules, {
          courseId: course.id,
          modules: mappedModules,
        })
        await mutateCourse()
      }
    },
    [courseData, fetcher, mutateCourse]
  )

  useEffect(() => {
    if (availableModules.length === 0 && modulesData && courseData) {
      const addedModuleGroupIds = new Set<string>(
        courseData.course?.moduleGroupIds.map(
          courseModule => courseModule.module.moduleGroup?.id
        )
      )
      const modules = {
        mandatory: [] as ModuleGroup[],
        nonMandatory: [] as ModuleGroup[],
      }
      modulesData.forEach(group =>
        modules[group.mandatory ? 'mandatory' : 'nonMandatory'].push(group)
      )
      setMandatoryModules(modules.mandatory)
      setAvailableModules(
        modules.nonMandatory.map(module => ({
          ...module,
          draggableId: `all-modules-${module.id}`,
          used: addedModuleGroupIds.has(module.id),
        }))
      )
      const addedModuleGroups = [...addedModuleGroupIds]
        .map(id => modules.nonMandatory.find(m => m.id === id))
        .filter(Boolean)
      setCourseModuleSlots(
        modules.nonMandatory.map((_, i) => ({
          module:
            i < addedModuleGroups.length ? addedModuleGroups[i] : undefined,
          droppableId: `course-modules-slot-drop-${i}`,
          draggableId: `course-modules-slot-drag-${i}`,
        }))
      )
      if (!courseData.course?.moduleGroupIds.length) {
        saveModules(modules.mandatory)
      }
    }
  }, [availableModules, mandatoryModules, modulesData, courseData, saveModules])

  const handleDrop = useCallback<DragDropContextProps['onDragEnd']>(
    async result => {
      const { draggableId, source, destination } = result
      if (!modulesData || !destination) return

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

      async function saveCourseModules(moduleGroups: ModuleGroup[]) {
        if (courseData?.course) {
          const courseId = courseData.course.id
          await fetcher(SaveCourseModules, {
            courseId: courseId,
            modules: moduleGroups.flatMap(moduleGroup =>
              moduleGroup.modules.map(module => ({
                courseId: courseId,
                moduleId: module.id,
              }))
            ),
          })
          await fetcher(SetCourseStatus, {
            id: courseData.course.id,
            status: Course_Status_Enum.Draft,
          })
          await mutateCourse()
        }
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
          await saveCourseModules([
            ...mandatoryModules,
            ...courseModuleSlots.flatMap(slot =>
              slot.module && slot.draggableId !== draggableId ? slot.module : []
            ),
          ])
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
        await saveCourseModules([
          ...mandatoryModules,
          ...courseModuleSlots.flatMap(slot => slot.module ?? []),
          draggedModule,
        ])
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
    [
      availableModules,
      courseData,
      courseModuleSlots,
      modulesData,
      fetcher,
      mandatoryModules,
      mutateCourse,
    ]
  )

  const submitCourse = useCallback(async () => {
    if (courseData?.course) {
      setSubmitError(undefined)
      const hasExceptions = courseExceptions.length > 0
      try {
        await fetcher(FINALIZE_COURSE_BUILDER_MUTATION, {
          id: courseData.course.id,
          duration: estimatedCourseDuration,
          status: hasExceptions
            ? Course_Status_Enum.ExceptionsApprovalPending
            : Course_Status_Enum.Scheduled,
        })
        navigate(hasExceptions ? '/' : '../details?success=course_submitted')
      } catch (e: unknown) {
        setSubmitError((e as Error).message)
      }
    }
  }, [courseData, courseExceptions, estimatedCourseDuration, fetcher, navigate])

  const onCourseSubmit = useCallback(async () => {
    if (!courseData?.course) return

    if (!acl.isTTAdmin()) {
      const leader = courseData.course.trainers.find(
        c => c.type === Course_Trainer_Type_Enum.Leader
      )
      const exceptions = checkCourseDetailsForExceptions(
        {
          startDateTime: new Date(
            courseData.course.dates?.aggregate?.start?.date
          ),
          courseLevel: courseData.course.level,
          maxParticipants: courseData.course.max_participants,
          modulesDuration: estimatedCourseDuration,
          type: courseData.course.type,
          deliveryType: courseData.course.deliveryType,
          reaccreditation: courseData.course.reaccreditation ?? false,
        },
        courseData.course.trainers.map(t => ({
          type: t.type,
          levels: t.profile.certificates.map(c => ({
            courseLevel: c.courseLevel as CourseLevel,
            expiryDate: c.expiryDate,
          })),
        })),
        (leader &&
          leader.profile.trainer_role_types.some(
            ({ trainer_role_type: role }) =>
              role.name === TrainerRoleTypeName.SENIOR ||
              role.name === TrainerRoleTypeName.PRINCIPAL
          )) ??
          false
      )
      setCourseExceptions(exceptions)
      if (exceptions.length > 0) return
    }
    await submitCourse()
  }, [acl, courseData, estimatedCourseDuration, submitCourse])

  function getModuleCardColor(
    module: AvailableModule | ModuleGroup,
    isDragging: boolean
  ) {
    const color = theme.colors[module.color]
    if ('used' in module) {
      return module.used ? color[200] : isDragging ? color[600] : color[500]
    }
    return color[500]
  }

  const onClearCourse = async () => {
    if (courseData?.course) {
      const courseId = courseData.course.id
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
      await fetcher(SaveCourseModules, {
        courseId: courseId,
        modules: mandatoryModules.flatMap(moduleGroup =>
          moduleGroup.modules.map(module => ({
            courseId: courseId,
            moduleId: module.id,
          }))
        ),
      })
      await fetcher(SetCourseStatus, {
        id: courseData.course.id,
        status: Course_Status_Enum.Draft,
      })
      await mutateCourse()
    }
  }

  if (courseLoadingStatus === LoadingStatus.SUCCESS && !courseData?.course) {
    return (
      <NotFound
        title="Ooops!"
        description={t('common.errors.course-not-found')}
      />
    )
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDrop}>
        {(courseLoadingStatus === LoadingStatus.ERROR ||
          modulesLoadingStatus === LoadingStatus.ERROR) && (
          <Alert severity="error" variant="filled">
            {t('internal-error')}
          </Alert>
        )}
        {courseLoadingStatus === LoadingStatus.FETCHING ||
          (modulesLoadingStatus === LoadingStatus.FETCHING && (
            <Box display="flex" margin="auto">
              <CircularProgress sx={{ m: 'auto' }} size={64} />
            </Box>
          ))}

        {modulesData && courseData?.course && (
          <Box
            pt={{ xs: 6, md: 10 }}
            pb={6}
            margin="auto"
            maxWidth={{
              xs: '340px',
              md: '1040px',
            }}
          >
            <BackButton
              label={t('pages.course-participants.back-button')}
              to="../.."
            />
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
                columnGap: { xs: 2, md: 4 },
                rowGap: { xs: 3, md: 4 },
              }}
            >
              <Box gridColumn="1 / 4">
                {courseData?.course?.status === Course_Status_Enum.Draft && (
                  <Box
                    sx={{ display: 'flex', alignItems: 'center' }}
                    mb={{ xs: 2, md: 3 }}
                  >
                    <CourseStatusChip status={courseData.course.status} />

                    <Typography variant="body2" data-testid="draft-text">
                      {t('common.last-modified', {
                        date: formatDateForDraft(
                          courseData.course.updatedAt || new Date(),
                          t('common.ago'),
                          t
                        ),
                      })}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2">
                  {t(
                    'pages.trainer-base.create-course.new-course.description',
                    {
                      duration: maxDuration ? maxDuration / 60 : 0,
                    }
                  )}
                </Typography>
              </Box>
              <Box
                gridColumn={{ xs: 'span 3', md: '5 / 9' }}
                data-testid="course-info"
              >
                <CourseHero data={courseData.course} />
              </Box>

              <Box gridColumn={{ xs: 'span 1', md: '1 / 4' }}>
                <Typography variant="h3">
                  {t(
                    'pages.trainer-base.create-course.new-course.modules-available'
                  )}
                </Typography>

                <Droppable droppableId="all-modules" direction="horizontal">
                  {(provided, snapshot) => (
                    <Box
                      data-testid="all-modules"
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
                                  getModuleCardColor(m, snapshot.isDragging) ??
                                  ''
                                }
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                data-testid="module-card"
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
                  my={{ xs: 4, md: 2 }}
                  mx={-1}
                  data-testid="course-modules"
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
                {courseData?.course?.level === Course_Level_Enum.Level_1 && (
                  <Box mb={{ xs: 4, md: 2 }}>
                    <Alert severity="info">
                      {t(
                        'pages.trainer-base.create-course.new-course.course-level-one-info'
                      )}
                    </Alert>
                  </Box>
                )}
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
                      !courseModuleSlots?.filter(slot => !!slot.module)
                        .length && !mandatoryModules?.length
                    }
                    data-testid="submit-button"
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
                      data-testid="clear-button"
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
      <CourseExceptionsConfirmation
        open={courseExceptions.length > 0}
        onCancel={() => setCourseExceptions([])}
        onSubmit={submitCourse}
        exceptions={courseExceptions}
      />
    </>
  )
}
