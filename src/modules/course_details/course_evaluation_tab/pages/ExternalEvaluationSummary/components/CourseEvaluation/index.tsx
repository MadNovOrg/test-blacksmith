import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  Box,
  Container,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { groupBy, map, uniqBy } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import * as yup from 'yup'

import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Evaluation_Question_Group_Enum,
  Course_Evaluation_Question_Type_Enum,
  GetCourseEvaluationQuestionsQuery,
  GetCourseParticipantIdQuery,
  GetCourseParticipantIdQueryVariables,
  GetEvaluationQuery,
  GetEvaluationQueryVariables,
  SaveCourseEvaluationMutation,
  SaveCourseEvaluationMutationVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { AttendeeMenu } from '@app/modules/course_details/course_attendees_tab/components/AttendeeMenu'
import { BooleanQuestion } from '@app/modules/course_details/course_evaluation_tab/components/BooleanQuestion'
import { QuestionGroup } from '@app/modules/course_details/course_evaluation_tab/components/QuestionGroup'
import { RatingQuestion } from '@app/modules/course_details/course_evaluation_tab/components/RatingQuestion'
import { QUERY as GET_ANSWERS_QUERY } from '@app/modules/course_details/course_evaluation_tab/queries/get-answers'
import {
  ParamsType as GetFeedbackUsersParamsType,
  QUERY as GET_FEEDBACK_USERS_QUERY,
  ResponseType as GetFeedbackUsersResponseType,
} from '@app/modules/course_details/course_evaluation_tab/queries/get-feedback-users'
import { QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY } from '@app/modules/course_details/course_evaluation_tab/queries/get-questions'
import { MUTATION as SAVE_COURSE_EVALUATION_ANSWERS_MUTATION } from '@app/modules/course_details/course_evaluation_tab/queries/save-evaluation'
import { GET_PARTICIPANT } from '@app/queries/participants/get-course-participant-by-profile-id'
import { courseStarted, LoadingStatus, validUserSignature } from '@app/util'

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

function isAllRequired(
  questions: GetCourseEvaluationQuestionsQuery['questions'],
) {
  return questions?.every(q => q.required) ?? false
}

