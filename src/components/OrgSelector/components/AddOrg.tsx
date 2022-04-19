import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { gqlRequest } from '@app/lib/gql-request'
import {
  MUTATION,
  ResponseType,
  ParamsType,
} from '@app/queries/organization/insert-org'
import { yup } from '@app/schemas'
import { requiredMsg } from '@app/util'

type Props = {
  onSuccess: (id: string, name: string) => void
  onClose: VoidFunction
  name: string
}

type Inputs = {
  name: string
}

export const AddOrg: React.FC<Props> = function ({ name, onSuccess, onClose }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const schema = useMemo(() => {
    return yup.object({
      name: yup.string().required(requiredMsg(t, 'org-name')),
    })
  }, [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name,
    },
  })

  const onSubmit = async (data: Inputs) => {
    setLoading(true)

    try {
      const vars = { name: data.name }

      const resp = await gqlRequest<ResponseType, ParamsType>(MUTATION, vars)
      setLoading(false)

      if (resp.org.id) {
        onSuccess(resp.org.id, name)
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
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        aria-autocomplete="none"
      >
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
            type="submit"
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
