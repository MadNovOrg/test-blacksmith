import { Box, Typography, Grid } from '@mui/material'
import { groupBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { GetEvaluationsSummaryQuery } from '@app/generated/graphql'

import { RatingProgress } from '../RatingProgress'

const labels = ['excellent', 'good', 'average', 'fair', 'poor']
const colors = [
  'green.main',
  'success.main',
  'warning.main',
  'error.main',
  'error.dark',
]

type Props = {
  questionKey: string
  answers: NonNullable<GetEvaluationsSummaryQuery['answers']>
}

export const RatingSummary: React.FC<React.PropsWithChildren<Props>> = ({
  answers,
  questionKey,
}) => {
  const { t } = useTranslation()

  const values = useMemo(() => {
    const groups = groupBy(answers, a => a.answer)
    const num = answers?.length

    return [
      ((groups[5]?.length ?? 0) / num) * 100,
      ((groups[4]?.length ?? 0) / num) * 100,
      ((groups[3]?.length ?? 0) / num) * 100,
      ((groups[2]?.length ?? 0) / num) * 100,
      ((groups[1]?.length ?? 0) / num) * 100,
    ]
  }, [answers])

  return (
    <Box key={questionKey} bgcolor="common.white" p={2} borderRadius={1} mb={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography fontWeight="600">
          {t(`course-evaluation.questions.${questionKey}`)}
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="subtitle2">{Math.round(values[0])}%</Typography>
          <Typography variant="body2" fontWeight="600" color="green.main">
            {t(`course-evaluation.excellent`)}
          </Typography>
        </Box>
      </Box>
      <Box>
        {labels.map((label, index) => (
          <Grid container key={label} display="flex" alignItems="center">
            <Grid item flex={3} xs={7} lg={8} xl={9.5}>
              <RatingProgress
                variant="determinate"
                value={values[index]}
                color={colors[index]}
              />
            </Grid>
            <Grid flex={1} display="flex" alignItems="center">
              <Typography sx={{ textAlign: 'right', mr: 2, flex: 1 }}>
                {t(label)}
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ width: 30 }}>
                {Math.round(values[index])}%
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Box>
  )
}
