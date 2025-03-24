import { Box, TextField, Typography, Grid } from '@mui/material'
import { TFunction } from 'i18next'
import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import CountriesSelector from '@app/components/CountriesSelector'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { OrgSelector } from '@app/components/OrgSelector/ANZ'
import { Org_Created_From_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RegionSelector } from '@app/modules/organisation/components/RegionSelector'
import { yup } from '@app/schemas'
import { AustraliaCountryCode, requiredMsg } from '@app/util'

export type WorkbookDeliveryAddress = {
  orgId: string
  orgName: string
  orgContactFullName: string
  country: string
  countryCode: string
  addressLine1: string
  addressLine2: string
  suburb: string
  city: string
  region: string
  regionOther?: string
  postcode: string
}
export function formSchema(t: TFunction) {
  const baseTranslation = (key: string) =>
    `pages.create-course.license-order-details.workbook-address.${key}`
  return yup.object({
    orgId: yup
      .string()
      .required(requiredMsg(t, baseTranslation('organisation.title')))
      .typeError(requiredMsg(t, baseTranslation('organisation.title'))),
    orgName: yup.string(),
    orgContactFullName: yup
      .string()
      .required(requiredMsg(t, baseTranslation('order-contact.title'))),
    country: yup
      .string()
      .required(requiredMsg(t, baseTranslation('address.country.title'))),
    countryCode: yup
      .string()
      .required(requiredMsg(t, baseTranslation('address.country.title'))),
    addressLine1: yup
      .string()
      .required(requiredMsg(t, baseTranslation('address.line-1.title'))),
    addressLine2: yup.string(),
    suburb: yup
      .string()
      .required(requiredMsg(t, baseTranslation('address.suburb.title'))),
    city: yup
      .string()
      .required(requiredMsg(t, baseTranslation('address.city.title'))),
    region: yup.string().required(
      t('validation-errors.required-composed-field', {
        field1: t(baseTranslation('address.region.errors.required.state')),
        field2: t(baseTranslation('address.region.errors.required.territory')),
      }),
    ),
    regionOther: yup.string().when('region', {
      is: 'Other',
      then: schema =>
        schema.required(
          requiredMsg(t, baseTranslation('address.region-other.title')),
        ),
    }),
    postcode: yup.string(),
  })
}

type FieldValues = {
  workbookDeliveryAddress: WorkbookDeliveryAddress
}

