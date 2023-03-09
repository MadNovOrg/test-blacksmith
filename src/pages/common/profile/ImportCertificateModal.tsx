import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  ImportLegacyCertificateMutation,
  ImportLegacyCertificateMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION as ImportLegacyCertificateMutationQuery } from '@app/queries/certificate/import-legacy-certificate'

export type ImportCertificateModalProps = {
  onCancel: () => void
  onSubmit: () => void
}

const ImportCertificateModal: React.FC<
  React.PropsWithChildren<ImportCertificateModalProps>
> = function ({ onCancel, onSubmit }) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { profile } = useAuth()

  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()

  const submitHandler = useCallback(async () => {
    const errorMessage = t(
      'common.course-certificate.certification-code-incorrect'
    )
    if (!profile || !code) {
      return
    }
    setError(undefined)
    try {
      await fetcher<
        ImportLegacyCertificateMutation,
        ImportLegacyCertificateMutationVariables
      >(ImportLegacyCertificateMutationQuery, {
        code,
      })
      onSubmit()
    } catch (e) {
      setError(errorMessage)
    }
  }, [code, t, fetcher, onSubmit, profile])

  return (
    <Box>
      <Typography variant="body1" color="grey.700">
        {t('common.course-certificate.import-certificate-description')}
      </Typography>

      <TextField
        sx={{ my: 3 }}
        onChange={event => setCode(event.target.value)}
        variant="filled"
        label={t('common.course-certificate.enter-valid-certification-code')}
        error={Boolean(error)}
        helperText={error}
        fullWidth
        value={code}
      />

      <Box display="flex" justifyContent="flex-end" gap={2}>
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
          type="button"
          variant="contained"
          color="primary"
          size="large"
          onClick={submitHandler}
          disabled={!code}
        >
          {t('common.course-certificate.update-certification')}
        </Button>
      </Box>
    </Box>
  )
}

export default ImportCertificateModal
