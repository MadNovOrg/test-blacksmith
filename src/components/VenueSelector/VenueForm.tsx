import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import InfoIcon from '@mui/icons-material/Info'
import {
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import {
  ADD_VENUE_MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/venue/insert-venue'
import { yup } from '@app/schemas'
import { Venue } from '@app/types'
import { requiredMsg, isValidUKPostalCode } from '@app/util'

import CountryDropdown from './CountryDropdown'

export type VenueFormProps = {
  data: Omit<Venue, 'id'> | undefined
  onSubmit: (venue?: Venue) => void
  onCancel: () => void
}

const VenueForm: React.FC<React.PropsWithChildren<VenueFormProps>> = function ({
  data,
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation()

  const [{ error }, handleAddVenue] = useMutation<ResponseType, ParamsType>(
    ADD_VENUE_MUTATION
  )

  const schema = useMemo(() => {
    return yup.object({
      name: yup.string().required(requiredMsg(t, 'venue-name')),
      addressLineOne: yup
        .string()
        .required(requiredMsg(t, 'addr.line1-placeholder')),
      addressLineTwo: yup.string(),
      city: yup.string().required(requiredMsg(t, 'addr.city')),
      postCode: yup
        .string()
        .required(requiredMsg(t, 'addr.postCode'))
        .test(
          'is-uk-postcode',
          t('common.validation-errors.invalid-postcode'),
          isValidUKPostalCode
        ),
      country: yup.string().required(requiredMsg(t, 'addr.country')),
    })
  }, [t])

  const {
    control,
    handleSubmit,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: data ?? {
      name: '',
      addressLineOne: '',
      addressLineTwo: '',
      city: '',
      postCode: '',
      country: '',
    },
  })

  const submitHandler = useCallback(
    async (formData: VenueFormProps['data']) => {
      const validationResult = await trigger()
      if (!validationResult) {
        return
      }

      if (formData) {
        const { data } = await handleAddVenue({
          venue: formData,
        })
        onSubmit(data?.venue)
      }
    },
    [handleAddVenue, onSubmit, trigger]
  )

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              {t('components.venue-selector.modal.description')}
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error.message}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="filled"
                  required
                  color="secondary"
                  error={fieldState.invalid}
                  label={t('components.venue-selector.modal.fields.name')}
                  helperText={errors.name?.message}
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="addressLineOne"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="filled"
                  required
                  error={fieldState.invalid}
                  label={t(
                    'components.venue-selector.modal.fields.addressLineOne'
                  )}
                  helperText={errors.addressLineOne?.message}
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="addressLineTwo"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant="filled"
                  label={t(
                    'components.venue-selector.modal.fields.addressLineTwo'
                  )}
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="filled"
                  required
                  error={fieldState.invalid}
                  label={t('components.venue-selector.modal.fields.city')}
                  helperText={errors.city?.message}
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="postCode"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="filled"
                  required
                  error={fieldState.invalid}
                  label={t('components.venue-selector.modal.fields.postCode')}
                  helperText={errors.postCode?.message}
                  {...field}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title={t('common.post-code-tooltip')}>
                        <InfoIcon color={'action'} />
                      </Tooltip>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <CountryDropdown
              {...register('country')}
              required
              error={Object.prototype.hasOwnProperty.call(errors, 'country')}
              errormessage={errors.country?.message}
              data-testid="country-dropdown"
            />
          </Grid>

          <Grid item xs={12} mt={2} container gap={2} justifyContent="right">
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              {t('components.venue-selector.modal.submit')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default VenueForm
