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
  ImportArloCertificatesResultQuery,
  ImportArloCertificatesResultQueryVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import usePollQuery from '@app/hooks/usePollQuery'
import {
  IMPORT_ARLO_CERTIFICATES_ACTION,
  IMPORT_ARLO_CERTIFICATES_ACTION_RESULT,
} from '@app/queries/admin/import-arlo-certificates'

export const ArloImport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [actionId, setActionId] = useState<string>()
  const [result, setResult] = useState<{ processed: number; added: number }>()

  const [startPolling] = usePollQuery(
    async () => {
      if (actionId) {
        const { importArloCertificates } = await fetcher<
          ImportArloCertificatesResultQuery,
          ImportArloCertificatesResultQueryVariables
        >(IMPORT_ARLO_CERTIFICATES_ACTION_RESULT, {
          id: actionId ?? '',
        })
        if (importArloCertificates?.output) {
          setResult(importArloCertificates.output)
          setLoading(false)
        } else if (importArloCertificates?.errors) {
          console.log(importArloCertificates.errors)
          setError(t('internal-error'))
        }
      }
    },
    () => !!result || !!error,
    {
      interval: 5000,
      maxPolls: 30,
      onTimeout: () => {
        setLoading(false)
        setError(t('pages.arlo.timeout'))
      },
    }
  )

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
        >(IMPORT_ARLO_CERTIFICATES_ACTION, { report: encoded })
        setActionId(response.importArloCertificates)
        startPolling()
      } catch (err) {
        console.error(err)
        setError((err as Error).message)
        setLoading(false)
      }
    },
    [fetcher, startPolling]
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
