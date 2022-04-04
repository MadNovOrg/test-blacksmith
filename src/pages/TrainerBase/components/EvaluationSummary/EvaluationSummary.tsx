import React, { useEffect, useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { groupBy, map, uniqBy } from 'lodash-es'

import { BackButton } from '@app/components/BackButton'
import { RatingSummary } from '@app/components/RatingSummary'
import { RatingProgress } from '@app/components/RatingProgress'
import { QuestionGroup } from '@app/components/QuestionGroup'
import { BooleanQuestion } from '@app/components/BooleanQuestion'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { AttendeeMenu } from '@app/components/AttendeeMenu'

import { useAuth } from '@app/context/auth'

import {
  QUERY as GET_EVALUATIONS_SUMMARY_QUERY,
  ResponseType as GetEvaluationsSummaryResponseType,
  ParamsType as GetEvaluationsSummaryParamsType,
} from '@app/queries/course-evaluation/get-evaluations-summary'
import {
  CourseEvaluationQuestionGroup,
  CourseEvaluationQuestionType,
} from '@app/types'

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

const QuestionText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.colors.navy[50],
  marginBottom: theme.spacing(1),
  display: 'inline',
}))

export const EvaluationSummary = () => {
  const params = useParams()
  const { profile } = useAuth()
  const { t } = useTranslation()
  const courseId = params.id as string
  const profileId = profile?.id as string

  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0)
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView()
        }
      }, 0)
    }
  }, [pathname, hash, key])

  const { data, error } = useSWR<
    GetEvaluationsSummaryResponseType,
    Error,
    [string, GetEvaluationsSummaryParamsType]
  >([GET_EVALUATIONS_SUMMARY_QUERY, { courseId }])
  const loading = !data && !error

  const { trainerAnswers, attendeeAnswers } = useMemo(() => {
    const { trainer, attendee } = groupBy(data?.answers, a =>
      a.profile.id === profileId ? 'trainer' : 'attendee'
    )

    return {
      trainerAnswers: trainer?.sort(a =>
        booleanQuestionTypes.includes(a.question.type) ? -1 : 0
      ),
      attendeeAnswers: attendee,
    }
  }, [data, profileId])

  const attendees = useMemo(() => {
    return uniqBy(
      attendeeAnswers?.map(a => ({
        id: a.profile.id,
        name: a.profile.fullName,
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80', // TODO:
      })) ?? [],
      u => u.id
    )
  }, [attendeeAnswers])

  const { grouped, ungrouped, injuryQuestion } = useMemo(() => {
    const { UNGROUPED: ungroupedAnswers, ...groupedAnswers } = groupBy(
      attendeeAnswers,
      a => a.question.group || 'UNGROUPED'
    )

    const grouped = {} as Record<
      CourseEvaluationQuestionGroup,
      Record<string, GetEvaluationsSummaryResponseType['answers']>
    >

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
      injuryQuestion: {
        yes: ((injuryResponse.YES?.length ?? 0) / injuryQuestion.length) * 100,
        no: ((injuryResponse.NO?.length ?? 0) / injuryQuestion.length) * 100,
      },
    }
  }, [attendeeAnswers])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Box bgcolor="grey.100" sx={{ pb: 6 }}>
      <Container>
        <Grid container>
          <Grid item md={3}>
            <Box mt={5} pr={3}>
              <BackButton label={t('back')} />

              <Typography variant="h2" gutterBottom my={2}>
                {t('pages.course-details.tabs.evaluation.title')}
              </Typography>

              <Box mb={4}>
                <AttendeeMenu
                  options={attendees}
                  placeholder={t(
                    'pages.course-details.tabs.evaluation.full-summary'
                  )}
                />
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <Button
                  component={LinkBehavior}
                  href="#evaluation"
                  sx={{ mb: 1 }}
                >
                  {t('evaluation')}
                </Button>
                <Button
                  component={LinkBehavior}
                  href="#attendee-feedback"
                  sx={{ mb: 1 }}
                >
                  {t('pages.course-details.tabs.evaluation.attendee-feedback')}
                </Button>
                <Button
                  component={LinkBehavior}
                  href="#trainer-feedback"
                  sx={{ mb: 1 }}
                >
                  {t('pages.course-details.tabs.evaluation.trainer-feedback')}
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item md={7} pt={10}>
            <Typography id="evaluation" variant="h3">
              {t('evaluation')}
            </Typography>

            <Box>
              {groups.map(g => {
                return (
                  <Box key={g}>
                    <Typography variant="subtitle2" mt={2} mb={1}>
                      {t(`course-evaluation.groups.${g}`)}
                    </Typography>
                    {map(grouped[g], (answers, questionKey) => {
                      return (
                        <RatingSummary
                          key={questionKey}
                          questionKey={questionKey}
                          answers={answers}
                        />
                      )
                    })}
                  </Box>
                )
              })}
            </Box>

            <Typography variant="h3" mt={4} mb={3} id="attendee-feedback">
              {t('pages.course-details.tabs.evaluation.attendee-feedback')}
            </Typography>

            <Box>
              <Box mb={2}>
                <Typography variant="subtitle2" mb={1}>
                  {t(`course-evaluation.questions.ANY_INJURIES`)}
                </Typography>
                <Box bgcolor="common.white" p={2} pb={1}>
                  <Box display="flex" alignItems="center">
                    <Box flex={3}>
                      <RatingProgress
                        variant="determinate"
                        value={injuryQuestion.yes}
                        color="navy.100"
                      />
                    </Box>
                    <Box flex={1} display="flex">
                      <Typography sx={{ textAlign: 'right', mr: 2, flex: 1 }}>
                        {t('yes')}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ width: 30 }}
                      >
                        {injuryQuestion.yes}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box flex={3}>
                      <RatingProgress
                        variant="determinate"
                        value={injuryQuestion.no}
                        color="navy.100"
                      />
                    </Box>
                    <Box flex={1} display="flex" alignItems="center">
                      <Typography sx={{ textAlign: 'right', mr: 2, flex: 1 }}>
                        {t('no')}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        sx={{ width: 30 }}
                      >
                        {injuryQuestion.no}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {map(ungrouped, (answers, questionKey) => {
                if (questionKey === 'SIGNATURE') return null

                return (
                  <Box key={questionKey} mb={2}>
                    <Typography variant="subtitle2" mb={1}>
                      {t(`course-evaluation.questions.${questionKey}`)}
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                      bgcolor="common.white"
                      p={1}
                      pb={0}
                    >
                      {answers.map(a => (
                        <QuestionText key={a.id}>{a.answer}</QuestionText>
                      ))}
                    </Box>
                  </Box>
                )
              })}
            </Box>

            <Typography variant="h3" mt={4} mb={3} id="trainer-feedback">
              {t('pages.course-details.tabs.evaluation.trainer-feedback')}
            </Typography>
            <Typography variant="subtitle2"></Typography>

            {trainerAnswers?.map(a => {
              if (booleanQuestionTypes.includes(a.question.type)) {
                const value = a.answer.split('-')

                return (
                  <QuestionGroup
                    key={a.id}
                    title={t(
                      `course-evaluation.questions.${a.question.questionKey}`
                    )}
                  >
                    <BooleanQuestion
                      value={value[0]}
                      reason={value[1] || ''}
                      type={a.question.type}
                      infoText={t('course-evaluation.provide-details')}
                    />
                  </QuestionGroup>
                )
              }

              if (a.question.type === CourseEvaluationQuestionType.TEXT) {
                return (
                  <QuestionGroup
                    key={a.id}
                    title={t(
                      `course-evaluation.questions.${a.question.questionKey}`
                    )}
                  >
                    <Box bgcolor="common.white" px={1} py={2}>
                      <QuestionText key={a.id}>{a.answer}</QuestionText>
                    </Box>
                  </QuestionGroup>
                )
              }

              return null
            })}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
