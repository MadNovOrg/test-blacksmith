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
import { FC, useEffect, useMemo } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DisabilitiesRadioValues } from '@app/modules/profile'
import {
  EditProfileInputs,
  getDisabilitiesValue,
  ratherNotSayText,
} from '@app/modules/profile/pages/EditProfile/utils'

type Props = {
  setValue: UseFormSetValue<EditProfileInputs>
  values: EditProfileInputs
  error?: string
  profileDisabilities: string
}

export const DisabilitiesSection: FC<Props> = ({
  setValue,
  values,
  error,
  profileDisabilities,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const disabilitiesValue = useMemo(() => {
    return getDisabilitiesValue({
      disabilities: profileDisabilities,
    })
  }, [profileDisabilities])

  const radioComponents = [
    {
      value: DisabilitiesRadioValues.NO,
      label: t('no'),
      dataTestId: 'disabilities-no',
    },
    {
      value: DisabilitiesRadioValues.YES,
      label: t('yes'),
      dataTestId: 'disabilities-yes',
    },
    {
      value: DisabilitiesRadioValues.RATHER_NOT_SAY,
      label: t('rather-not-say'),
      dataTestId: 'disabilities-rather-not-say',
    },
  ]

  const disabilitiesRadioValue = values.disabilitiesRadioValue

  useEffect(() => {
    if (
      (profileDisabilities || profileDisabilities === '') &&
      !disabilitiesRadioValue
    ) {
      setValue('disabilitiesRadioValue', disabilitiesValue)
    }
  }, [setValue, disabilitiesRadioValue, disabilitiesValue, profileDisabilities])

  return (
    <FormControl>
      <Typography variant="body1" fontWeight={600}>
        {t('disabilities-question')}
      </Typography>
      <RadioGroup
        onChange={(_, newValue: string) => {
          setValue(
            'disabilitiesRadioValue',
            newValue as DisabilitiesRadioValues,
          )
          setValue(
            'disabilities',
            newValue === DisabilitiesRadioValues.RATHER_NOT_SAY
              ? ratherNotSayText
              : '',
          )
        }}
        row={!isMobile}
        value={disabilitiesRadioValue}
      >
        {radioComponents.map(({ value, label, dataTestId }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
            data-testid={dataTestId}
          />
        ))}
      </RadioGroup>
      {disabilitiesRadioValue === DisabilitiesRadioValues.YES ? (
        <Box>
          <TextField
            onChange={event => {
              setValue('disabilities', event.target.value)
            }}
            label={t('disabilities-text-label')}
            variant="filled"
            fullWidth
            required
            error={!!error}
            helperText={error}
            value={values.disabilities}
          />
        </Box>
      ) : null}
    </FormControl>
  )
}
