import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { Alert, Container, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { groupBy, map } from 'lodash-es'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

import { BackButton } from '@app/components/BackButton'
import { QuestionGroup } from '@app/components/QuestionGroup'
import { BooleanQuestion } from '@app/components/BooleanQuestion'

import { useAuth } from '@app/context/auth'

import useCourse from '@app/hooks/useCourse'
import { useFetcher } from '@app/hooks/use-fetcher'

import {
  CourseEvaluationQuestion,
  CourseEvaluationQuestionType,
} from '@app/types'
import {
  QUERY as GET_COURSE_EVALUATION_QUESTIONS_QUERY,
  ResponseType as GetCourseEvaluationQuestionsResponseType,
} from '@app/queries/course-evaluation/get-questions'
import {
  QUERY as GET_COURSE_EVALUATION_ANSWERS_QUERY,
  ResponseType as GetCourseEvaluationAnswersResponseType,
  ParamsType as GetCourseEvaluationAnswersParamsType,
} from '@app/queries/course-evaluation/get-answers'
import { MUTATION as SAVE_COURSE_EVALUATION_ANSWERS_MUTATION } from '@app/queries/course-evaluation/save-evaluation'

const booleanQuestionTypes = [
  CourseEvaluationQuestionType.BOOLEAN,
  CourseEvaluationQuestionType.BOOLEAN_REASON_Y,
  CourseEvaluationQuestionType.BOOLEAN_REASON_N,
]

export const TrainerFeedback = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { id: courseId } = useParams()
  const { profile } = useAuth()

  const { data: evaluation, mutate: refetchAnswers } = useSWR<
    GetCourseEvaluationAnswersResponseType,
    Error,
    [string, GetCourseEvaluationAnswersParamsType]
  >([GET_COURSE_EVALUATION_ANSWERS_QUERY, { courseId: courseId as string }])

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
    const obj: Record<string, yup.AnySchema> = {}

    questions?.questions.forEach(q => {
      const s = yup.string()

      if (q.questionKey === 'SIGNATURE') {
        obj[q.id] = s.required(t('course-evaluation.required-field')).oneOf(
          [
            profile ? profile.fullName : Date.now().toString(36), // if profile doesnt exist, cant validate signature
            null,
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

      await fetcher(SAVE_COURSE_EVALUATION_ANSWERS_MUTATION, { answers })
      setLoading(false)
      refetchAnswers()
    } catch (err: unknown) {
      // TODO: display generic error mesaage to user? Need designs
      setLoading(false)
    }
  }

  if (evaluation?.answers.length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={5}
        mb={5}
      >
        <Alert variant="outlined" color="success" sx={{ mb: 3 }}>
          {t('course-evaluation.saved')}
        </Alert>
      </Box>
    )
  }

  return (
    <Box bgcolor="grey.100" sx={{ pb: 6 }}>
      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item md={3}>
            <Box mt={5} pr={3}>
              <BackButton label={t('back')} />

              <Typography variant="h2" gutterBottom my={2}>
                {t('course-evaluation.trainer-heading')}
              </Typography>

              <Typography variant="h6" gutterBottom>
                {course?.name}
              </Typography>
            </Box>
          </Grid>

          <Grid item md={7} pt={10}>
            {ungroupedQuestions?.map(q => {
              if (booleanQuestionTypes.includes(q.type)) {
                return (
                  <QuestionGroup
                    key={q.id}
                    title={t(`course-evaluation.questions.${q.questionKey}`)}
                    error={errors[q.id]?.message}
                  >
                    <BooleanQuestion
                      value={((values[q.id] ?? '') as string).split('-')[0]}
                      reason=""
                      type={q.type}
                      onChange={(value, reason) =>
                        setValue(q.id, `${value}-${reason}`)
                      }
                      infoText={t('course-evaluation.provide-details')}
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
                      variant="standard"
                      placeholder={t('course-evaluation.your-response')}
                      inputProps={{ sx: { px: 1, py: 1.5 } }}
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
                variant="standard"
                placeholder="Full name"
                inputProps={{ sx: { bgcolor: 'common.white', px: 1, py: 1.5 } }}
                fullWidth
                {...register(signatureQuestion.id)}
                error={!!errors[signatureQuestion.id]}
                helperText={errors[signatureQuestion.id]?.message}
              />
            )}
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 6 }}
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
            data-testid="submit-course-evaluation"
            size="large"
          >
            {t('course-evaluation.submit')}
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
}
