import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React, { FC, useEffect } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DietaryRestrictionRadioValues } from '@app/modules/profile'
import { EditProfileInputs } from '@app/modules/profile/pages/EditProfile/utils'

type Props = {
  setValue: UseFormSetValue<EditProfileInputs>
  values: EditProfileInputs
  error?: string
  profileDietaryRestrictions: string
}

export const DietaryRestrictionsSection: FC<Props> = ({
  setValue,
  error,
  values,
  profileDietaryRestrictions,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const radioComponents = [
    {
      value: DietaryRestrictionRadioValues.NO,
      label: t('no'),
      dataTestId: 'dietary-restrictions-no',
    },
    {
      value: DietaryRestrictionRadioValues.YES,
      label: t('yes'),
      dataTestId: 'dietary-restrictions-yes',
    },
  ]

  const dietaryRestrictionsRadioValue = values.dietaryRestrictionRadioValue

  useEffect(() => {
    if (
      (profileDietaryRestrictions || profileDietaryRestrictions === '') &&
      !dietaryRestrictionsRadioValue
    ) {
      const dietaryRestrictionsValue = profileDietaryRestrictions
        ? DietaryRestrictionRadioValues.YES
        : DietaryRestrictionRadioValues.NO

      setValue('dietaryRestrictionRadioValue', dietaryRestrictionsValue)
    }
  }, [setValue, dietaryRestrictionsRadioValue, profileDietaryRestrictions])

  return (
    <FormControl>
      <Typography variant="body1" fontWeight={600}>
        {t('dietary-restrictions-question')}
      </Typography>
      <RadioGroup
        onChange={(_, newValue: string) => {
          setValue(
            'dietaryRestrictionRadioValue',
            newValue as DietaryRestrictionRadioValues,
          )
          setValue('dietaryRestrictions', '')
        }}
        row={!isMobile}
        value={dietaryRestrictionsRadioValue}
      >
        {radioComponents.map(({ value, label, dataTestId }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio data-testid={dataTestId} />}
            label={label}
          />
        ))}
      </RadioGroup>
      {dietaryRestrictionsRadioValue === DietaryRestrictionRadioValues.YES ? (
        <Box>
          <TextField
            onChange={event =>
              setValue('dietaryRestrictions', event.target.value)
            }
            label={t('dietary-restrictions-text-label')}
            variant="filled"
            fullWidth
            required
            error={!!error}
            helperText={error}
            value={values.dietaryRestrictions}
          />
        </Box>
      ) : null}
    </FormControl>
  )
}