export const CourseEvaluation = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const [searchParams] = useSearchParams()
  const { acl, profile } = useAuth()
  const courseId = params.id as string
  const profileId = searchParams.get('profile_id') as string
  const readOnly = !!profileId

  const { data: courseData, status: courseStatus } = useCourse(courseId ?? '')
  const [{ data: participantData, fetching: participantDataLoading }] =
    useQuery<GetCourseParticipantIdQuery, GetCourseParticipantIdQueryVariables>(
      {
        query: GET_PARTICIPANT,
        variables: { profileId: profile?.id, courseId: Number(courseId) ?? 0 },
      },
    )

  const [{ data: questionsData, fetching: questionsLoading }] =
    useQuery<GetCourseEvaluationQuestionsQuery>({
      query: GET_COURSE_EVALUATION_QUESTIONS_QUERY,
    })

  const [{ data: evaluation, fetching: evaluationLoading }] = useQuery<
    GetEvaluationQuery,
    GetEvaluationQueryVariables
  >({
    query: GET_ANSWERS_QUERY,
    variables: { courseId: Number(courseId) ?? 0, profileId },
    pause: !profileId,
  })
  const [{ data: usersData, fetching: usersDataLoading }] = useQuery<
    GetFeedbackUsersResponseType,
    GetFeedbackUsersParamsType
  >({
    query: GET_FEEDBACK_USERS_QUERY,
    variables: { courseId },
    pause: !profileId,
  })

  const [{ fetching: loading }, saveCourseEvaluation] = useMutation<
    SaveCourseEvaluationMutation,
    SaveCourseEvaluationMutationVariables
  >(SAVE_COURSE_EVALUATION_ANSWERS_MUTATION)

  const course = courseData?.course

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
            ],
      ) ?? [],
      u => u.id,
    )
  }, [usersData, profile])

  const didAttendeeSubmitFeedback = useMemo(() => {
    return !!usersData?.users.find(u => u.profile.id === profileId)
  }, [usersData, profileId])

  const questions = useMemo(() => {
    if (questionsData?.questions.length) {
      if (acl.isIndividual() || didAttendeeSubmitFeedback) {
        return questionsData.questions.filter(
          q =>
            ![
              'ANY_INJURIES',
              'ISSUES_ARISING_FROM_COURSE',
              'TRAINER_COMMENTS',
            ].includes(q.questionKey ?? ''),
        )
      }

      return questionsData.questions
    }
  }, [questionsData?.questions, acl, didAttendeeSubmitFeedback])

  const { UNGROUPED: ungroupedQuestions, ...groupedQuestions } = useMemo(
    () => groupBy(questions, q => q.group || 'UNGROUPED'),
    [questions],
  )

  const signatureQuestion = useMemo(
    () =>
      questions?.find(
        q => q.questionKey === 'SIGNATURE',
      ) as GetCourseEvaluationQuestionsQuery['questions'][0],
    [questions],
  )

  const schema = useMemo(() => {
    const obj: Record<string, yup.StringSchema> = {}

    questions?.forEach(q => {
      const s = yup.string()

      if (q.questionKey === 'SIGNATURE') {
        obj[q.id] = s
          .required(t('course-evaluation.required-field'))
          .test(q.id, t('course-evaluation.invalid-signature'), signature =>
            validUserSignature(profile?.fullName, signature),
          )
      } else if (q.required) {
        obj[q.id] = s.required(t('course-evaluation.required-field'))
      } else {
        obj[q.id] = s
      }
    })

    return yup.object(obj).required()
  }, [t, questions, profile])

  const methods = useForm<Record<string, string>>({
    resolver: yupResolver(schema),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (!evaluation?.answers) return

    evaluation?.answers.forEach(a => {
      setValue(a.question.id, a.answer ?? '')
    })
  }, [setValue, evaluation?.answers])

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
    ],
  )

  const courseHasStarted = course && courseStarted(course)

  const courseParticipant:
    | GetCourseParticipantIdQuery['course_participant'][0]
    | null = useMemo(
    () =>
      participantData && participantData?.course_participant?.length > 0
        ? participantData?.course_participant[0]
        : null,
    [participantData],
  )

  const canSubmitFeedback =
    courseHasStarted &&
    !didAttendeeSubmitFeedback &&
    courseParticipant?.attended

  const values = watch()

  const onSubmit = async (data: Record<string, string>) => {
    setError(null)
    const answers = map(data, (answer, questionId) => {
      return {
        questionId,
        answer,
        courseId: Number(courseId ?? 0),
      }
    })

    const { data: response, error } = await saveCourseEvaluation({
      answers,
      completedEvaluation: true,
      id: courseParticipant?.id,
    })

    if (!response?.inserted?.rows?.length) {
      return setError(t('course-evaluation.error-submitting'))
    } else {
      navigate('../details?success=course_evaluated')
    }
    if (error) {
      setError(t('course-evaluation.error-submitting'))
    }
  }

  if (isLoadingData) {
    return null
  }

  if (!canSubmitFeedback && !readOnly) {
    return <Navigate to="../details" />
  }

  return (
    <FormProvider {...methods}>
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
                                },
                              )
                            } else {
                              navigate(
                                `../../evaluation/view?profile_id=${id}`,
                                {
                                  replace: true,
                                },
                              )
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
                if (
                  booleanQuestionTypes.includes(
                    q.type as Course_Evaluation_Question_Type_Enum,
                  )
                ) {
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

                if (q.type === Course_Evaluation_Question_Type_Enum.Text) {
                  return (
                    <QuestionGroup
                      key={q.id}
                      title={t(`course-evaluation.questions.${q.questionKey}`)}
                      error={errors[q.id]?.message}
                    >
                      <TextField
                        sx={{ bgcolor: 'common.white', mt: 1 }}
                        variant="filled"
                        multiline
                        minRows={3}
                        style={{
                          resize: 'none',
                          overflow: 'hidden',
                        }}
                        placeholder={t('course-evaluation.your-response')}
                        inputProps={
                          q.questionKey === 'ATTENDEE_ADDITIONAL_COMMENTS'
                            ? { maxLength: 300, sx: { px: 1, py: 1.5, pt: 0 } }
                            : {}
                        }
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
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {t(
                      'components.course-form.name-and-surname-validation-info',
                    )}
                  </Alert>
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
                <Trans i18nKey="course-evaluation.disclaimer">
                  <a
                    target="_blank"
                    href={`https://www.teamteach.com/policies-procedures/privacy-policy/`}
                    aria-label={`${t('privacy-policy')} (${t(
                      'opens-new-window',
                    )})`}
                    rel="noreferrer"
                  />
                </Trans>
              </Typography>
            </Box>
          ) : null}
        </Container>
      </Box>
    </FormProvider>
  )
}
