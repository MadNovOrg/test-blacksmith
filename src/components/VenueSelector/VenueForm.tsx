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
import React, { useCallback, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  ADD_VENUE_MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/venue/insert-venue'
import { yup } from '@app/schemas'
import { Venue } from '@app/types'
import { requiredMsg, isValidUKPostalCode } from '@app/util'

import CountriesSelector from '../CountriesSelector'
import useWorldCountries, {
  WorldCountriesCodes,
} from '../CountriesSelector/hooks/useWorldCountries'

export type VenueFormProps = {
  data: Omit<Venue, 'id'> | undefined
  onSubmit: (venue?: Venue) => void
  onCancel: () => void
  courseResidingCountry?: WorldCountriesCodes | string
  isBILDcourse: boolean
}

const VenueForm: React.FC<React.PropsWithChildren<VenueFormProps>> = function ({
  data,
  onSubmit,
  onCancel,
  courseResidingCountry,
  isBILDcourse,
}) {
  const preFilledFields = useMemo(
    () =>
      new Set(
        Object.keys(data ?? {}).filter(
          key => data && !data[key as keyof typeof data]?.match(/^\s*$/)
        )
      ),
    [data]
  )
  const { t } = useTranslation()
  const {
    getLabel: getCountryNameByCode,
    countriesCodesWithUKs,
    isUKCountry,
  } = useWorldCountries()
  const { acl } = useAuth()
  const [{ error }, handleAddVenue] = useMutation<ResponseType, ParamsType>(
    ADD_VENUE_MUTATION
  )
  const [trySubmit, setTrySubmit] = useState(false)

  const schema = useMemo(() => {
    return yup.object({
      name: yup.string().required(requiredMsg(t, 'venue-name')),
      addressLineOne: acl.isTTAdmin()
        ? yup.string()
        : yup.string().required(requiredMsg(t, 'addr.line1-placeholder')),
      addressLineTwo: yup.string(),
      city: yup.string().required(requiredMsg(t, 'addr.city')),
      postCode: acl.isTTAdmin()
        ? yup.string()
        : yup.string().when('country', {
            is: (country: string) => {
              return isUKCountry(country || courseResidingCountry)
            },
            then: schema =>
              schema
                .required(requiredMsg(t, 'addr.postCode'))
                .test(
                  'is-uk-postcode',
                  t('common.validation-errors.invalid-postcode'),
                  isValidUKPostalCode
                ),
            otherwise: schema =>
              schema.required(requiredMsg(t, 'addr.zipCode')),
          }),
      country: yup
        .string()
        .test('is-valid-value', requiredMsg(t, 'addr.country'), value => {
          return countriesCodesWithUKs.includes(value as WorldCountriesCodes)
        }),
    })
  }, [t, acl, isUKCountry, courseResidingCountry, countriesCodesWithUKs])
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: data
      ? {
          ...data,
          ...(courseResidingCountry
            ? { country: data.countryCode }
            : { country: data.country }),
        }
      : {
          name: '',
          addressLineOne: '',
          addressLineTwo: '',
          city: '',
          postCode: '',
          country: courseResidingCountry ? courseResidingCountry : 'GB-ENG',
        },
  })
  const values = watch()

  const submitHandler = useCallback(
    async (formData: VenueFormProps['data']) => {
      const validationResult = await trigger()

      if (!validationResult) {
        return
      }

      if (formData) {
        const { data } = await handleAddVenue({
          venue: {
            ...formData,
            country: getCountryNameByCode(
              formData.country as WorldCountriesCodes
            ),
            countryCode: formData.countryCode ?? formData.country,
          },
        })
        onSubmit(data?.venue)
      }
    },
    [getCountryNameByCode, handleAddVenue, onSubmit, trigger]
  )
  return (
    <Box p={2}>
      <form
        onSubmit={handleSubmit(submitHandler)}
        noValidate={!acl.isTTAdmin()}
      >
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
                  disabled={preFilledFields.has('name')}
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
            <CountriesSelector
              disabled={preFilledFields.has('country')}
              onChange={async (_, code) => {
                setValue('country', code ?? '', { shouldValidate: true })
                if (values.postCode || trySubmit) {
                  await trigger('postCode')
                }
              }}
              value={values.country}
              error={Boolean(errors.country)}
              helperText={errors.country?.message}
              courseResidingCountry={courseResidingCountry}
              isBILDcourse={isBILDcourse}
              required={true}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="addressLineOne"
              control={control}
              rules={{ required: !acl.isTTAdmin() }}
              render={({ field, fieldState }) => (
                <TextField
                  disabled={preFilledFields.has('addressLineOne')}
                  fullWidth
                  variant="filled"
                  required={!acl.isTTAdmin()}
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
                  disabled={preFilledFields.has('addressLineTwo')}
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
                  disabled={preFilledFields.has('city')}
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
              rules={{ required: !acl.isTTAdmin() }}
              render={({ field, fieldState }) => (
                <TextField
                  disabled={preFilledFields.has('postCode')}
                  fullWidth
                  variant="filled"
                  required={!acl.isTTAdmin()}
                  error={fieldState.invalid}
                  label={
                    isUKCountry(values.country ?? courseResidingCountry)
                      ? t('components.venue-selector.modal.fields.postCode')
                      : t('components.venue-selector.modal.fields.zipCode')
                  }
                  helperText={errors.postCode?.message}
                  {...field}
                  InputProps={
                    isUKCountry(values.country ?? courseResidingCountry)
                      ? {
                          endAdornment: (
                            <Tooltip title={t('common.post-code-tooltip')}>
                              <InfoIcon
                                data-testid="postcode-info-icon"
                                color={'action'}
                              />
                            </Tooltip>
                          ),
                        }
                      : undefined
                  }
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
              onClick={() => setTrySubmit(true)}
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
