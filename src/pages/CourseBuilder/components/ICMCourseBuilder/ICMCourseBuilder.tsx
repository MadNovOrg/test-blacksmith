import { Alert, Box, CircularProgress, Container, Link } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { ConfirmDialog } from '@app/components/dialogs'
import { useSnackbar } from '@app/context/snackbar'
import {
  Color_Enum,
  CourseToBuildQuery,
  CourseToBuildQueryVariables,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  FinalizeCourseBuilderMutation,
  FinalizeCourseBuilderMutationVariables,
  ModuleGroupsQuery,
  ModuleGroupsQueryVariables,
  SaveCourseModulesMutation,
  SaveCourseModulesMutationVariables,
  SetCourseAsDraftMutation,
  SetCourseAsDraftMutationVariables,
} from '@app/generated/graphql'
import { NotFound } from '@app/pages/common/NotFound'
import { FINALIZE_COURSE_BUILDER_MUTATION } from '@app/queries/courses/finalize-course-builder'
import { MUTATION as SaveCourseModules } from '@app/queries/courses/save-course-modules'
import { QUERY as GetModuleGroups } from '@app/queries/modules/get-module-groups'
import { CourseLevel } from '@app/types'
import { isNotNullish } from '@app/util'

import { Hero } from '../Hero/Hero'

import GroupsSelection, {
  CallbackFn,
} from './components/GroupsSelection/GroupsSelection'
import { getMinimumTimeCommitment } from './helpers'
import { COURSE_QUERY, SET_COURSE_AS_DRAFT } from './queries'

type CourseBuilderProps = unknown & { editMode?: boolean }

const courseBuilderWarning: Partial<Record<Course_Level_Enum, string>> = {
  [Course_Level_Enum.Level_1]: 'course-l1-info',
  [Course_Level_Enum.Level_2]: 'course-l2-info',
  [Course_Level_Enum.Advanced]: 'course-adv-info',
}

export const MAX_COURSE_DURATION_MAP = {
  normal: {
    [CourseLevel.Level_1]: 6 * 60, // 1 training day
    [CourseLevel.Level_2]: 2 * 6 * 60, // 2 training days
    [CourseLevel.IntermediateTrainer]: 5 * 6 * 60, // 5 training days
    [CourseLevel.BildRegular]: 5 * 6 * 60, // 5 training days
    [CourseLevel.AdvancedTrainer]: 5 * 6 * 60, // 5 training days
    [CourseLevel.Advanced]: 6 * 60, // 1 training day
    [CourseLevel.BildIntermediateTrainer]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
    [CourseLevel.BildAdvancedTrainer]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
  },
  reaccreditation: {
    [CourseLevel.Level_1]: 6 * 60, // 1 training day
    [CourseLevel.Level_2]: 6 * 60, // 1 training day
    [CourseLevel.IntermediateTrainer]: 2 * 6 * 60, // 2 training days
    [CourseLevel.BildRegular]: 2 * 6 * 60, // 2 training days
    [CourseLevel.AdvancedTrainer]: 2 * 6 * 60, // 2 training days
    [CourseLevel.Advanced]: 3 * 6 * 60, // 3 training days
    [CourseLevel.BildIntermediateTrainer]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
    [CourseLevel.BildAdvancedTrainer]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
  },
}

export const ICMCourseBuilder: React.FC<
  React.PropsWithChildren<CourseBuilderProps>
