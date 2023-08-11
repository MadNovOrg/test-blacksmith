import { Alert, Box, CircularProgress } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import useSWR from 'swr'

import {
  Accreditors_Enum,
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
} from '@app/generated/graphql'
import { NotFound } from '@app/pages/common/NotFound'
import { QUERY as GET_COURSE_BY_ID_QUERY } from '@app/queries/courses/get-course-by-id'
import { getSWRLoadingStatus, LoadingStatus } from '@app/util'

import { BILDCourseBuilder } from '../BILDCourseBuilder'
import { CourseBuilder } from '../CourseBuilder/CourseBuilder'

export const CourseBuilderCommon: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { id: courseId } = useParams()

  const { editMode } = (useLocation().state as { editMode: boolean }) ?? {}

  const { data: courseData, error: courseDataError } = useSWR<
    GetCourseByIdQuery,
    Error,
    [string, GetCourseByIdQueryVariables] | null
  >(courseId ? [GET_COURSE_BY_ID_QUERY, { id: Number(courseId) }] : null)

  const courseLoadingStatus = getSWRLoadingStatus(courseData, courseDataError)

  if (courseLoadingStatus === LoadingStatus.SUCCESS && !courseData?.course) {
    return (
      <NotFound
        title="Ooops!"
        description={t('common.errors.course-not-found')}
      />
    )
  }

  if (courseLoadingStatus === LoadingStatus.ERROR) {
    return (
      <Alert severity="error" variant="filled">
        {t('internal-error')}
      </Alert>
    )
  }

  if (courseLoadingStatus === LoadingStatus.FETCHING) {
    return (
      <Box display="flex" margin="auto">
        <CircularProgress sx={{ m: 'auto' }} size={64} />
      </Box>
    )
  }

  if (courseData?.course?.accreditedBy === Accreditors_Enum.Icm) {
    return <CourseBuilder editMode={editMode ?? false} />
  }

  if (courseData?.course?.accreditedBy === Accreditors_Enum.Bild) {
    return <BILDCourseBuilder />
  }

  return null
}
