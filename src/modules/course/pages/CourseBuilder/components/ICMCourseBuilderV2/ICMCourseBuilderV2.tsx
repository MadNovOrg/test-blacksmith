import { Alert, Box, CircularProgress, Container, Link } from '@mui/material'
import * as Sentry from '@sentry/react'
import { cond, constant, matches, stubTrue } from 'lodash-es'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CombinedError } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { ConfirmDialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Color_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  GetCourseByIdQuery,
  ModuleSettingsQuery,
} from '@app/generated/graphql'
import { NotFound } from '@app/modules/not_found/pages/NotFound'
import { Shards } from '@app/util'

import { SaveCourse } from '../../../CreateCourse/hooks/useSaveCourse'
import { useCourseToBuild } from '../../hooks/useCourseToBuild'
import { getBackButtonForBuilderPage } from '../../utils'
import { Hero } from '../Hero/Hero'
import { getMinimumTimeCommitment } from '../ICMCourseBuilder/helpers'

import {
  CallbackFn,
  ModulesSelection,
} from './components/ModulesSelection/ModulesSelection'
import { useModuleSettings } from './hooks/useModuleSettings'
import { useSaveCourseDraft } from './hooks/useSaveCourseDraft'
import { useSubmitModules } from './hooks/useSubmitModules'

export type ICMBuilderCourseData = {
  course: Pick<
    Exclude<GetCourseByIdQuery['course'], null | undefined>,
    | 'conversion'
    | 'course_code'
    | 'curriculum'
    | 'deliveryType'
    | 'go1Integration'
    | 'id'
    | 'isDraft'
    | 'level'
    | 'name'
    | 'reaccreditation'
    | 'type'
    | 'updatedAt'
  > & {
    organization?: { name: string }
    schedule: (Pick<
      Exclude<GetCourseByIdQuery['course'], null | undefined>['schedule'][0],
      'end' | 'start' | 'timeZone'
    > & { venue?: { name: string; city: string } | null })[]
  }
}

export type OnSubmitICMCourseBuilderArgs = {
  curriculum: ModuleSettingsQuery['moduleSettings'][0]['module'][]
  duration: number
}

type Props = {
  data?: ICMBuilderCourseData
  editMode?: boolean
  onModuleSelectionChange?: (data: OnSubmitICMCourseBuilderArgs) => void
  onSubmit?: SaveCourse
}

const courseBuilderWarning: Partial<Record<Course_Level_Enum, string>> = {
  [Course_Level_Enum.Level_1]: 'course-l1-info',
  [Course_Level_Enum.Level_2]: 'course-l2-info',
  [Course_Level_Enum.Advanced]: 'course-adv-info',
}

export const MAX_COURSE_DURATION_MAP = {
  normal: {
    [Course_Level_Enum.Level_1]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_1Bs]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_1Np]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_2]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.FoundationTrainer]: 3 * 6 * 60, // 3 training days
    [Course_Level_Enum.FoundationTrainerPlus]: 3 * 6 * 60, // 3 training days
    [Course_Level_Enum.IntermediateTrainer]: 5 * 6 * 60, // 5 training days
    [Course_Level_Enum.BildRegular]: 5 * 6 * 60, // 5 training days
    [Course_Level_Enum.AdvancedTrainer]: 5 * 6 * 60, // 5 training days
    [Course_Level_Enum.Advanced]: 6 * 60, // 1 training day
    [Course_Level_Enum.BildIntermediateTrainer]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
    [Course_Level_Enum.BildAdvancedTrainer]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
  },
  reaccreditation: {
    [Course_Level_Enum.Level_1]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_1Bs]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_1Np]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_2]: 6 * 60, // 1 training day
    [Course_Level_Enum.FoundationTrainer]: 6 * 60, // 1 training day
    [Course_Level_Enum.FoundationTrainerPlus]: 6 * 60, // 1 training day
    [Course_Level_Enum.IntermediateTrainer]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.BildRegular]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.AdvancedTrainer]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.Advanced]: 3 * 6 * 60, // 3 training days
    [Course_Level_Enum.BildIntermediateTrainer]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
    [Course_Level_Enum.BildAdvancedTrainer]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
  },
}

