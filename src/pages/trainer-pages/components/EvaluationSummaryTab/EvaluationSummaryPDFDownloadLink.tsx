import { CircularProgress, Typography } from '@mui/material'
import pdf from '@react-pdf/renderer'
import { groupBy } from 'lodash-es'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import { SummaryDocument } from '@app/components/SummaryPDF'
import { useAuth } from '@app/context/auth'
import {
  ParamsType as GetEvaluationsSummaryParamsType,
  QUERY as GET_EVALUATIONS_SUMMARY_QUERY,
  ResponseType as GetEvaluationsSummaryResponseType,
} from '@app/queries/course-evaluation/get-evaluations-summary'
import {
  ParamsType as GetCourseByIdParamsType,
  QUERY as GET_COURSE_BY_ID_QUERY,
  ResponseType as GetCourseByIdResponseType,
} from '@app/queries/courses/get-course-by-id'
import {
  ParamsType as GetCourseModulesParamsType,
  QUERY as GET_COURSE_MODULES,
  ResponseType as GetCourseModulesResponseType,
} from '@app/queries/courses/get-course-modules'
import {
  ParamsType as GetCourseParticipantsParamsType,
  QUERY as GET_COURSE_PARTICIPANTS,
  ResponseType as GetCourseParticipantsResponseType,
} from '@app/queries/participants/get-course-participants'
import {
  Course,
  CourseEvaluationGroupedQuestion,
  CourseEvaluationQuestionGroup,
  CourseEvaluationQuestionType,
  CourseModule,
  CourseParticipant,
} from '@app/types'

const { PDFDownloadLink } = pdf

const groups = [
  CourseEvaluationQuestionGroup.TRAINING_RATING,
  CourseEvaluationQuestionGroup.TRAINING_RELEVANCE,
  CourseEvaluationQuestionGroup.TRAINER_STANDARDS,
  CourseEvaluationQuestionGroup.MATERIALS_AND_VENUE,
]

const booleanQuestionTypes = [
  CourseEvaluationQuestionType.BOOLEAN,
  CourseEvaluationQuestionType.BOOLEAN_REASON_Y,
  CourseEvaluationQuestionType.BOOLEAN_REASON_N,
]

type EvaluationSummaryPDFDownloadLinkProps = {
  courseId: string
  profileId: string
}

export const EvaluationSummaryPDFDownloadLink: React.FC<
  React.PropsWithChildren<EvaluationSummaryPDFDownloadLinkProps>
> = ({ courseId, profileId }) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  const loadingComponent = (
    <Fragment>
      <CircularProgress
        disableShrink={true}
        color="inherit"
        data-testid="loading-summary-export-pdf"
        size="16px"
        sx={{ verticalAlign: 'middle' }}
      />
      &nbsp;&nbsp;
      {t('pages.course-details.tabs.evaluation.export-loading')}
    </Fragment>
  )

  const { data: summaryResponseData, error: summaryResponseError } = useSWR<
    GetEvaluationsSummaryResponseType,
    Error,
    [string, GetEvaluationsSummaryParamsType]
  >([
    GET_EVALUATIONS_SUMMARY_QUERY,
    {
      courseId,
      profileCondition: acl.canViewArchivedProfileData()
        ? {}
        : { archived: { _eq: false } },
    },
  ])

  const { data: courseData, error: courseError } = useSWR<
    GetCourseByIdResponseType,
    Error,
    [string, GetCourseByIdParamsType]
  >([GET_COURSE_BY_ID_QUERY, { id: courseId }])

  const { data: courseModulesData, error: courseModulesError } = useSWR<
    GetCourseModulesResponseType,
    Error,
    [string, GetCourseModulesParamsType]
  >([GET_COURSE_MODULES, { id: courseId }])

  const { data: participantsData, error: participantsError } = useSWR<
    GetCourseParticipantsResponseType,
    Error,
    [string, GetCourseParticipantsParamsType]
  >([
    GET_COURSE_PARTICIPANTS,
    {
      orderBy: { profile: { fullName: 'asc' } },
      where: {
        course: { id: { _eq: courseId } },
        profile: acl.canViewArchivedProfileData()
          ? {}
          : { archived: { _eq: false } },
      },
    },
  ])

  const dataLoading =
    (!courseData && !courseError) ||
    (!summaryResponseData && !summaryResponseError) ||
    (!courseModulesData && !courseModulesError) ||
    (!participantsData && !participantsError)

  const { trainerAnswers, grouped, ungrouped, injuryQuestion } = useMemo(() => {
    const { trainer, attendee } = groupBy(summaryResponseData?.answers, a =>
      a.profile.id === profileId ? 'trainer' : 'attendee'
    )

    const trainerAnswers = trainer?.sort(a =>
      booleanQuestionTypes.includes(a.question.type) ? -1 : 0
    )

    const { UNGROUPED: ungroupedAnswers, ...groupedAnswers } = groupBy(
      attendee,
      a => a.question.group || 'UNGROUPED'
    )

    const grouped = {} as CourseEvaluationGroupedQuestion

    groups.forEach(g => {
      grouped[g] = groupBy(groupedAnswers[g], a => a.question.questionKey)
    })

    const { ANY_INJURIES: injuryQuestion = [], ...ungrouped } = groupBy(
      ungroupedAnswers,
      a => a.question.questionKey
    )

    const injuryResponse = groupBy(injuryQuestion, a =>
      a.answer.startsWith('YES') ? 'YES' : 'NO'
    )

    return {
      grouped,
      ungrouped,
      trainerAnswers,
      injuryQuestion: {
        yes:
          injuryQuestion.length > 0
            ? ((injuryResponse.YES?.length ?? 0) / injuryQuestion.length) * 100
            : 0,
        no:
          injuryQuestion.length > 0
            ? ((injuryResponse.NO?.length ?? 0) / injuryQuestion.length) * 100
            : 0,
      },
    }
  }, [summaryResponseData, profileId])

  const participants = useMemo(
    () => participantsData?.courseParticipants ?? ([] as CourseParticipant[]),
    [participantsData]
  )

  const course = useMemo(
    () => courseData?.course ?? ({} as Course),
    [courseData]
  )

  const courseModules = useMemo(
    () => courseModulesData?.courseModules ?? ([] as CourseModule[]),
    [courseModulesData]
  )

  const pdfDocument = useMemo(() => {
    if (summaryResponseData?.answers.length === 0) {
      return null
    }

    return (
      <SummaryDocument
        course={course}
        courseModules={courseModules}
        grouped={grouped}
        ungrouped={ungrouped}
        injuryQuestion={injuryQuestion}
        trainerAnswers={trainerAnswers}
        participants={participants}
      />
    )
  }, [
    course,
    participants,
    courseModules,
    trainerAnswers,
    grouped,
    ungrouped,
    injuryQuestion,
    summaryResponseData,
  ])

  if (dataLoading) {
    return loadingComponent
  }

  if (!pdfDocument) {
    return (
      <Typography>
        {t('pages.course-details.tabs.evaluation.no-evaluations')}
      </Typography>
    )
  }

  return (
    <PDFDownloadLink
      style={{ color: 'inherit' }}
      document={pdfDocument}
      fileName={`${course.name}.pdf`}
    >
      {({ loading, error }) => {
        if (error) {
          console.error(error)
          return t('pages.course-details.tabs.evaluation.export-error')
        }

        return loading
          ? loadingComponent
          : t('pages.course-details.tabs.evaluation.export-done')
      }}
    </PDFDownloadLink>
  )
}
