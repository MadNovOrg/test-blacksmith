import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { groupBy, map } from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { LinkBehavior } from '@app/components/LinkBehavior'
import { RatingSummary } from '@app/components/RatingSummary'
import { Sticky } from '@app/components/Sticky'
import {
  GetEvaluationsSummaryRestrictedQuery,
  GetEvaluationsSummaryRestrictedQueryVariables,
} from '@app/generated/graphql'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { GET_EVALUATIONS_SUMMARY_QUERY_RESTRICTED } from '@app/queries/course-evaluation/get-evaluation-summary-restricted'
import {
  CourseEvaluationGroupedQuestion,
  CourseEvaluationQuestionGroup,
} from '@app/types'

const groups = [
  CourseEvaluationQuestionGroup.TRAINING_RATING,
  CourseEvaluationQuestionGroup.TRAINING_RELEVANCE,
  CourseEvaluationQuestionGroup.TRAINER_STANDARDS,
  CourseEvaluationQuestionGroup.MATERIALS_AND_VENUE,
]

const normalizeAnswers = (
  answers: GetEvaluationsSummaryRestrictedQuery['answers']
) => {
  const { UNGROUPED: ungroupedAnswers, ...groupedAnswers } = groupBy(
    answers,
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
    a.answer?.startsWith('YES') ? 'YES' : 'NO'
  )

  return {
    grouped,
    ungrouped,
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
}

export const EvaluationSummary = () => {
  const params = useParams()
  const { t } = useTranslation()

  const courseId = params.id as string

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

  const [{ data, fetching }] = useQuery<
    GetEvaluationsSummaryRestrictedQuery,
    GetEvaluationsSummaryRestrictedQueryVariables
  >({
    query: GET_EVALUATIONS_SUMMARY_QUERY_RESTRICTED,
    requestPolicy: 'cache-and-network',
    variables: {
      courseId: Number(courseId),
    },
  })

  const attendeeAnswers = useMemo(() => data?.answers ?? [], [data])

  const { grouped } = useMemo(
    () => normalizeAnswers(attendeeAnswers),
    [attendeeAnswers]
  )

  if (fetching) {
    return <CircularProgress />
  }

  return (
    <FullHeightPageLayout>
      <Box bgcolor="grey.100" sx={{ pb: 6 }}>
        <Container>
          <Grid container>
            <Grid item md={3} xs={12}>
              <Sticky top={20}>
                <Box mt={5} pr={3}>
                  <BackButton label={t('back')} />

                  <Typography variant="h2" gutterBottom my={2}>
                    {t('pages.course-details.tabs.evaluation.title')}
                  </Typography>

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
                      {t('pages.course-details.tabs.evaluation.evaluation')}
                    </Button>
                  </Box>
                </Box>
              </Sticky>
            </Grid>

            <Grid item md={7} xs={12} pt={10}>
              <Typography id="evaluation" variant="h3">
                {t('pages.course-details.tabs.evaluation.evaluation')}
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </FullHeightPageLayout>
  )
}