export const ICMCourseBuilderV2: React.FC<React.PropsWithChildren<Props>> = ({
  data,
  editMode,
  onModuleSelectionChange,
  onSubmit,
}) => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()
  const { acl } = useAuth()
  const { pathname } = useLocation()

  const navigate = useNavigate()

  const [isTimeCommitmentModalOpen, setIsTimeCommitmentModalOpen] =
    useState(false)

  const { addSnackbarMessage, getSnackbarMessage } = useSnackbar()
  const courseCreatedMessage = Boolean(getSnackbarMessage('course-created'))

  const modulesSelectionRef = useRef<
    ModuleSettingsQuery['moduleSettings'][0]['module'][] | undefined
  >(undefined)

  const [
    { data: existingCourseData, fetching: fetchingCourse, error: courseError },
  ] = useCourseToBuild({ courseId: Number(courseId), pause: Boolean(data) })

  const courseData = useMemo(() => {
    return data ?? existingCourseData
  }, [data, existingCourseData])

  const [, saveDraft] = useSaveCourseDraft()
  const [
    { error: submitModulesError, fetching: submittingModules },
    submitModules,
  ] = useSubmitModules()

  const [
    {
      data: moduleSettingsData,
      fetching: fetchingModuleSettings,
      error: moduleSettingsError,
    },
  ] = useModuleSettings(courseData?.course, acl.isUK() ? Shards.UK : Shards.ANZ)

  const estimatedDurationRef = useRef<number | undefined>(undefined)

  const minimumTimeCommitment = useMemo(() => {
    if (courseData?.course) return getMinimumTimeCommitment(courseData?.course)
    return 0
  }, [courseData])

  const maxDuration = useMemo(() => {
    const course = courseData?.course
    if (!course) return 0
    const durationType = course.reaccreditation ? 'reaccreditation' : 'normal'
    return MAX_COURSE_DURATION_MAP[durationType][
      course.level ?? Course_Level_Enum.Level_1
    ]
  }, [courseData])

  const mapCourseLevelToDescription = useMemo(() => {
    return cond([
      [
        matches({
          level: Course_Level_Enum.Level_1,
          type: Course_Type_Enum.Open,
        }),
        constant({ duration: '6 hour', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.Level_1Bs,
          type: Course_Type_Enum.Closed,
        }),
        constant({ duration: '6-hour', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.Level_1,
        }),
        constant({
          duration: '6 hours',
          translationKey: 'ICM-description-choose-modules',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.Level_2,
          reaccreditation: true,
        }),
        constant({
          duration: '6 hours',
          translationKey: 'ICM-description-choose-modules',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.Level_2,
          type: Course_Type_Enum.Open,
        }),
        constant({ duration: '12 hour', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.Level_2,
        }),
        constant({
          duration: '12 hours',
          translationKey: 'ICM-description-choose-modules',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.Advanced,
        }),
        constant({
          duration: '6 hours',
          translationKey: 'ICM-description-choose-modules',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.IntermediateTrainer,
          reaccreditation: true,
        }),
        constant({ duration: '2 day', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.IntermediateTrainer,
        }),
        constant({ duration: '5 day', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.AdvancedTrainer,
          reaccreditation: true,
        }),
        constant({ duration: '3 day', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.AdvancedTrainer,
        }),
        constant({ duration: '4 day', translationKey: 'ICM-description' }),
      ],
      [
        matches({
          level: Course_Level_Enum.FoundationTrainerPlus,
          reaccreditation: true,
        }),
        constant({
          duration: '1 day',
          translationKey: 'foundation-trainer-plus-choose-modules',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.FoundationTrainerPlus,
        }),
        constant({
          duration: '3 day',
          translationKey: 'foundation-trainer-plus-choose-modules',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.FoundationTrainer,
          reaccreditation: true,
        }),
        constant({
          duration: '1 day',
          translationKey: 'ICM-description',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.FoundationTrainer,
        }),
        constant({
          duration: '2 day',
          translationKey: 'ICM-description',
        }),
      ],
      [
        matches({
          level: Course_Level_Enum.Level_1Bs,
        }),
        constant({
          duration: '6-hour',
          translationKey: 'ICM-description',
        }),
      ],
      [stubTrue, constant(null)],
    ])
  }, [])

  const courseDescription = useMemo<string>(() => {
    if (!courseData?.course) return ''

    const mappedCourseDescription = mapCourseLevelToDescription(
      courseData.course,
    )

    if (!mappedCourseDescription) return ''

    return t(
      `pages.trainer-base.create-course.new-course.${mappedCourseDescription.translationKey}`,
      {
        duration: mappedCourseDescription.duration,
      },
    )
  }, [courseData, t, mapCourseLevelToDescription])

  const showMandatoryNotice = useMemo(() => {
    const courseLevel = courseData?.course?.level
    const type = courseData?.course?.type

    return (
      (courseLevel === Course_Level_Enum.Level_1 &&
        (type === Course_Type_Enum.Closed ||
          type === Course_Type_Enum.Indirect)) ||
      (courseLevel === Course_Level_Enum.Level_2 &&
        (type === Course_Type_Enum.Closed ||
          type === Course_Type_Enum.Indirect)) ||
      courseLevel === Course_Level_Enum.Advanced
    )
  }, [courseData?.course])

  const handleModulesChange: CallbackFn = useCallback(
    ({ selectedIds, previousIds, estimatedDuration }) => {
      modulesSelectionRef.current = moduleSettingsData?.moduleSettings
        .filter(moduleSetting => selectedIds.includes(moduleSetting.module.id))
        .map(moduleSetting => ({
          ...moduleSetting.module,
          mandatory: moduleSetting.mandatory,
        }))

      estimatedDurationRef.current = estimatedDuration

      if (onModuleSelectionChange && modulesSelectionRef.current) {
        onModuleSelectionChange({
          curriculum: modulesSelectionRef.current,
          duration: estimatedDuration,
        })
      }

      if (previousIds && previousIds.length !== selectedIds.length) {
        saveDraft({
          id: Number(courseId),
          curriculum: modulesSelectionRef.current,
        })
      }
    },
    [
      courseId,
      moduleSettingsData?.moduleSettings,
      onModuleSelectionChange,
      saveDraft,
    ],
  )

  const confirmModules = useCallback(async () => {
    setIsTimeCommitmentModalOpen(false)
    let courseCode = ''
    let id = Number(courseId)

    try {
      if (onSubmit) {
        const resp = await onSubmit()
        courseCode = resp?.courseCode ?? ''
        id = Number(resp?.id)
      } else {
        await submitModules({
          id: Number(courseId),
          curriculum: modulesSelectionRef.current,
          duration: estimatedDurationRef.current ?? 0,
        })

        courseCode = courseData?.course?.course_code ?? ''
      }

      if (!courseCreatedMessage && courseCode && courseId) {
        addSnackbarMessage('course-submitted', {
          label: (
            <Trans
              i18nKey="pages.trainer-base.create-course.new-course.submitted-course"
              values={{ code: courseCode }}
            >
              <Link
                underline="always"
                href={`/${
                  acl.isInternalUser() ? 'manage-courses/all' : 'courses'
                }/${id}/details`}
              >
                {courseCode}
              </Link>
            </Trans>
          ),
        })
      }

      if (id) {
        navigate(
          acl.isInternalUser()
            ? `/manage-courses/all/${id}/details`
            : `/courses/${id}/details`,
        )
      }
    } catch (e) {
      Sentry.captureException(e)
    }

    if (submitModulesError) {
      throw new CombinedError(submitModulesError)
    }
  }, [
    acl,
    addSnackbarMessage,
    courseCreatedMessage,
    courseData?.course?.course_code,
    courseId,
    navigate,
    onSubmit,
    submitModules,
    submitModulesError,
  ])

  const handleModulesSubmit: CallbackFn = useCallback(
    ({ selectedIds, estimatedDuration }) => {
      modulesSelectionRef.current = moduleSettingsData?.moduleSettings
        .filter(moduleSetting => selectedIds.includes(moduleSetting.module.id))
        .map(moduleSetting => ({
          ...moduleSetting.module,
          mandatory: moduleSetting.mandatory,
        }))

      estimatedDurationRef.current = estimatedDuration

      if (minimumTimeCommitment) {
        setIsTimeCommitmentModalOpen(true)
      } else {
        confirmModules()
      }
    },
    [confirmModules, minimumTimeCommitment, moduleSettingsData?.moduleSettings],
  )

  const validateSelection = useCallback(
    (selectedIds: string[]): boolean => {
      const selectedModules = moduleSettingsData?.moduleSettings.filter(
        moduleSetting => selectedIds.includes(moduleSetting.module.id),
      )

      if (courseData?.course?.level === Course_Level_Enum.Level_2) {
        return Boolean(
          selectedModules?.some(
            moduleSetting => moduleSetting.color === Color_Enum.Purple,
          ),
        )
      }

      return true
    },
    [courseData?.course?.level, moduleSettingsData?.moduleSettings],
  )

  const hasEstimatedDuration =
    courseData?.course?.level &&
    courseData?.course?.type !== Course_Type_Enum.Open &&
    ![
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
      Course_Level_Enum.FoundationTrainerPlus,
    ].includes(courseData?.course?.level)

  const isLevel1VirtualCourse = useMemo(
    () =>
      courseData?.course?.type === Course_Type_Enum.Closed &&
      courseData?.course?.level === Course_Level_Enum.Level_1 &&
      courseData?.course?.deliveryType === Course_Delivery_Type_Enum.Virtual,
    [
      courseData?.course?.deliveryType,
      courseData?.course?.level,
      courseData?.course?.type,
    ],
  )

  const backButton: { label: string; to: string | undefined } = useMemo(() => {
    return getBackButtonForBuilderPage({
      editMode: Boolean(editMode),
      existsCourse: Boolean(courseId) && !pathname.includes('draft'),
      isInternalUser: acl.isInternalUser(),
    })
  }, [acl, courseId, editMode, pathname])

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
      {courseError || moduleSettingsError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
          {t('internal-error')}
        </Alert>
      ) : null}

      {submitModulesError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
          {t('pages.trainer-base.create-course.new-course.saving-error')}
        </Alert>
      ) : null}

      {fetchingCourse || fetchingModuleSettings ? (
        <Box display="flex" margin="auto">
          <CircularProgress
            sx={{ m: 'auto' }}
            size={64}
            aria-label="Course fetching"
          />
        </Box>
      ) : null}
      {moduleSettingsData?.moduleSettings && courseData?.course && (
        <Box pb={6}>
          <BackButton label={backButton.label} to={backButton.to} />
          {courseData.course ? (
            <Hero
              course={courseData.course}
              showMandatoryNotice={showMandatoryNotice}
              slots={{
                afterTitle:
                  courseDescription ||
                  t(
                    'pages.trainer-base.create-course.new-course.ICM-description-default',
                    {
                      duration: maxDuration
                        ? `${maxDuration / 60} hours`
                        : '0 hours',
                    },
                  ),
              }}
            />
          ) : null}
          <ModulesSelection
            availableModules={moduleSettingsData.moduleSettings}
            initialSelection={
              Array.isArray(courseData.course.curriculum)
                ? courseData.course.curriculum.map(m => m.id)
                : []
            }
            onChange={handleModulesChange}
            onSubmit={handleModulesSubmit}
            submitting={submittingModules}
            showDuration={hasEstimatedDuration}
            displayModulesDuration={!isLevel1VirtualCourse}
            maxDuration={maxDuration}
            validateSelection={validateSelection}
            slots={{
              afterChosenModulesTitle:
                courseData.course.type !== Course_Type_Enum.Open &&
                courseBuilderWarning[courseData.course.level] != null ? (
                  <Alert severity="info" data-testid="modules-alert">
                    {t(
                      `pages.trainer-base.create-course.new-course.${
                        courseBuilderWarning[courseData.course.level]
                      }`,
                    )}
                  </Alert>
                ) : null,
            }}
          />
        </Box>
      )}
      <ConfirmDialog
        open={isTimeCommitmentModalOpen}
        onOk={confirmModules}
        onCancel={() => setIsTimeCommitmentModalOpen(false)}
        message={
          <>
            {t(
              'pages.trainer-base.create-course.new-course.time-commitment-message',
              {
                hours: minimumTimeCommitment,
              },
            )}
            {editMode ? (
              <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                {t(
                  'pages.trainer-base.create-course.new-course.time-commitment-warning',
                )}
              </Alert>
            ) : null}
          </>
        }
        title={t(
          'pages.trainer-base.create-course.new-course.time-commitment-title',
        )}
        okLabel={t('pages.trainer-base.create-course.new-course.submit-course')}
        data-testid="time-commitment-dialog"
      />
    </Container>
  )
}
