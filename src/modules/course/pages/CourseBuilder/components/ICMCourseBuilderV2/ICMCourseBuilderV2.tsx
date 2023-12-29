import { Alert, Box, CircularProgress, Container } from '@mui/material'
import { cond, constant, matches, stubTrue } from 'lodash-es'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { ConfirmDialog } from '@app/components/dialogs'
import {
  CourseToBuildQuery,
  CourseToBuildQueryVariables,
  Course_Level_Enum,
  Course_Type_Enum,
  ModuleSettingsQuery,
  ModuleSettingsQueryVariables,
} from '@app/generated/graphql'
import { NotFound } from '@app/pages/common/NotFound'

import { Hero } from '../Hero/Hero'
import { getMinimumTimeCommitment } from '../ICMCourseBuilder/helpers'
import { COURSE_QUERY } from '../ICMCourseBuilder/queries'

import { ModulesSelection } from './components/ModulesSelection/ModulesSelection'
import { MODULE_SETTINGS } from './queries'

type CourseBuilderProps = unknown & { editMode?: boolean }

const courseBuilderWarning: Partial<Record<Course_Level_Enum, string>> = {
  [Course_Level_Enum.Level_1]: 'course-l1-info',
  [Course_Level_Enum.Level_2]: 'course-l2-info',
  [Course_Level_Enum.Advanced]: 'course-adv-info',
}

export const MAX_COURSE_DURATION_MAP = {
  normal: {
    [Course_Level_Enum.Level_1]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_2]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.ThreeDaySafetyResponseTrainer]: 3 * 6 * 60, // 3 training days
    [Course_Level_Enum.IntermediateTrainer]: 5 * 6 * 60, // 5 training days
    [Course_Level_Enum.BildRegular]: 5 * 6 * 60, // 5 training days
    [Course_Level_Enum.AdvancedTrainer]: 5 * 6 * 60, // 5 training days
    [Course_Level_Enum.Advanced]: 6 * 60, // 1 training day
    [Course_Level_Enum.BildIntermediateTrainer]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
    [Course_Level_Enum.BildAdvancedTrainer]: 4 * 6 * 60, // 4 training days -  TODO change when we get clarity
  },
  reaccreditation: {
    [Course_Level_Enum.Level_1]: 6 * 60, // 1 training day
    [Course_Level_Enum.Level_2]: 6 * 60, // 1 training day
    [Course_Level_Enum.ThreeDaySafetyResponseTrainer]: 6 * 60, // 1 training day
    [Course_Level_Enum.IntermediateTrainer]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.BildRegular]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.AdvancedTrainer]: 2 * 6 * 60, // 2 training days
    [Course_Level_Enum.Advanced]: 3 * 6 * 60, // 3 training days
    [Course_Level_Enum.BildIntermediateTrainer]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
    [Course_Level_Enum.BildAdvancedTrainer]: 4 * 6 * 60, // 4 training days - TODO change when we get clarity
  },
}

export const ICMCourseBuilderV2: React.FC<
  React.PropsWithChildren<CourseBuilderProps>
> = ({ editMode }) => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const [isTimeCommitmentModalOpen, setIsTimeCommitmentModalOpen] =
    useState(false)

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
      data: moduleSettingsData,
      fetching: fetchingModuleSettings,
      error: moduleSettingsError,
    },
  ] = useQuery<ModuleSettingsQuery, ModuleSettingsQueryVariables>({
    query: MODULE_SETTINGS,
    pause: !courseData?.course,
    requestPolicy: 'cache-and-network',
    ...(courseData?.course
      ? {
          variables: {
            courseType: courseData.course.type,
            courseLevel: courseData.course.level,
            courseDeliveryType: courseData.course.deliveryType,
            reaccreditation: courseData.course.reaccreditation,
            go1Integration: courseData.course.go1Integration,
          },
        }
      : null),
  })

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

  const mapCourseLevelToDescription = cond([
    [
      matches({
        level: Course_Level_Enum.Level_1,
        type: Course_Type_Enum.Open,
      }),
      constant({ duration: '6 hour', translationKey: 'ICM-description' }),
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
        level: Course_Level_Enum.ThreeDaySafetyResponseTrainer,
        reaccreditation: true,
      }),
      constant({
        duration: '1 day',
        translationKey: '3-day-STR-choose-modules',
      }),
    ],
    [
      matches({
        level: Course_Level_Enum.ThreeDaySafetyResponseTrainer,
      }),
      constant({
        duration: '3 day',
        translationKey: '3-day-STR-choose-modules',
      }),
    ],
    [stubTrue, constant(null)],
  ])

  const courseDescription = useMemo<string>(() => {
    if (!courseData?.course) return ''

    const mappedCourseDescription = mapCourseLevelToDescription(
      courseData.course
    )

    if (!mappedCourseDescription) return ''

    return t(
      `pages.trainer-base.create-course.new-course.${mappedCourseDescription.translationKey}`,
      {
        duration: mappedCourseDescription.duration,
      }
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

  const hasEstimatedDuration =
    courseData?.course?.level &&
    courseData?.course?.type !== Course_Type_Enum.Open &&
    ![
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
    ].includes(courseData?.course?.level)

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
      new modules
      {courseError || moduleSettingsError ? (
        <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
          {t('internal-error')}
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
          <BackButton label={t('pages.course-participants.back-button')} />
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
                    }
                  ),
              }}
            />
          ) : null}
          <ModulesSelection
            availableModules={moduleSettingsData.moduleSettings}
            showDuration={hasEstimatedDuration}
            maxDuration={maxDuration}
            slots={{
              afterChosenModulesTitle:
                courseData.course.type !== Course_Type_Enum.Open &&
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
        onOk={console.log}
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
