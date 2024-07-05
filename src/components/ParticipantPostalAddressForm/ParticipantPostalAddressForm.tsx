import InfoIcon from '@mui/icons-material/Info'
import { Box, Grid, TextField, Tooltip, Typography } from '@mui/material'
import { t } from 'i18next'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { InferType } from 'yup'

import { yup } from '@app/schemas'
import { requiredMsg, isValidUKPostalCode } from '@app/util'

import CountriesSelector from '../CountriesSelector'
import useWorldCountries, {
  UKsCountriesCodes,
} from '../CountriesSelector/hooks/useWorldCountries'
import { CountryDropdown } from '../CountryDropdown'

export const schema = yup.object({
  inviteeAddressLine1: yup.string().required(requiredMsg(t, 'line1')),
  inviteeAddressLine2: yup.string(),
  inviteeCity: yup.string().required(requiredMsg(t, 'city')),
  inviteePostCode: yup
    .string()
    .required(requiredMsg(t, 'post-code'))
    .test(
      'is-uk-postcode',
      t('validation-errors.invalid-postcode'),
      isValidUKPostalCode,
    ),
  inviteeCountry: yup.string().required(requiredMsg(t, 'country')),
  inviteeCountryCode: yup.string().nullable(),
})

export type FormValues = InferType<typeof schema>

export const ParticipantPostalAddressForm = () => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useFormContext<FormValues>()
  const values = getValues()
  const residingCountryEnabled = useFeatureFlagEnabled(
    'course-residing-country',
  )

  const { getLabel } = useWorldCountries()

  const checkIsParticipantUKCountry = useCallback(() => {
    if (!values.inviteeCountry) return true

    return (Object.values(UKsCountriesCodes) as string[]).includes(
      values.inviteeCountry,
    )
  }, [values.inviteeCountry])

  return (
    <Grid item md={12}>
      <Typography variant="subtitle1">{t('common.postal-address')}</Typography>
      <Box mb={3}>
        <TextField
          id="primaryAddressLine"
          label={t('line1')}
          variant="filled"
          sx={{ bgcolor: 'grey.100' }}
          {...register('inviteeAddressLine1')}
          error={Boolean(errors.inviteeAddressLine1?.message)}
          InputLabelProps={{
            shrink: Boolean(values.inviteeAddressLine1),
          }}
          helperText={errors.inviteeAddressLine1?.message}
          inputProps={{ 'data-testid': 'addr-line1' }}
          fullWidth
          required
        />
      </Box>
      <Box mb={3}>
        <TextField
          id="secondaryAddressLine"
          label={t('line2')}
          variant="filled"
          sx={{ bgcolor: 'grey.100' }}
          {...register('inviteeAddressLine2')}
          error={Boolean(errors.inviteeAddressLine2?.message)}
          InputLabelProps={{
            shrink: Boolean(values.inviteeAddressLine2),
          }}
          helperText={errors.inviteeAddressLine2?.message}
          inputProps={{ 'data-testid': 'addr-line2' }}
          fullWidth
        />
      </Box>
      <Box mb={3}>
        <TextField
          id="city"
          label={t('city')}
          variant="filled"
          sx={{ bgcolor: 'grey.100' }}
          {...register('inviteeCity')}
          error={Boolean(errors.inviteeCity?.message)}
          InputLabelProps={{
            shrink: Boolean(values.inviteeCity),
          }}
          helperText={errors.inviteeCity?.message}
          inputProps={{ 'data-testid': 'city' }}
          fullWidth
          required
        />
      </Box>
      <Box mb={3}>
        <TextField
          error={Boolean(errors.inviteePostCode?.message)}
          fullWidth
          helperText={errors.inviteePostCode?.message}
          id="postCode"
          inputProps={{ 'data-testid': 'postCode' }}
          label={
            checkIsParticipantUKCountry()
              ? t('components.venue-selector.modal.fields.postCode')
              : t('components.venue-selector.modal.fields.zipCode')
          }
          placeholder={t('common.addr.postCode')}
          sx={{ bgcolor: 'grey.100' }}
          type={checkIsParticipantUKCountry() ? 'text' : 'number'}
          variant="filled"
          {...register('inviteePostCode')}
          InputLabelProps={{
            shrink: Boolean(values.inviteePostCode),
          }}
          InputProps={
            checkIsParticipantUKCountry()
              ? {
                  endAdornment: (
                    <Tooltip
                      title={t('post-code-tooltip')}
                      data-testid="post-code-tooltip"
                    >
                      <InfoIcon color={'action'} />
                    </Tooltip>
                  ),
                }
              : undefined
          }
          required
        />
      </Box>
      <Box mb={3}>
        {residingCountryEnabled ? (
          <CountriesSelector
            required
            error={Boolean(errors.inviteeCountry)}
            helperText={errors.inviteeCountry?.message}
            onChange={(_, code) => {
              setValue('inviteeCountry', getLabel(code) ?? '')
              setValue('inviteeCountryCode', code)
            }}
            value={values.inviteeCountryCode}
            onBlur={() => trigger('inviteeCountry')}
          />
        ) : (
          <CountryDropdown
            required
            register={register('inviteeCountry')}
            error={Boolean(errors.inviteeCountry?.message)}
            value={values.inviteeCountry ?? ''}
            errormessage={errors.inviteeCountry?.message}
            label={t('country')}
          />
        )}
      </Box>
    </Grid>
  )
}
