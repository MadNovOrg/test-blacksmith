import InfoIcon from '@mui/icons-material/Info'
import { Box, Grid, TextField, Tooltip, Typography } from '@mui/material'
import { t } from 'i18next'
import { useFormContext } from 'react-hook-form'
import { InferType } from 'yup'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { yup } from '@app/schemas'
import { requiredMsg, isValidUKPostalCode } from '@app/util'

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

  const { getLabel } = useWorldCountries()

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
          label={t('components.venue-selector.modal.fields.postCode')}
          placeholder={t('common.addr.postCode')}
          sx={{ bgcolor: 'grey.100' }}
          type={'text'}
          variant="filled"
          {...register('inviteePostCode')}
          InputLabelProps={{
            shrink: Boolean(values.inviteePostCode),
          }}
          InputProps={{
            endAdornment: (
              <Tooltip
                title={t('post-code-tooltip')}
                data-testid="post-code-tooltip"
              >
                <InfoIcon color={'action'} />
              </Tooltip>
            ),
          }}
          required
        />
      </Box>
      <Box mb={3}>
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
          onlyUKCountries={true}
        />
      </Box>
    </Grid>
  )
}
