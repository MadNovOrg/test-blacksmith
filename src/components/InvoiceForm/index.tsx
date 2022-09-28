import { Box, Grid, TextField } from '@mui/material'
import { t, TFunction } from 'i18next'
import MuiPhoneNumber from 'material-ui-phone-number'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { yup } from '@app/schemas'
import { normalizeAddr, requiredMsg } from '@app/util'

import { OrgSelector } from '../OrgSelector'

type FieldValues = {
  invoiceDetails: {
    orgId: string
    billingAddress: string
    firstName: string
    surname: string
    email: string
    phone: string
    purchaseOrder: string
  }
}

const onlyCountries = ['au', 'gb']

export function formSchema(t: TFunction) {
  return yup.object({
    orgId: yup
      .string()
      .required(requiredMsg(t, 'org-name'))
      .typeError(requiredMsg(t, 'org-name')),

    firstName: yup.string().required(requiredMsg(t, 'first-name')),
    surname: yup.string().required(requiredMsg(t, 'last-name')),

    email: yup
      .string()
      .email(t('validation-errors.email-invalid'))
      .required(requiredMsg(t, 'email')),

    phone: yup
      .string()
      .required(requiredMsg(t, 'phone'))
      .min(10, t('validation-errors.phone-invalid')),

    purchaseOrder: yup.string(),
  })
}

export const InvoiceForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<FieldValues>()

  const values = getValues()

  return (
    <>
      <Box mb={3}>
        <OrgSelector
          allowAdding
          textFieldProps={{ variant: 'filled' }}
          onChange={org => {
            setValue('invoiceDetails.orgId', org?.id ?? '', {
              shouldValidate: true,
            })
            const address =
              org && 'address' in org
                ? (normalizeAddr(org.address) ?? []).filter(Boolean).join(',')
                : ''
            setValue('invoiceDetails.billingAddress', address, {
              shouldValidate: true,
            })
          }}
          sx={{ marginBottom: 2 }}
          error={errors.invoiceDetails?.orgId?.message}
        />
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item md={6}>
          <TextField
            id="firstName"
            label={t('first-name')}
            variant="standard"
            placeholder={t('first-name-placeholder')}
            error={!!errors.invoiceDetails?.firstName}
            helperText={errors.invoiceDetails?.firstName?.message}
            {...register('invoiceDetails.firstName')}
            inputProps={{ 'data-testid': 'input-first-name' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Grid>
        <Grid item md={6}>
          <TextField
            id="surname"
            label={t('surname')}
            variant="standard"
            placeholder={t('surname-placeholder')}
            error={!!errors.invoiceDetails?.surname}
            helperText={errors.invoiceDetails?.surname?.message}
            {...register('invoiceDetails.surname')}
            inputProps={{ 'data-testid': 'input-surname' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <Box mb={3}>
        <TextField
          id="email"
          label={t('email')}
          variant="standard"
          placeholder={t('email-placeholder')}
          error={!!errors.invoiceDetails?.email}
          helperText={errors.invoiceDetails?.email?.message}
          {...register('invoiceDetails.email')}
          inputProps={{ 'data-testid': 'input-email' }}
          sx={{ bgcolor: 'grey.100' }}
          fullWidth
          required
        />
      </Box>

      <Box mb={3}>
        <MuiPhoneNumber
          label={t('phone')}
          enableLongNumbers={true}
          onlyCountries={onlyCountries}
          defaultCountry="gb"
          variant="standard"
          sx={{ bgcolor: 'grey.100' }}
          inputProps={{
            sx: { height: 40 },
            'data-testid': 'input-phone',
          }}
          countryCodeEditable={false}
          error={!!errors.invoiceDetails?.phone}
          helperText={errors.invoiceDetails?.phone?.message}
          value={values.invoiceDetails?.phone || ''}
          onChange={p =>
            setValue('invoiceDetails.phone', p as string, {
              shouldValidate: true,
            })
          }
          fullWidth
          required
        />
      </Box>

      <Box mb={3} maxWidth={300}>
        <TextField
          id="purchaseOrder"
          label={t('po')}
          variant="standard"
          placeholder={t('po-placeholder')}
          error={!!errors.invoiceDetails?.purchaseOrder}
          helperText={errors.invoiceDetails?.purchaseOrder?.message}
          {...register('invoiceDetails.purchaseOrder')}
          inputProps={{ 'data-testid': 'input-po' }}
          sx={{ bgcolor: 'grey.100' }}
          fullWidth
        />
      </Box>
    </>
  )
}
