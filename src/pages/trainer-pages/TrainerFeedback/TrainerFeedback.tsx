import { yupResolver } from '@hookform/resolvers/yup'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Container,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/material'
import { groupBy, map } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import * as yup from 'yup'

import { BackButton } from '@app/components/BackButton'
import { BooleanQuestion } from '@app/components/BooleanQuestion'
import { QuestionGroup } from '@app/components/QuestionGroup'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import { SaveTrainerCourseEvaluationMutation } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import useCourse from '@app/hooks/useCourse'
import {
  QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY,
  ResponseType as GetCourseEvaluationQuestionsResponseType,
} from '@app/queries/course-evaluation/get-questions'
import { MUTATION as SAVE_TRAINER_COURSE_EVALUATION_ANSWERS_MUTATION } from '@app/queries/course-evaluation/save-trainer-evaluation'
import {
  CourseEvaluationQuestion,
  CourseEvaluationQuestionType,
} from '@app/types'

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
  const { id: courseId } = useParams()
  const { profile } = useAuth()

  const { data: course } = useCourse(courseId ?? '')
  const [loading, setLoading] = useState(false)

  const { data: questions } = useSWR<GetCourseEvaluationQuestionsResponseType>(
    GET_COURSE_EVALUATION_QUESTIONS_QUERY
  )

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

  const values = watch()

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true)

    try {
      const answers = map(data, (answer, questionId) => {
        return {
          questionId,
          answer,
          courseId,
        }
      })

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

      navigate('../../details?success=course_evaluated')
    } catch (err: unknown) {
      setError(t('course-evaluation.error-submitting'))
      setLoading(false)
    }
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
                  {t('course-evaluation.trainer-heading')}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  {course?.name}
                </Typography>
              </Box>
            </Sticky>
          </Grid>

          <Grid item md={7} pt={10}>
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
                      reason={value[1] || ''}
                      type={q.type}
                      onChange={(value, reason) =>
                        setValue(q.id, `${value}-${reason}`)
                      }
                      infoText={t('course-evaluation.provide-details')}
                      data-testid="course-evaluation-boolean-question"
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
                inputProps={{ sx: { bgcolor: 'common.white', px: 1, py: 1.5 } }}
                fullWidth
                {...register(signatureQuestion.id)}
                error={!!errors[signatureQuestion.id]}
                helperText={errors[signatureQuestion.id]?.message}
                data-testid="course-evaluation-signature"
              />
            )}
          </Grid>
        </Grid>

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
        </Box>
      </Container>
    </Box>
  )
}
