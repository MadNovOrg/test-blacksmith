import { Box, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseEvaluationQuestionType } from '@app/types'
import { noop } from '@app/util'

type BooleanQuestionProps = {
  type: CourseEvaluationQuestionType
  value: string
  reason: string
  onChange?: (value: string, reason: string) => void
  infoText?: string
  disabled?: boolean
}

const style = {
  bgcolor: 'common.white',
  borderColor: 'grey.300',
  borderWidth: 1,
  borderRadius: 1,
  borderStyle: 'solid',
  px: 2,
  m: 0,
  flex: 1,
  color: 'grey.600',
  '& + &': { ml: 2 },
}

export const BooleanQuestion: React.FC<BooleanQuestionProps> = ({
  type,
  value,
  reason,
  onChange = noop,
  infoText,
  disabled = false,
}) => {
  const { t } = useTranslation()

  return (
    <FormControl>
      <RadioGroup
        onChange={(event, newValue: string) => onChange(newValue, reason)}
        row
        sx={{ mt: 1 }}
        value={value}
        data-testid="course-evaluation-boolean-question"
      >
        <FormControlLabel
          sx={style}
          value="YES"
          control={<Radio />}
          label={t<string>('yes')}
          disabled={disabled}
          data-testid="rating-yes"
        />
        <FormControlLabel
          sx={style}
          value="NO"
          control={<Radio />}
          label={t<string>('no')}
          disabled={disabled}
          data-testid="rating-no"
        />
      </RadioGroup>
      {type === CourseEvaluationQuestionType.BOOLEAN_REASON_Y &&
        value === 'YES' && (
          <Box mt={2}>
            <TextField
              sx={{ bgcolor: 'common.white', mt: 1 }}
              onChange={event => onChange(value, event.target.value)}
              variant="standard"
              placeholder={infoText}
              error={false}
              fullWidth
              inputProps={{ sx: { px: 1, py: 1.5 } }}
              value={reason}
              disabled={disabled}
              data-testid="rating-boolean-reason-yes"
            />
          </Box>
        )}
      {type === CourseEvaluationQuestionType.BOOLEAN_REASON_N &&
        value === 'NO' && (
          <Box mt={2}>
            <TextField
              sx={{ bgcolor: 'common.white', mt: 1 }}
              onChange={event => onChange(value, event.target.value)}
              variant="standard"
              placeholder={infoText}
              error={false}
              fullWidth
              inputProps={{ sx: { px: 1, py: 1.5 } }}
              value={reason}
              disabled={disabled}
              data-testid="rating-boolean-reason-no"
            />
          </Box>
        )}
    </FormControl>
  )
}
