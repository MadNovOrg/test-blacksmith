import { Box, Grid, TextField } from '@mui/material'
import { t, TFunction } from 'i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import isEmail from 'validator/lib/isEmail'
import { InferType } from 'yup'

import { OrgSelector } from '@app/components/OrgSelector'
import { isHubOrg } from '@app/components/OrgSelector/utils'
import PhoneNumberInput from '@app/modules/profile/components/PhoneNumberInput'
import { schemas, yup } from '@app/schemas'
import { normalizeAddr, requiredMsg } from '@app/util'

export function formSchema(t: TFunction) {
  return yup.object({
    orgId: yup
      .string()
      .required(requiredMsg(t, 'org-name'))
      .typeError(requiredMsg(t, 'org-name')),

    orgName: yup.string(),
    billingAddress: yup.string(),

    firstName: yup.string().required(requiredMsg(t, 'first-name')),
    surname: yup.string().required(requiredMsg(t, 'surname')),

    email: yup
      .string()
      .required(requiredMsg(t, 'email'))
      .test('is-email', t('validation-errors.email-invalid'), email => {
        return isEmail(email)
      }),

    phone: schemas.phone(t),

    purchaseOrder: yup.string(),
  })
}

type FieldValues = {
  invoiceDetails?: InferType<ReturnType<typeof formSchema>>
}

export const InvoiceForm: React.FC<React.PropsWithChildren<unknown>> = () => {
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
          required
          value={
            values.invoiceDetails?.orgId && values.invoiceDetails?.orgName
              ? {
                  name: values.invoiceDetails.orgName,
                  id: values.invoiceDetails.orgId,
                }
              : undefined
          }
          allowAdding
          textFieldProps={{ variant: 'filled' }}
          onChange={org => {
            if (org && !isHubOrg(org)) return

            setValue('invoiceDetails.orgId', org?.id ?? '', {
              shouldValidate: true,
            })

            setValue('invoiceDetails.orgName', org?.name ?? '')

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
        <Grid item md={6} sm={12}>
          <TextField
            id="firstName"
            label={t('first-name')}
            variant="filled"
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
        <Grid item md={6} sm={12}>
          <TextField
            id="surname"
            label={t('surname')}
            variant="filled"
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
        <Grid item md={12} sm={12}>
          <TextField
            id="email"
            label={t('email')}
            variant="filled"
            placeholder={t('email-placeholder')}
            error={!!errors.invoiceDetails?.email}
            helperText={errors.invoiceDetails?.email?.message}
            {...register('invoiceDetails.email')}
            inputProps={{ 'data-testid': 'input-email' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
            required
          />
        </Grid>

        <Grid item md={12} sm={12}>
          <PhoneNumberInput
            label={t('phone')}
            variant="filled"
            sx={{ bgcolor: 'grey.100' }}
            inputProps={{
              sx: { height: 40 },
              'data-testid': 'input-phone',
            }}
            error={!!errors.invoiceDetails?.phone}
            helperText={errors.invoiceDetails?.phone?.message}
            value={{
              phoneNumber: values.invoiceDetails?.phone ?? '',
              countryCode: '',
            }}
            onChange={({ phoneNumber }) =>
              setValue('invoiceDetails.phone', phoneNumber, {
                shouldValidate: true,
              })
            }
            fullWidth
            required
          />
        </Grid>

        <Grid item md={6} sm={12}>
          <TextField
            id="purchaseOrder"
            label={t('po')}
            variant="filled"
            placeholder={t('po-placeholder')}
            error={!!errors.invoiceDetails?.purchaseOrder}
            helperText={errors.invoiceDetails?.purchaseOrder?.message}
            {...register('invoiceDetails.purchaseOrder')}
            inputProps={{ 'data-testid': 'input-po' }}
            sx={{ bgcolor: 'grey.100' }}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  )
}
