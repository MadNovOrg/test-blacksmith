import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, MenuItem, TextField } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/organization/insert-org'
import { yup } from '@app/schemas'
import { Address, Organization, TrustType } from '@app/types'
import { requiredMsg } from '@app/util'

type Props = {
  onSuccess: (org: Organization) => void
  onClose: VoidFunction
  name: string
}

type FormInput = {
  name: string
  trustName: string
  trustType: string
  addressLine1: string
  addressLine2: string
  city: string
  country: string
  postCode: string
}

export const AddOrg: React.FC<Props> = function ({ name, onSuccess, onClose }) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)

  const schema = useMemo(() => {
    return yup.object({
      name: yup.string().required(requiredMsg(t, 'org-name')),
      trustType: yup
        .string()
        .required(
          t('validation-errors.required-field', { name: t('trust-type') })
        ),
      trustName: yup
        .string()
        .required(
          t('validation-errors.required-field', { name: t('trust-name') })
        ),
      addressLine1: yup.string().required(requiredMsg(t, 'addr.line1')),
      addressLine2: yup.string(),
      city: yup.string().required(requiredMsg(t, 'addr.city')),
      country: yup.string().required(requiredMsg(t, 'addr.country')),
      postCode: yup.string().required(requiredMsg(t, 'addr.postCode')),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name,
      trustType: '',
      trustName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      postCode: '',
    },
  })

  const onSubmit = async (data: FormInput) => {
    setLoading(true)

    try {
      const vars = {
        name: data.name,
        trustName: data.trustName,
        trustType: data.trustType,
        address: {
          line1: data.addressLine1,
          line2: data.addressLine2,
          city: data.city,
          country: data.country,
          postCode: data.postCode,
        } as Address,
      }
      const { org } = await fetcher<ResponseType, ParamsType>(MUTATION, vars)
      setLoading(false)

      if (org.id) {
        onSuccess(org)
      }
    } catch (err) {
      // TODO: handle error
      setLoading(false)
      console.log(err)
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('components.org-selector.modal.title')}
      maxWidth={800}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
        width={400}
      >
        <Box mb={3}>
          <TextField
            id="orgName"
            label={t('org-name')}
            variant="standard"
            placeholder={t('org-name-placeholder')}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name')}
            inputProps={{ 'data-testid': 'org-name' }}
            autoFocus
            fullWidth
          />
        </Box>

        <Box mb={3}>
          <Controller
            name="trustType"
            control={control}
            render={({ field }) => (
              <TextField
                id="trustType"
                select
                required
                label={t('pages.edit-org-details.trust-type')}
                variant="standard"
                error={!!errors.trustType}
                helperText={errors.trustType?.message}
                value={field.value}
                onChange={field.onChange}
                inputProps={{ 'data-testid': 'trust-type' }}
                fullWidth
              >
                {Object.values(TrustType).map(option => (
                  <MenuItem
                    key={option}
                    value={option}
                    data-testid={`trust-type-option-${option}`}
                  >
                    {t(`trust-type.${option.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        <Box mb={3}>
          <TextField
            id="trustName"
            required
            label={t('pages.edit-org-details.trust-name')}
            variant="standard"
            error={!!errors.trustName}
            helperText={errors.trustName?.message}
            {...register('trustName')}
            inputProps={{ 'data-testid': 'trust-name' }}
            fullWidth
          />
        </Box>

        <Box mb={3}>
          <TextField
            id="line1"
            label={t('addr.line1')}
            variant="standard"
            placeholder={t('addr.line1-placeholder')}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1?.message}
            {...register('addressLine1')}
            inputProps={{ 'data-testid': 'addr-line1' }}
            autoFocus
            fullWidth
          />
        </Box>

        <Box mb={3}>
          <TextField
            id="line2"
            label={t('addr.line2')}
            variant="standard"
            placeholder={t('addr.line2-placeholder')}
            error={!!errors.addressLine2}
            helperText={errors.addressLine2?.message}
            {...register('addressLine2')}
            inputProps={{ 'data-testid': 'addr-line2' }}
            fullWidth
          />
        </Box>

        <Box mb={3}>
          <TextField
            id="city"
            label={t('addr.city')}
            variant="standard"
            placeholder={t('addr.city')}
            error={!!errors.city}
            helperText={errors.city?.message}
            {...register('city')}
            inputProps={{ 'data-testid': 'city' }}
            fullWidth
          />
        </Box>

        <Box mb={3}>
          <TextField
            id="country"
            label={t('addr.country')}
            variant="standard"
            placeholder={t('addr.country')}
            error={!!errors.country}
            helperText={errors.country?.message}
            {...register('country')}
            inputProps={{ 'data-testid': 'country' }}
            fullWidth
          />
        </Box>

        <Box mb={3}>
          <TextField
            id="postCode"
            label={t('addr.postCode')}
            variant="standard"
            placeholder={t('addr.postCode')}
            error={!!errors.postCode}
            helperText={errors.postCode?.message}
            {...register('postCode')}
            inputProps={{ 'data-testid': 'postCode' }}
            fullWidth
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            onClick={handleSubmit(onSubmit)}
            type="button"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
          >
            {t('submit')}
          </LoadingButton>
        </Box>
      </Box>
    </Dialog>
  )
}
