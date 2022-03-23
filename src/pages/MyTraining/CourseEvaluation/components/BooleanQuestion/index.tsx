import React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import { Box, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CourseEvaluationQuestionType } from '@app/types'

type BooleanQuestionProps = {
  type: CourseEvaluationQuestionType
  value: string
  reason: string
  onChange: (value: string, reason: string) => void
  infoText?: string
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
  onChange,
  infoText,
}) => {
  const { t } = useTranslation()

  return (
    <FormControl>
      <RadioGroup
        onChange={(event, newValue: string) => onChange(newValue, reason)}
        row
        sx={{ mt: 1 }}
        value={value}
      >
        <FormControlLabel
          sx={style}
          value="YES"
          control={<Radio />}
          label={t<string>('yes')}
        />
        <FormControlLabel
          sx={style}
          value="NO"
          control={<Radio />}
          label={t<string>('no')}
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
            />
          </Box>
        )}
      {type === CourseEvaluationQuestionType.BOOLEAN_REASON_N &&
        value === 'NO' && (
          <Box mt={2}>
            <TextField
              onChange={event => onChange(value, event.target.value)}
              variant="standard"
              placeholder={infoText}
              error={false}
            />
          </Box>
        )}
    </FormControl>
  )
}
