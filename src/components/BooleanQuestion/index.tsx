import { Box, TextField } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
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

export const BooleanQuestion: React.FC<
  React.PropsWithChildren<BooleanQuestionProps>
> = ({ type, value, reason, onChange = noop, infoText, disabled = false }) => {
  const { t } = useTranslation()

  const {
    control,
    formState: { errors },
  } = useFormContext()

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
            <Controller
              name="yesResponse"
              control={control}
              render={({ field }) => (
                <TextField
                  onChange={event => {
                    field.onChange(event.target.value)
                    onChange(value, event.target.value)
                  }}
                  variant="filled"
                  placeholder={infoText}
                  fullWidth
                  inputProps={{ sx: { px: 1, py: 1.5 } }}
                  value={field.value}
                  disabled={disabled}
                  data-testid="rating-boolean-reason-yes"
                  error={!!errors.yesResponse}
                  helperText={errors?.yesResponse?.message as string}
                />
              )}
            />
          </Box>
        )}
      {type === CourseEvaluationQuestionType.BOOLEAN_REASON_N &&
        value === 'NO' && (
          <Box mt={2}>
            <Controller
              name="noResponse"
              control={control}
              render={({ field }) => (
                <TextField
                  onChange={event => {
                    field.onChange(event.target.value)
                    onChange(value, event.target.value)
                  }}
                  variant="filled"
                  placeholder={infoText}
                  fullWidth
                  inputProps={{ sx: { px: 1, py: 1.5 } }}
                  value={field.value}
                  disabled={disabled}
                  data-testid="rating-boolean-reason-no"
                  error={!!errors.noResponse}
                  helperText={errors.noResponse?.message as string}
                />
              )}
            />
          </Box>
        )}
    </FormControl>
  )
}