export const WorkbookDeliveryAddressForm: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { t } = useScopedTranslation(
    'pages.create-course.license-order-details.workbook-address',
  )
  const { getLabel } = useWorldCountries()
  const {
    register,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useFormContext<FieldValues>()
  const values = watch('workbookDeliveryAddress')

  const otherRegion = useMemo(() => {
    return values?.region === 'Other'
  }, [values?.region])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id={'orderContactFullName'}
            label={t('order-contact.title')}
            variant="filled"
            placeholder={t('order-contact.placeholder')}
            error={!!errors.workbookDeliveryAddress?.orgContactFullName}
            helperText={
              errors.workbookDeliveryAddress?.orgContactFullName?.message
            }
            {...register('workbookDeliveryAddress.orgContactFullName')}
            inputProps={{ 'data-testid': 'orderContactFullName' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <OrgSelector
            required
            value={
              values?.orgId && values?.orgName
                ? {
                    id: values.orgId,
                    name: values.orgName,
                  }
                : undefined
            }
            allowAdding
            textFieldProps={{ variant: 'filled' }}
            onChange={org => {
              setValue('workbookDeliveryAddress.orgId', org?.id ?? '', {
                shouldValidate: true,
              })
              setValue('workbookDeliveryAddress.orgName', org?.name ?? '')
            }}
            sx={{ marginBottom: 2 }}
            error={errors.workbookDeliveryAddress?.orgId?.message}
            createdFrom={Org_Created_From_Enum.InvoiceDetailsPage}
          />
        </Grid>
      </Grid>
      <Box mt={3} bgcolor="white">
        <Typography variant="h5" mb={2}>
          {t('address.title')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CountriesSelector
              onChange={(_, code) => {
                setValue(
                  'workbookDeliveryAddress.countryCode',
                  code as string,
                  {
                    shouldValidate: true,
                  },
                )
                setValue(
                  'workbookDeliveryAddress.country',
                  getLabel(code ?? AustraliaCountryCode) as string,
                  {
                    shouldValidate: true,
                  },
                )
                setValue('workbookDeliveryAddress.region', '', {
                  shouldValidate: true,
                })
              }}
              value={values?.countryCode}
              error={Boolean(errors.workbookDeliveryAddress?.country)}
              helperText={errors.workbookDeliveryAddress?.country?.message}
              onlyAUandNZ={true}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="addr-line-1"
              label={t('address.line-1.title')}
              variant="filled"
              placeholder={t('address.line-1.placeholder')}
              error={!!errors.workbookDeliveryAddress?.addressLine1}
              helperText={errors.workbookDeliveryAddress?.addressLine1?.message}
              {...register('workbookDeliveryAddress.addressLine1')}
              inputProps={{ 'data-testid': 'input-address-line-1' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="addr-line-2"
              label={t('address.line-2.title')}
              variant="filled"
              placeholder={t('address.line-2.placeholder')}
              error={!!errors.workbookDeliveryAddress?.addressLine2}
              helperText={errors.workbookDeliveryAddress?.addressLine2?.message}
              {...register('workbookDeliveryAddress.addressLine2')}
              inputProps={{ 'data-testid': 'input-address-line-2' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="suburb"
              label={t('address.suburb.title')}
              variant="filled"
              placeholder={t('address.suburb.placeholder')}
              error={!!errors.workbookDeliveryAddress?.suburb}
              helperText={errors.workbookDeliveryAddress?.suburb?.message}
              {...register('workbookDeliveryAddress.suburb')}
              inputProps={{ 'data-testid': 'input-suburb' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="city"
              label={t('address.city.title')}
              variant="filled"
              placeholder={t('address.city.placeholder')}
              error={!!errors.workbookDeliveryAddress?.city}
              helperText={errors.workbookDeliveryAddress?.city?.message}
              {...register('workbookDeliveryAddress.city')}
              inputProps={{ 'data-testid': 'input-city' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="workbookDeliveryAddress.region"
              control={control}
              render={() => (
                <RegionSelector
                  countryCode={values?.countryCode ?? 'AU'}
                  error={Boolean(errors.workbookDeliveryAddress?.region)}
                  errormessage={
                    errors.workbookDeliveryAddress?.region?.message ?? ''
                  }
                  register={register('workbookDeliveryAddress.region')}
                  value={values?.region ?? null}
                  enableOther
                  required
                />
              )}
            />
          </Grid>
          {otherRegion ? (
            <Grid item xs={12}>
              <TextField
                id="region-other"
                label={t('address.region-other.title')}
                variant="filled"
                placeholder={t('address.region-other.placeholder')}
                error={!!errors.workbookDeliveryAddress?.regionOther}
                helperText={
                  errors.workbookDeliveryAddress?.regionOther?.message
                }
                {...register('workbookDeliveryAddress.regionOther')}
                inputProps={{ 'data-testid': 'input-region-other' }}
                sx={{ bgcolor: 'grey.100' }}
                fullWidth
                required
              />
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <TextField
              id="postcode"
              label={t('address.postcode.title')}
              variant="filled"
              placeholder={t('address.postcode.placeholder')}
              error={!!errors.workbookDeliveryAddress?.postcode}
              helperText={errors.workbookDeliveryAddress?.postcode?.message}
              {...register('workbookDeliveryAddress.postcode')}
              inputProps={{ 'data-testid': 'input-postcode' }}
              sx={{ bgcolor: 'grey.100' }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
