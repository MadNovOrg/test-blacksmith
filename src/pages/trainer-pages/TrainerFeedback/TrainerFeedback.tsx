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
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import * as yup from 'yup'

import { BackButton } from '@app/components/BackButton'
import { BooleanQuestion } from '@app/components/BooleanQuestion'
import { QuestionGroup } from '@app/components/QuestionGroup'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { useSnackbar } from '@app/context/snackbar'
import { SaveTrainerCourseEvaluationMutation } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import {
  ParamsType as GetAnswersParamsType,
  QUERY as GET_ANSWERS_QUERY,
  ResponseType as GetAnswersResponseType,
} from '@app/queries/course-evaluation/get-answers'
import {
  QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY,
  ResponseType as GetCourseEvaluationQuestionsResponseType,
} from '@app/queries/course-evaluation/get-questions'
import { MUTATION as SAVE_TRAINER_COURSE_EVALUATION_ANSWERS_MUTATION } from '@app/queries/course-evaluation/save-trainer-evaluation'
import {
  CourseEvaluationQuestion,
  CourseEvaluationQuestionType,
} from '@app/types'
import { validUserSignature } from '@app/util'

const booleanQuestionTypes = [
  CourseEvaluationQuestionType.BOOLEAN,
  CourseEvaluationQuestionType.BOOLEAN_REASON_Y,
  CourseEvaluationQuestionType.BOOLEAN_REASON_N,
]

export const TrainerFeedback = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { id: courseId = '' } = useParams()
  const { profile } = useAuth()
  const { addSnackbarMessage } = useSnackbar()

  const { data: courseData } = useCourse(courseId)
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const profileId = searchParams.get('profile_id') as string
  const readOnly = !!profileId

  const { data: questions } = useSWR<GetCourseEvaluationQuestionsResponseType>(
    GET_COURSE_EVALUATION_QUESTIONS_QUERY
  )

  const { data: evaluation } = useSWR<
    GetAnswersResponseType,
    Error,
    [string, GetAnswersParamsType] | null
  >(
    profileId
      ? [GET_ANSWERS_QUERY, { courseId: courseId as string, profileId }]
      : null
  )

  const dataLoaded = !!questions && (readOnly ? !!evaluation : true)

  const hasSubmitted = useMemo(() => {
    return Boolean(evaluation?.answers.length)
  }, [evaluation])

  const { UNGROUPED: ungroupedQuestions } = groupBy(
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
      if (q.type === CourseEvaluationQuestionType.RATING) return

      const s = yup.string()
      if (q.questionKey === 'SIGNATURE') {
        obj[q.id] = s
          .required(t('course-evaluation.required-field'))
          .test(q.id, t('course-evaluation.invalid-signature'), signature =>
            validUserSignature(profile?.fullName, signature)
          )
      } else if (
        q.required &&
        q.type === CourseEvaluationQuestionType.BOOLEAN_REASON_Y
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
      setValue(a.question.id, a.answer)
    })
  }, [setValue, evaluation])

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true)

    try {
      const answers = map(data, (answer, questionId) => {
        return {
          questionId,
          answer,
          courseId,
        }
      }).filter(({ questionId }) => !questionId.includes('Response'))

      const response = await fetcher<SaveTrainerCourseEvaluationMutation>(
        SAVE_TRAINER_COURSE_EVALUATION_ANSWERS_MUTATION,
        {
          answers,
        }
      )
      setLoading(false)

      if (!response.inserted?.rows?.length) {
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
                if (booleanQuestionTypes.includes(q.type)) {
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
