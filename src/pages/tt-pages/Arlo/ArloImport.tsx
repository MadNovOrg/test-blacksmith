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
import { useMutation, useQuery } from 'urql'

import {
  ImportArloCertificatesMutation,
  ImportArloCertificatesMutationVariables,
  ImportArloCertificatesResultQuery,
  ImportArloCertificatesResultQueryVariables,
} from '@app/generated/graphql'
import usePollQuery from '@app/hooks/usePollQuery'
import {
  IMPORT_ARLO_CERTIFICATES_ACTION,
  IMPORT_ARLO_CERTIFICATES_ACTION_RESULT,
} from '@app/queries/admin/import-arlo-certificates'

export const ArloImport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const [actionId, setActionId] = useState<string>()
  const [result, setResult] = useState<{ processed: number; added: number }>()
  const [
    {
      data: importResult,
      error: importResultError,
      fetching: importResultFetching,
    },
  ] = useQuery<
    ImportArloCertificatesResultQuery,
    ImportArloCertificatesResultQueryVariables
  >({
    query: IMPORT_ARLO_CERTIFICATES_ACTION_RESULT,
    variables: { id: actionId },
    pause: !actionId,
  })

  const [{ error: importError }, importCertificates] = useMutation<
    ImportArloCertificatesMutation,
    ImportArloCertificatesMutationVariables
  >(IMPORT_ARLO_CERTIFICATES_ACTION)

  const [startPolling] = usePollQuery(
    async () => {
      if (importResult?.importArloCertificates?.output) {
        setResult(importResult.importArloCertificates.output)
      }
    },
    () => !!result || !!importResultError,
    {
      interval: 5000,
      maxPolls: 30,
    }
  )

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) {
        return
      }

      const file = e.target.files[0]

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

      const { data } = await importCertificates({ report: encoded })
      setActionId(data?.importArloCertificates)
      startPolling()
    },
    [importCertificates, startPolling]
  )

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
      <Stack gap={4} alignItems="center">
        <Typography variant="h1">
          {t('pages.arlo.import-certificate-report')}
        </Typography>

        {importResultFetching ? (
          <CircularProgress data-testid="arlo-import-loading" />
        ) : null}

        {importResultError || importError ? (
          <Typography>{(importResultError ?? importError)?.message}</Typography>
        ) : null}

        {result && !importResultFetching ? (
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
