import { CircularProgress, Typography } from '@mui/material'
import pdf from '@react-pdf/renderer'
import { anyPass } from 'lodash/fp'
import { groupBy } from 'lodash-es'
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  CourseParticipantsQuery,
  CourseParticipantsQueryVariables,
  Course_Evaluation_Question_Group_Enum,
  Course_Evaluation_Question_Type_Enum,
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables,
  GetEvaluationsSummaryQuery,
  GetEvaluationsSummaryQueryVariables,
  Order_By,
} from '@app/generated/graphql'
import { SummaryDocument } from '@app/modules/course_details/components/SummaryDocument/SummaryDocument'
import { GET_EVALUATIONS_SUMMARY_QUERY } from '@app/modules/course_details/course_evaluation_tab/queries/get-evaluations-summary'
import { QUERY as GET_COURSE_PARTICIPANTS } from '@app/modules/course_details/hooks/course-participant/get-course-participants'
import { QUERY as GET_COURSE_BY_ID_QUERY } from '@app/queries/courses/get-course-by-id'
import { CourseEvaluationGroupedQuestion } from '@app/types'

const { PDFDownloadLink } = pdf

const groups = [
  Course_Evaluation_Question_Group_Enum.TrainingRating,
  Course_Evaluation_Question_Group_Enum.TrainingRelevance,
  Course_Evaluation_Question_Group_Enum.TrainerStandards,
  Course_Evaluation_Question_Group_Enum.MaterialsAndVenue,
]

const booleanQuestionTypes = [
  Course_Evaluation_Question_Type_Enum.Boolean,
  Course_Evaluation_Question_Type_Enum.BooleanReasonY,
  Course_Evaluation_Question_Type_Enum.BooleanReasonN,
]

type Props = {
  courseId: number
  profileId: string
}

export const EvaluationSummaryPDFDownloadLink: React.FC<Props> = ({
  courseId,
  profileId,
}) => {
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

  const [{ data: summaryResponseData, error: summaryResponseError }] = useQuery<
    GetEvaluationsSummaryQuery,
    GetEvaluationsSummaryQueryVariables
  >({
    query: GET_EVALUATIONS_SUMMARY_QUERY,
    requestPolicy: 'cache-and-network',
    variables: {
      courseId,
      profileCondition: acl.canViewArchivedProfileData()
        ? {}
        : { archived: { _eq: false } },
    },
  })

  const [{ data: courseData, error: courseError }] = useQuery<
    GetCourseByIdQuery,
    GetCourseByIdQueryVariables
  >({
    query: GET_COURSE_BY_ID_QUERY,
    variables: { id: courseId, withModules: true },
    requestPolicy: 'cache-and-network',
  })

  const [{ data: participantsData, error: participantsError }] = useQuery<
    CourseParticipantsQuery,
    CourseParticipantsQueryVariables
  >({
    query: GET_COURSE_PARTICIPANTS,
    requestPolicy: 'cache-and-network',
    variables: {
      orderBy: { profile: { fullName: Order_By.Asc } },
      where: {
        course: { id: { _eq: courseId } },
        profile: acl.canViewArchivedProfileData()
          ? {}
          : { archived: { _eq: false } },
      },
    },
  })

  const dataLoading =
    (!courseData && !courseError) ||
    (!summaryResponseData && !summaryResponseError) ||
    (!participantsData && !participantsError)

  const { trainerAnswers, grouped, ungrouped, injuryQuestion } = useMemo(() => {
    const { trainer, attendee } = groupBy(summaryResponseData?.answers, a =>
      a.profile.id === profileId ? 'trainer' : 'attendee',
    )

    const trainerAnswers = trainer?.toSorted(a =>
      booleanQuestionTypes.includes(
        a.question.type as unknown as Course_Evaluation_Question_Type_Enum,
      )
        ? -1
        : 0,
    )

    const { UNGROUPED: ungroupedAnswers, ...groupedAnswers } = groupBy(
      attendee,
      a => a.question.group ?? 'UNGROUPED',
    )

    const grouped = {} as CourseEvaluationGroupedQuestion

    groups.forEach(g => {
      grouped[g] = groupBy(groupedAnswers[g], a => a.question.questionKey)
    })

    const { ANY_INJURIES: injuryQuestion = [], ...ungrouped } = groupBy(
      ungroupedAnswers,
      a => a.question.questionKey,
    )

    const injuryResponse = groupBy(injuryQuestion, a =>
      a?.answer?.startsWith('YES') ? 'YES' : 'NO',
    )

    return {
      grouped,
      ungrouped,
      trainerAnswers,
      injuryQuestion: {
        yes:
          injuryQuestion.length > 0
            ? Number(
                (
                  ((injuryResponse.YES?.length ?? 0) / injuryQuestion.length) *
                  100
                ).toFixed(1),
              )
            : 0,
        no:
          injuryQuestion.length > 0
            ? Number(
                (
                  ((injuryResponse.NO?.length ?? 0) / injuryQuestion.length) *
                  100
                ).toFixed(1),
              )
            : 0,
      },
    }
  }, [summaryResponseData, profileId])

  const participants = useMemo(
    () => participantsData?.courseParticipants ?? [],
    [participantsData],
  )

  const course = courseData?.course

  const isRestricted = anyPass([
    acl.isBookingContact,
    acl.isOrgAdmin,
    acl.isOrgKeyContact,
  ])()

  const pdfDocument = useMemo(() => {
    if (summaryResponseData?.answers.length === 0) {
      return null
    }

    return course ? (
      <SummaryDocument
        course={course}
        isRestricted={isRestricted}
        grouped={grouped}
        ungrouped={ungrouped}
        injuryQuestion={injuryQuestion}
        trainerAnswers={trainerAnswers}
        participants={participants}
      />
    ) : null
  }, [
    course,
    isRestricted,
    participants,
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
      fileName={`${course?.name}.pdf`}
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
