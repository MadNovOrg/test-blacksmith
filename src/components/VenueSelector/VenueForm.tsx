import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/venue/insert-venue'
import { Venue } from '@app/types'

export type VenueFormProps = {
  data: Omit<Venue, 'id'> | undefined
  onSubmit: (venue: Venue) => void
  onCancel: () => void
}

const VenueForm: React.FC<React.PropsWithChildren<VenueFormProps>> = function ({
  data,
  onSubmit,
  onCancel,
}) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { control, handleSubmit, trigger } = useForm({
    defaultValues: data ?? {
      name: '',
      addressLineOne: '',
      addressLineTwo: '',
      city: '',
      postCode: '',
    },
    mode: 'all',
  })

  const [error, setError] = useState<string>()

  const submitHandler = useCallback(
    async (formData: VenueFormProps['data']) => {
      const validationResult = await trigger()
      if (!validationResult) {
        return
      }

      setError(undefined)
      try {
        if (formData) {
          const { venue } = await fetcher<ResponseType, ParamsType>(MUTATION, {
            venue: formData,
          })
          onSubmit(venue)
        }
      } catch (e: unknown) {
        setError((e as Error).message)
      }
    },
    [fetcher, onSubmit, trigger]
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
              <Alert severity="error">{error}</Alert>
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
                  {...field}
                />
              )}
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
