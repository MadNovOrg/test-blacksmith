import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Container,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { groupBy, map, uniqBy } from 'lodash-es'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import useSWR from 'swr'
import * as yup from 'yup'

import { AttendeeMenu } from '@app/components/AttendeeMenu'
import { BackButton } from '@app/components/BackButton'
import { BooleanQuestion } from '@app/components/BooleanQuestion'
import { QuestionGroup } from '@app/components/QuestionGroup'
import { RatingQuestion } from '@app/components/RatingQuestion'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import {
  ParamsType as GetAnswersParamsType,
  QUERY as GET_ANSWERS_QUERY,
  ResponseType as GetAnswersResponseType,
} from '@app/queries/course-evaluation/get-answers'
import {
  ParamsType as GetFeedbackUsersParamsType,
  QUERY as GET_FEEDBACK_USERS_QUERY,
  ResponseType as GetFeedbackUsersResponseType,
} from '@app/queries/course-evaluation/get-feedback-users'
import {
  QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY,
  ResponseType as GetCourseEvaluationQuestionsResponseType,
} from '@app/queries/course-evaluation/get-questions'
import {
  MUTATION as SAVE_COURSE_EVALUATION_ANSWERS_MUTATION,
  ResponseType as SaveCourseEvaluationResponseType,
} from '@app/queries/course-evaluation/save-evaluation'
import { GetParticipant } from '@app/queries/participants/get-course-participant-by-profile-id'
import {
  CourseEvaluationQuestion,
  CourseEvaluationQuestionGroup,
  CourseEvaluationQuestionType,
  CourseParticipant,
} from '@app/types'
import { courseStarted, LoadingStatus } from '@app/util'

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

function isAllRequired(questions: CourseEvaluationQuestion[]) {
  return questions?.every(q => q.required) ?? false
}

