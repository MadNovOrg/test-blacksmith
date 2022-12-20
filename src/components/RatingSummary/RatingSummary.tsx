import { Box, Typography } from '@mui/material'
import { groupBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CourseEvaluationQuestionType,
  CourseEvaluationQuestionGroup,
} from '@app/types'

import { RatingProgress } from '../RatingProgress'

const labels = ['excellent', 'good', 'average', 'fair', 'poor']
const colors = [
  'green.main',
  'success.main',
  'warning.main',
  'error.main',
  'error.dark',
]

type Answers = {
  id: string
  answer: string
  question: {
    questionKey: string
    type: CourseEvaluationQuestionType
    group: CourseEvaluationQuestionGroup
  }
}

type Props = {
  questionKey: string
  answers: Answers[]
}

export const RatingSummary: React.FC<Props> = ({ answers, questionKey }) => {
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
          <Typography variant="subtitle2">{values[0]}%</Typography>
          <Typography variant="body2" fontWeight="600" color="green.main">
            {t(`course-evaluation.excellent`)}
          </Typography>
        </Box>
      </Box>
      <Box>
        {labels.map((label, index) => (
          <Box key={label} display="flex" alignItems="center">
            <Box flex={3}>
              <RatingProgress
                variant="determinate"
                value={values[index]}
                color={colors[index]}
              />
            </Box>
            <Box flex={1} display="flex" alignItems="center">
              <Typography sx={{ textAlign: 'right', mr: 2, flex: 1 }}>
                {t(label)}
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ width: 30 }}>
                {values[index]}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
