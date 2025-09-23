import {
  Box,
  FormHelperText,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material'
import React, { FC } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Shards } from '@app/util'

import { useJobTitles } from './useJobTitles'

export type JobTitleSelectorProps = {
  errors: {
    jobTitle?: string
    otherJobTitle?: string
  }
  register: {
    jobTitle: UseFormRegisterReturn
    otherJobTitle: UseFormRegisterReturn
  }
  textFieldProps?: TextFieldProps
  values: {
    jobTitle?: string
    otherJobTitle?: string
  }
}

export const JobTitleSelector: FC<
  React.PropsWithChildren<JobTitleSelectorProps>
> = function ({ errors, register, values }) {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const isUKRegion = acl.isUK()
  const jobTitles = useJobTitles(isUKRegion ? Shards.UK : Shards.ANZ)

  return (
    <Box>
      <TextField
        fullWidth
        label={t('job-title')}
        required
        select
        value={values.jobTitle ?? ''}
        variant="filled"
        data-testid={'job-title-selector'}
        {...register.jobTitle}
      >
        <MenuItem value="" disabled>
          {t('job-title')}
        </MenuItem>
        {jobTitles.map((option, i) => (
          <MenuItem
            key={`${option}-${i}`}
            value={option}
            data-testid={`job-position-${option}`}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>
      {errors.jobTitle ? (
        <FormHelperText error>{errors.jobTitle}</FormHelperText>
      ) : null}

      <Box sx={{ my: 1 }}>
        {values.jobTitle === 'Other' ? (
          <TextField
            id="other-job-title"
            variant="filled"
            label={t('other-job-title')}
            placeholder={t('other-job-title')}
            error={!!errors.otherJobTitle}
            helperText={errors.otherJobTitle ?? ''}
            {...register.otherJobTitle}
            fullWidth
            inputProps={{ 'data-testid': 'other-job-title-input' }}
          />
        ) : null}
      </Box>
    </Box>
  )
}