export const CourseEvaluation = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const [searchParams] = useSearchParams()
  const { profile } = useAuth()
  const courseId = params.id as string
  const profileId = searchParams.get('profile_id') as string
  const readOnly = !!profileId

  const { data: course, status: courseStatus } = useCourse(courseId ?? '')
  const [loading, setLoading] = useState(false)
  const { data: participantData, isValidating: participantDataLoading } =
    useSWR([GetParticipant, { profileId: profile?.id, courseId }])

  const { data: questions, isValidating: questionsLoading } =
    useSWR<GetCourseEvaluationQuestionsResponseType>(
      GET_COURSE_EVALUATION_QUESTIONS_QUERY
    )

  const { data: evaluation, isValidating: evaluationLoading } = useSWR<
    GetAnswersResponseType,
    Error,
    [string, GetAnswersParamsType] | null
  >(profileId ? [GET_ANSWERS_QUERY, { courseId, profileId }] : null)

  const { data: usersData, isValidating: usersDataLoading } = useSWR<
    GetFeedbackUsersResponseType,
    Error,
    [string, GetFeedbackUsersParamsType] | null
  >(profileId ? [GET_FEEDBACK_USERS_QUERY, { courseId }] : null)

  const attendees = useMemo(() => {
    return uniqBy(
      usersData?.users?.flatMap(a =>
        a.profile.id === profile?.id
          ? []
          : [
              {
                id: a.profile.id,
                name: a.profile.fullName,
                avatar: a.profile.avatar,
                archived: a.profile.archived,
              },
            ]
      ) ?? [],
      u => u.id
    )
  }, [usersData, profile])

  const { UNGROUPED: ungroupedQuestions, ...groupedQuestions } = groupBy(
    questions?.questions,
    q => q.group || 'UNGROUPED'
  )

  const signatureQuestion = useMemo(
    () =>
      questions?.questions.find(
        q => q.questionKey === 'SIGNATURE'
      ) as CourseEvaluationQuestion,
    [questions]
  )

  const schema = useMemo(() => {
    const obj: Record<string, yup.StringSchema> = {}

    questions?.questions.forEach(q => {
      const s = yup.string()

      if (q.questionKey === 'SIGNATURE') {
        obj[q.id] = s.required(t('course-evaluation.required-field')).oneOf(
          [
            profile ? profile.fullName : Date.now().toString(36), // if profile doesnt exist, cant validate signature
            '',
          ],
          t('course-evaluation.invalid-signature')
        )
      } else if (q.required) {
        obj[q.id] = s.required(t('course-evaluation.required-field'))
      } else {
        obj[q.id] = s
      }
    })

    return yup.object(obj).required()
  }, [t, questions, profile])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Record<string, string>>({ resolver: yupResolver(schema) })

  useEffect(() => {
    if (!evaluation?.answers) return

    evaluation.answers.forEach(a => {
      if (a.question.type === CourseEvaluationQuestionType.BOOLEAN_REASON_N) {
        setValue
      }
      setValue(a.question.id, a.answer)
    })
  }, [setValue, evaluation])

  const isLoadingData = useMemo(
    () =>
      courseStatus === LoadingStatus.FETCHING ||
      usersDataLoading ||
      evaluationLoading ||
      questionsLoading ||
      participantDataLoading,
    [
      usersDataLoading,
      evaluationLoading,
      questionsLoading,
      courseStatus,
      participantDataLoading,
    ]
  )

  const courseHasStarted = course && courseStarted(course)

  const didAttendeeSubmitFeedback = useMemo(() => {
    return !!usersData?.users.find(u => u.profile.id === profileId)
  }, [usersData, profileId])

  const courseParticipant: CourseParticipant | null =
    participantData?.course_participant?.length > 0
      ? participantData?.course_participant[0]
      : null

  const canSubmitFeedback =
    courseHasStarted &&
    !didAttendeeSubmitFeedback &&
    courseParticipant?.attended

  const values = watch()

  const onSubmit = async (data: Record<string, string>) => {
    setError(null)
    setLoading(true)

    try {
      const answers = map(data, (answer, questionId) => {
        return {
          questionId,
          answer,
          courseId,
        }
      })

      const response = await fetcher<SaveCourseEvaluationResponseType>(
        SAVE_COURSE_EVALUATION_ANSWERS_MUTATION,
        {
          answers,
          completedEvaluation: true,
          id: courseParticipant?.id,
        }
      )

      setLoading(false)

      if (!response.inserted?.rows?.length) {
        return setError(t('course-evaluation.error-submitting'))
      }

      navigate('../details?success=course_evaluated')
    } catch (err: unknown) {
      setError(t('course-evaluation.error-submitting'))
      setLoading(false)
    }
  }

  if (isLoadingData) {
    return null
  }

  if (!canSubmitFeedback && !readOnly) {
    return <Navigate to="../details" />
  }

  return (
    <Box bgcolor="grey.100" sx={{ pb: 6 }}>
      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item md={3}>
            <Sticky top={20}>
              <Box mt={5} pr={3}>
                <BackButton label={t('back')} />

                <Typography
                  variant="h2"
                  gutterBottom
                  my={2}
                  data-testid="course-evaluation-heading"
                >
                  {t('course-evaluation.heading')}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  {course?.name}
                </Typography>

                {readOnly && (
                  <Box>
                    <Typography variant="body1">{t('attendee')}</Typography>

                    <Box mt={2}>
                      <AttendeeMenu
                        options={attendees}
                        value={profileId}
                        onSelect={(id: string) => {
                          if (
                            course?.trainers?.find(t => t.profile.id === id)
                          ) {
                            navigate(
                              `../../evaluation/submit?profile_id=${id}`,
                              {
                                replace: false,
                              }
                            )
                          } else {
                            navigate(`../../evaluation/view?profile_id=${id}`, {
                              replace: true,
                            })
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Sticky>
          </Grid>

          <Grid item md={7} pt={10}>
            {groups.map(g => (
              <QuestionGroup
                key={g}
                title={t(`course-evaluation.groups.${g}`)}
                description={
                  isAllRequired(groupedQuestions[g])
                    ? t('common.all-fields-are-mandatory')
                    : ''
                }
              >
                {groupedQuestions[g]?.map(q => (
                  <RatingQuestion
                    key={q.id}
                    title={t(`course-evaluation.questions.${q.questionKey}`)}
                    value={values[q.id]}
                    onChange={v => {
                      setValue(q.id, v ? `${v}` : '')
                    }}
                    error={errors[q.id]?.message}
                    readOnly={readOnly}
                  />
                ))}
              </QuestionGroup>
            ))}

            {ungroupedQuestions?.map(q => {
              if (booleanQuestionTypes.includes(q.type)) {
                const value = (values[q.id] ?? '').split('-')

                return (
                  <QuestionGroup
                    key={q.id}
                    title={t(`course-evaluation.questions.${q.questionKey}`)}
                    error={errors[q.id]?.message}
                  >
                    <BooleanQuestion
                      value={value[0]}
                      reason={value[1] ?? ''}
                      type={q.type}
                      onChange={(value, reason) =>
                        setValue(q.id, `${value}-${reason}`)
                      }
                      infoText={t('course-evaluation.provide-details')}
                      disabled={readOnly}
                    />
                  </QuestionGroup>
                )
              }

              if (q.type === CourseEvaluationQuestionType.TEXT) {
                return (
                  <QuestionGroup
                    key={q.id}
                    title={t(`course-evaluation.questions.${q.questionKey}`)}
                    error={errors[q.id]?.message}
                  >
                    <TextField
                      sx={{ bgcolor: 'common.white', mt: 1 }}
                      variant="filled"
                      placeholder={t('course-evaluation.your-response')}
                      inputProps={{ sx: { px: 1, py: 1.5 } }}
                      {...register(q.id)}
                      disabled={readOnly}
                      data-testid="course-evaluation-text-question"
                    />
                  </QuestionGroup>
                )
              }

              return null
            })}

            {!readOnly && signatureQuestion && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 6 }}>
                  {t('course-evaluation.signature')}
                </Typography>
                <Typography variant="body1" color="grey.600" gutterBottom>
                  {t('course-evaluation.signature-desc')}
                </Typography>
                <TextField
                  sx={{ mt: 1 }}
                  variant="filled"
                  placeholder="Full name"
                  inputProps={{
                    sx: { bgcolor: 'common.white', px: 1, py: 1.5 },
                  }}
                  fullWidth
                  {...register(signatureQuestion.id)}
                  error={!!errors[signatureQuestion.id]}
                  helperText={errors[signatureQuestion.id]?.message}
                  data-testid="course-evaluation-signature"
                />
              </>
            )}
          </Grid>
        </Grid>

        {!readOnly ? (
          <Box
            sx={{ mt: 6 }}
            alignItems="center"
            display="flex"
            flexDirection="column"
            data-testid="submit-course-evaluation"
          >
            <LoadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              {t('course-evaluation.submit')}
            </LoadingButton>

            {error && (
              <Box mt={2}>
                <FormHelperText error>{error}</FormHelperText>
              </Box>
            )}

            <Typography
              maxWidth={600}
              color="grey.600"
              sx={{ mt: 4 }}
              gutterBottom={true}
              align="center"
              variant="body2"
            >
              {t('course-evaluation.disclaimer')}
            </Typography>
          </Box>
        ) : null}
      </Container>
    </Box>
  )
}
