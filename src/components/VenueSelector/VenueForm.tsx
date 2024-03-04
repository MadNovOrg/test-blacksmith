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
  UKsCountriesCode,
  UKsCountriesCodes,
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
  const { getLabel: getCountryNameByCode, countriesCodesWithUKs } =
    useWorldCountries()
  const { acl } = useAuth()
  const [{ error }, handleAddVenue] = useMutation<ResponseType, ParamsType>(
    ADD_VENUE_MUTATION
  )
  const isAdminOrOperations = acl.isTTAdmin() || acl.isTTOps()

  const schema = useMemo(() => {
    return yup.object({
      name: yup.string().required(requiredMsg(t, 'venue-name')),
      addressLineOne: isAdminOrOperations
        ? yup.string()
        : yup.string().required(requiredMsg(t, 'addr.line1-placeholder')),
      addressLineTwo: yup.string(),
      city: yup.string().required(requiredMsg(t, 'addr.city')),
      postCode: isAdminOrOperations
        ? yup.string()
        : yup.string().when('country', {
            is: (country: string) => {
              return Boolean(
                UKsCountriesCodes[
                  (country || courseResidingCountry) as UKsCountriesCode
                ]
              )
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
        .oneOf(countriesCodesWithUKs)
        .required(requiredMsg(t, 'addr.country')),
    })
  }, [t, isAdminOrOperations, countriesCodesWithUKs, courseResidingCountry])
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
        noValidate={!isAdminOrOperations}
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
              onChange={(_, code) => setValue('country', code ?? '')}
              value={values.country}
              error={Boolean(errors.country)}
              helperText={errors.country?.message}
              courseResidingCountry={courseResidingCountry}
              isBILDcourse={isBILDcourse}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="addressLineOne"
              control={control}
              rules={{ required: !isAdminOrOperations }}
              render={({ field, fieldState }) => (
                <TextField
                  disabled={preFilledFields.has('addressLineOne')}
                  fullWidth
                  variant="filled"
                  required={!isAdminOrOperations}
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
              rules={{ required: !isAdminOrOperations }}
              render={({ field, fieldState }) => (
                <TextField
                  disabled={preFilledFields.has('postCode')}
                  fullWidth
                  variant="filled"
                  required={!isAdminOrOperations}
                  error={fieldState.invalid}
                  label={
                    !UKsCountriesCodes[
                      (values.country
                        ? values.country
                        : courseResidingCountry) as UKsCountriesCode
                    ]
                      ? t('components.venue-selector.modal.fields.zipCode')
                      : t('components.venue-selector.modal.fields.postCode')
                  }
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