> = ({ editMode }) => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const navigate = useNavigate()
  const [isTimeCommitmentModalOpen, setIsTimeCommitmentModalOpen] =
    useState(false)

  const { addSnackbarMessage, getSnackbarMessage } = useSnackbar()
  const courseCreated = Boolean(getSnackbarMessage('course-created'))

  const [{ data: courseData, fetching: fetchingCourse, error: courseError }] =
    useQuery<CourseToBuildQuery, CourseToBuildQueryVariables>({
      query: COURSE_QUERY,
      variables: courseId
        ? { id: Number(courseId), withModules: true }
        : undefined,
      requestPolicy: 'cache-and-network',
    })

  const [
    {
      data: moduleGroupsData,
      error: moduleGroupsError,
      fetching: fetchingModuleGroups,
    },
  ] = useQuery<ModuleGroupsQuery, ModuleGroupsQueryVariables>({
    query: GetModuleGroups,
    variables: courseData?.course
      ? {
          level: courseData?.course.level ?? Course_Level_Enum.Level_1,
          courseDeliveryType:
            courseData?.course.deliveryType ?? Course_Delivery_Type_Enum.F2F,
          reaccreditation: courseData?.course.reaccreditation ?? false,
          go1Integration: courseData?.course.go1Integration ?? false,
        }
      : undefined,
    pause: !courseData?.course,
    requestPolicy: 'cache-and-network',
  })

  const modulesData = useMemo(
    () =>
      moduleGroupsData?.groups.filter(
        group => (group?.duration?.aggregate?.sum?.duration ?? 0) > 0
      ),
    [moduleGroupsData]
  )

  const purpleModuleIds = useMemo(
    () =>
      modulesData
        ?.filter(module => module.color === Color_Enum.Purple)
        .map(m => m.id),
    [modulesData]
  )

  const mandatoryGroups = useMemo(() => {
    if (!courseData?.course || !modulesData?.length) {
      return []
    }

    if (
      courseData.course.type === Course_Type_Enum.Open &&
      [Course_Level_Enum.Level_1, Course_Level_Enum.Level_2].includes(
        courseData.course.level
      )
    ) {
      return modulesData
    }

    return modulesData.filter(group => group.mandatory)
  }, [courseData?.course, modulesData])

  const initialGroups = useMemo(() => {
    const ids =
      courseData?.course?.moduleGroupIds
        .map(module => module?.module?.moduleGroup?.id)
        .filter(isNotNullish) ?? []

    return modulesData?.filter(group => ids.includes(group.id)) ?? []
  }, [modulesData, courseData?.course])

  const selectedIdsRef = useRef<string[]>([])
  const estimatedDurationRef = useRef<number>()

  const minimumTimeCommitment = useMemo(() => {
    if (courseData?.course) return getMinimumTimeCommitment(courseData?.course)
    return 0
  }, [courseData])

  const maxDuration = useMemo(() => {
    const course = courseData?.course
    return course
      ? MAX_COURSE_DURATION_MAP[
          course.reaccreditation ? 'reaccreditation' : 'normal'
        ][course.level ?? Course_Level_Enum.Level_1]
      : 0
  }, [courseData])

  const courseDescription = t(
    `pages.trainer-base.create-course.new-course.description-${
      courseData?.course?.level
    }${courseData?.course?.reaccreditation ? '-reaccreditation' : ''}`
  )

  const [, saveDraft] = useMutation<
    SetCourseAsDraftMutation,
    SetCourseAsDraftMutationVariables
  >(SET_COURSE_AS_DRAFT)

  const [{ error: saveModulesError }, saveModules] = useMutation<
    SaveCourseModulesMutation,
    SaveCourseModulesMutationVariables
  >(SaveCourseModules)

  const [
    { data: finalizeCourseData, error: finalizeCourseError },
    finalizeCourse,
  ] = useMutation<
    FinalizeCourseBuilderMutation,
    FinalizeCourseBuilderMutationVariables
  >(FINALIZE_COURSE_BUILDER_MUTATION)

  const submitCourse = useCallback(async () => {
    setIsTimeCommitmentModalOpen(false)
    if (courseData?.course) {
      const selectedGroups =
        modulesData?.filter(group =>
          selectedIdsRef.current.includes(group.id)
        ) ?? []

      saveModules({
        courseId: courseData.course.id,
        modules: selectedGroups.flatMap(moduleGroup =>
          moduleGroup.modules.map(module => ({
            courseId: courseData?.course?.id,
            moduleId: module.id,
          }))
        ),
      })

      finalizeCourse({
        id: courseData.course.id,
        duration: estimatedDurationRef.current ?? 0,
        status: null,
      })
    }
  }, [courseData?.course, finalizeCourse, modulesData, saveModules])

  const handleSelectionChange: CallbackFn = useCallback(
    ({ groupIds, estimatedDuration }) => {
      selectedIdsRef.current = groupIds
      estimatedDurationRef.current = estimatedDuration

      if (courseData?.course) {
        const selectedGroups =
          modulesData?.filter(group => groupIds.includes(group.id)) ?? []

        saveDraft({ id: courseData?.course.id })
        saveModules({
          courseId: courseData.course.id,
          modules: selectedGroups.flatMap(moduleGroup =>
            moduleGroup.modules.map(module => ({
              courseId: courseData?.course?.id,
              moduleId: module.id,
            }))
          ),
        })
      }
    },
    [courseData?.course, modulesData, saveDraft, saveModules]
  )

  const submitButtonHandler = useCallback(() => {
    if (minimumTimeCommitment) setIsTimeCommitmentModalOpen(true)
  }, [minimumTimeCommitment])

  const hasEstimatedDuration =
    courseData?.course?.level &&
    ![
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
    ].includes(courseData?.course?.level)

  useEffect(() => {
    if (finalizeCourseData?.update_course_by_pk?.id && courseData?.course) {
      if (!courseCreated) {
        addSnackbarMessage('course-submitted', {
          label: (
            <Trans
              i18nKey="pages.trainer-base.create-course.new-course.submitted-course"
              values={{ code: courseData.course.course_code }}
            >
              <Link
                underline="always"
                href={`/manage-courses/all/${courseData.course.id}/details`}
              >
                {courseData.course.course_code}
              </Link>
            </Trans>
          ),
        })
      }

      navigate('../details')
    }
  }, [
    navigate,
    addSnackbarMessage,
    courseCreated,
    finalizeCourseData,
    courseData?.course,
  ])

  useEffect(() => {
    if (!selectedIdsRef.current.length) {
      selectedIdsRef.current = initialGroups.length
        ? initialGroups.map(group => group.id)
        : mandatoryGroups.map(group => group.id)

      const selectedGroups = selectedIdsRef.current
        .map(id => (id ? modulesData?.find(group => group.id === id) : null))
        .filter(isNotNullish)

      estimatedDurationRef.current = [...selectedGroups].reduce(
        (sum, module) =>
          sum + (module?.duration?.aggregate?.sum?.duration ?? 0),
        0
      )
    }
  }, [initialGroups, mandatoryGroups, modulesData])

  if (!fetchingCourse && !courseData?.course && !courseError) {
    return (
      <NotFound
        title="Ooops!"
        description={t('common.errors.course-not-found')}
      />
    )
  }

  return (
    <Container sx={{ pt: 3 }}>
      {courseError || moduleGroupsError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
          {t('internal-error')}
        </Alert>
      ) : null}

      {finalizeCourseError || saveModulesError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
          {t('pages.trainer-base.create-course.new-course.saving-error')}
        </Alert>
      ) : null}

      {(fetchingCourse || fetchingModuleGroups) && (
        <Box display="flex" margin="auto">
          <CircularProgress
            sx={{ m: 'auto' }}
            size={64}
            aria-label="Course fetching"
          />
        </Box>
      )}

      {modulesData && courseData?.course && (
        <Box pb={6}>
          <BackButton
            label={t('pages.course-participants.back-button')}
            to="../.."
          />
          {courseData.course ? (
            <Hero
              course={courseData.course}
              slots={{
                afterTitle:
                  courseDescription !== ''
                    ? courseDescription
                    : t(
                        'pages.trainer-base.create-course.new-course.description',
                        {
                          duration: maxDuration ? maxDuration / 60 : 0,
                        }
                      ),
              }}
            />
          ) : null}
          <GroupsSelection
            availableGroups={modulesData}
            showDuration={hasEstimatedDuration}
            initialGroups={initialGroups}
            mandatoryGroups={mandatoryGroups}
            maxDuration={maxDuration}
            purpleModuleIds={purpleModuleIds}
            level={courseData.course.level}
            onSubmit={submitButtonHandler}
            onChange={handleSelectionChange}
            slots={{
              afterChosenModulesTitle:
                courseBuilderWarning[courseData.course.level] != null ? (
                  <Alert severity="info">
                    {t(
                      `pages.trainer-base.create-course.new-course.${
                        courseBuilderWarning[courseData.course.level]
                      }`
                    )}
                  </Alert>
                ) : null,
            }}
          />
        </Box>
      )}
      <ConfirmDialog
        open={isTimeCommitmentModalOpen}
        onOk={submitCourse}
        onCancel={() => setIsTimeCommitmentModalOpen(false)}
        message={
          <>
            {t(
              'pages.trainer-base.create-course.new-course.time-commitment-message',
              {
                hours: Math.max(
                  minimumTimeCommitment,
                  Math.ceil((estimatedDurationRef.current ?? 0) / 60)
                ),
              }
            )}
            {editMode ? (
              <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                {t(
                  'pages.trainer-base.create-course.new-course.time-commitment-warning'
                )}
              </Alert>
            ) : null}
          </>
        }
        title={t(
          'pages.trainer-base.create-course.new-course.time-commitment-title'
        )}
        okLabel={t('pages.trainer-base.create-course.new-course.submit-course')}
        data-testid="time-commitment-dialog"
      ></ConfirmDialog>
    </Container>
  )
}
