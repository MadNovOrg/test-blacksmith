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
import { groupBy, map } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from 'urql'
import * as yup from 'yup'

import { BackButton } from '@app/components/BackButton'
import { BooleanQuestion } from '@app/components/BooleanQuestion'
import { QuestionGroup } from '@app/components/QuestionGroup'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Evaluation_Question_Type_Enum,
  GetCourseEvaluationQuestionsQuery,
  GetEvaluationQuery,
  GetEvaluationQueryVariables,
  SaveTrainerCourseEvaluationMutation,
  SaveTrainerCourseEvaluationMutationVariables,
} from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { QUERY as GET_ANSWERS_QUERY } from '@app/modules/course_evaluation/queries/get-answers'
import { QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY } from '@app/modules/course_evaluation/queries/get-questions'
import { MUTATION as SAVE_TRAINER_COURSE_EVALUATION_ANSWERS_MUTATION } from '@app/modules/course_evaluation/queries/save-trainer-evaluation'
import { validUserSignature } from '@app/util'

const booleanQuestionTypes = [
  Course_Evaluation_Question_Type_Enum.Boolean,
  Course_Evaluation_Question_Type_Enum.BooleanReasonY,
  Course_Evaluation_Question_Type_Enum.BooleanReasonN,
]

export const TrainerFeedback = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { id: courseId = '' } = useParams()
  const { profile } = useAuth()
  const { addSnackbarMessage } = useSnackbar()

  const { data: courseData } = useCourse(courseId)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const [, saveTrainerCourseEvaluation] = useMutation<
    SaveTrainerCourseEvaluationMutation,
    SaveTrainerCourseEvaluationMutationVariables
  >(SAVE_TRAINER_COURSE_EVALUATION_ANSWERS_MUTATION)

  const profileId = searchParams.get('profile_id') as string
  const readOnly = !!profileId

  const [{ data: questionsData }] = useQuery<GetCourseEvaluationQuestionsQuery>(
    {
      query: GET_COURSE_EVALUATION_QUESTIONS_QUERY,
    }
  )

  const [{ data: evaluation }] = useQuery<
    GetEvaluationQuery,
    GetEvaluationQueryVariables
  >({
    query: GET_ANSWERS_QUERY,
    variables: { courseId: Number(courseId) ?? 0, profileId },
    pause: !profileId,
  })

  const dataLoaded = !!questionsData && (readOnly ? !!evaluation : true)

  const hasSubmitted = useMemo(() => {
    return Boolean(evaluation?.answers.length)
  }, [evaluation])

  const questions = useMemo(() => {
    if (questionsData?.questions.length) {
      return questionsData?.questions.filter(
        q => !['ATTENDEE_ADDITIONAL_COMMENTS'].includes(q.questionKey ?? '')
      )
    }
  }, [questionsData?.questions])

  const { UNGROUPED: ungroupedQuestions } = groupBy(
    questions,
    q => q.group || 'UNGROUPED'
  )

  const signatureQuestion = useMemo(
    () =>
      questions?.find(
        q => q.questionKey === 'SIGNATURE'
      ) as GetCourseEvaluationQuestionsQuery['questions'][0],
    [questions]
  )

  const schema = useMemo(() => {
    const obj: Record<string, yup.StringSchema> = {}

    questions?.forEach(q => {
      if (q.type === Course_Evaluation_Question_Type_Enum.Rating) return

      const s = yup.string()
      if (q.questionKey === 'SIGNATURE') {
        obj[q.id] = s
          .required(t('course-evaluation.required-field'))
          .test(q.id, t('course-evaluation.invalid-signature'), signature =>
            validUserSignature(profile?.fullName, signature)
          )
      } else if (
        q.required &&
        q.type === Course_Evaluation_Question_Type_Enum.BooleanReasonY
      ) {
        obj[q.id] = s.required(t('course-evaluation.required-field'))
        obj['yesResponse'] = s.when(q.id, {
          is: 'NO-',
          then: s => s.nullable(),
          otherwise: s => s.required(t('course-evaluation.required-answer')),
        })
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
  const values = watch()

  useEffect(() => {
    if (!evaluation?.answers) return
    evaluation.answers.forEach(a => {
      setValue(a.question.id, a.answer ?? '')
    })
  }, [setValue, evaluation])

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true)

    try {
      const answers = map(data, (answer, questionId) => {
        return {
          questionId,
          answer,
          courseId: Number(courseId ?? 0),
        }
      }).filter(({ questionId }) => !questionId.includes('Response'))

      const { data: response } = await saveTrainerCourseEvaluation({
        answers,
      })
      setLoading(false)

      if (!response?.inserted?.rows?.length) {
        return setError(t('course-evaluation.error-submitting'))
      }

      addSnackbarMessage('course-evaluated', {
        label: t('course-evaluation.saved'),
      })
      navigate('../../details?tab=EVALUATION')
    } catch (err: unknown) {
      setError(t('course-evaluation.error-submitting'))
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dataLoaded && !hasSubmitted && readOnly) {
      navigate('../../details?tab=EVALUATION')
    }
  }, [dataLoaded, hasSubmitted, readOnly, navigate])

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
                    {t('course-evaluation.trainer-heading')}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    {courseData?.course?.name}
                  </Typography>
                </Box>
              </Sticky>
            </Grid>

            <Grid item md={7} pt={10}>
              {ungroupedQuestions?.map(q => {
                if (
                  booleanQuestionTypes.includes(
                    q.type as Course_Evaluation_Question_Type_Enum
                  )
                ) {
                  const [value, reason = ''] = (values[q.id] ?? '').split('-')

                  return (
                    <QuestionGroup
                      key={q.id}
                      title={t(`course-evaluation.questions.${q.questionKey}`)}
                      error={errors[q.id]?.message}
                    >
                      <BooleanQuestion
                        value={value}
                        reason={reason}
                        type={q.type}
                        onChange={(value, reason) => {
                          setValue(q.id, `${value}-${reason}`)
                        }}
                        infoText={t('course-evaluation.provide-details')}
                        data-testid="course-evaluation-boolean-question"
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
                        placeholder={t('course-evaluation.your-response')}
                        inputProps={{ sx: { px: 1, py: 1.5 } }}
                        data-testid="course-evaluation-text-question"
                        {...register(q.id)}
                        disabled={readOnly}
                      />
                    </QuestionGroup>
                  )
                }

                return null
              })}

              <Typography variant="h6" gutterBottom sx={{ mt: 6 }}>
                {t('course-evaluation.signature')}
              </Typography>
              <Typography variant="body1" color="grey.600" gutterBottom>
                {t('course-evaluation.signature-desc')}
              </Typography>

              {signatureQuestion && (
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
                  disabled={readOnly}
                />
              )}
            </Grid>
          </Grid>

          {!readOnly && (
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
                onClick={handleSubmit(onSubmit)}
              >
                {t('course-evaluation.submit')}
              </LoadingButton>

              {error && (
                <Box mt={2}>
                  <FormHelperText error>{error}</FormHelperText>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </FormProvider>
  )
}
