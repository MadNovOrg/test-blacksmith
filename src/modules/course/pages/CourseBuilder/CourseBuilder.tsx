import { Alert, Box, CircularProgress } from '@mui/material'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import {
  Accreditors_Enum,
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
} from '@app/generated/graphql'
import { NotFound } from '@app/pages/common/NotFound'
import { QUERY as GET_COURSE_BY_ID_QUERY } from '@app/queries/courses/get-course-by-id'

import { BILDCourseBuilder } from './components/BILDCourseBuilder/BILDCourseBuilder'
import { ICMCourseBuilder } from './components/ICMCourseBuilder/ICMCourseBuilder'
import { ICMCourseBuilderV2 } from './components/ICMCourseBuilderV2/ICMCourseBuilderV2'

export const CourseBuilder: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const newModulesDataModelEnabled = useFeatureFlagEnabled(
    'new-modules-data-model'
  )

  const { editMode } = (useLocation().state as { editMode: boolean }) ?? {}

  const [{ data: courseData, error: courseDataError, fetching }] = useQuery<
    GetCourseByIdQuery,
    GetCourseByIdQueryVariables
  >({
    query: GET_COURSE_BY_ID_QUERY,
    variables: { id: Number(courseId) },
    pause: !courseId,
  })

  if (!fetching && !courseData?.course) {
    return (
      <NotFound
        title="Ooops!"
        description={t('common.errors.course-not-found')}
      />
    )
  }

  if (courseDataError) {
    return (
      <Alert severity="error" variant="filled">
        {t('internal-error')}
      </Alert>
    )
  }

  if (fetching) {
    return (
      <Box display="flex" margin="auto">
        <CircularProgress sx={{ m: 'auto' }} size={64} />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>
          {t('pages.browser-tab-titles.manage-courses.course-builder')}
        </title>
      </Helmet>

      {courseData?.course?.accreditedBy === Accreditors_Enum.Icm ? (
        newModulesDataModelEnabled ? (
          <ICMCourseBuilderV2 editMode={editMode ?? false} />
        ) : (
          <ICMCourseBuilder editMode={editMode ?? false} />
        )
      ) : null}

      {courseData?.course?.accreditedBy === Accreditors_Enum.Bild ? (
        <BILDCourseBuilder />
      ) : null}
    </>
  )
}
