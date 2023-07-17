import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ImportArloCertificatesMutation,
  ImportArloCertificatesMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { IMPORT_ARLO_CERTIFICATE_MUTATION } from '@app/queries/admin/import-arlo-certificates'

export const ArloImport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [result, setResult] =
    useState<ImportArloCertificatesMutation['importArloCertificates']>()

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) {
        return
      }

      const file = e.target.files[0]

      try {
        setError(undefined)
        setResult(undefined)

        const encoded = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = () => {
            reader.abort()
            reject()
          }
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(btoa(reader.result))
            } else {
              throw new Error('Error reading the file.')
            }
          }
          reader.readAsBinaryString(file)
        })

        setLoading(true)
        const response = await fetcher<
          ImportArloCertificatesMutation,
          ImportArloCertificatesMutationVariables
        >(IMPORT_ARLO_CERTIFICATE_MUTATION, { report: encoded })
        if (response.importArloCertificates) {
          setResult(response.importArloCertificates)
        }
      } catch (err) {
        console.error(err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    },
    [fetcher]
  )

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
      <Stack gap={4} alignItems="center">
        <Typography variant="h1">
          {t('pages.arlo.import-certificate-report')}
        </Typography>

        {loading ? (
          <CircularProgress data-testid="arlo-import-loading" />
        ) : null}

        {error ? <Typography>{error}</Typography> : null}

        {result ? (
          <Alert severity="success" variant="outlined">
            {t('pages.arlo.import-certificate-success', result)}
          </Alert>
        ) : null}

        <input
          id="file-upload-input"
          type="file"
          accept=".xlsx"
          hidden
          onChange={handleFileChange}
        />

        <label htmlFor="file-upload-input">
          <Button color="primary" variant="contained" component="span">
            {t('pages.arlo.choose-file')}
          </Button>
        </label>
      </Stack>
    </Container>
  )
}
