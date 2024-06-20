import {
  Alert,
  AlertColor,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import {
  ImportArloCertificatesMutation,
  ImportArloCertificatesMutationVariables,
  ImportArloCertificatesOutput,
  ImportArloCertificatesResultQuery,
  ImportArloCertificatesResultQueryVariables,
} from '@app/generated/graphql'
import usePollQuery from '@app/hooks/usePollQuery'
import {
  IMPORT_ARLO_CERTIFICATES_ACTION,
  IMPORT_ARLO_CERTIFICATES_ACTION_RESULT,
} from '@app/queries/admin/import-arlo-certificates'

import { arrayBufferToBinaryString } from './helpers'

export const ArloImport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation()
  const [actionId, setActionId] = useState<string>()
  const [importInProgress, setImportInProgress] = useState(false)
  const [result, setResult] = useState<Partial<ImportArloCertificatesOutput>>()
  const [{ data: importResult, error: importResultError }, getArloResults] =
    useQuery<
      ImportArloCertificatesResultQuery,
      ImportArloCertificatesResultQueryVariables
    >({
      query: IMPORT_ARLO_CERTIFICATES_ACTION_RESULT,
      variables: { id: actionId },
      pause: true,
      requestPolicy: 'network-only',
    })

  const [{ error: importError }, importCertificates] = useMutation<
    ImportArloCertificatesMutation,
    ImportArloCertificatesMutationVariables
  >(IMPORT_ARLO_CERTIFICATES_ACTION)

  const [startPolling] = usePollQuery(
    async () => {
      setImportInProgress(true)
      if (actionId) {
        getArloResults()
      }
      if (importResult?.importArloCertificates?.output) {
        const { processed, added, invalid, invalidEntries, error } =
          importResult.importArloCertificates.output
        setResult({
          added: added ?? 0,
          processed: processed ?? 0,
          ...(invalid ? { invalid: invalid } : {}),
          ...(invalidEntries?.length ? { invalidEntries } : {}),
          ...(error ? { error } : {}),
        })
        setImportInProgress(false)
      }
    },
    () => {
      return !!result || !!importResultError
    },
    {
      interval: 5000,
      maxPolls: 30,
      onTimeout: () => setImportInProgress(false),
    }
  )

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) {
        return
      }
      setImportInProgress(true)
      const file = e.target.files[0]

      const encoded = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
          const binary = arrayBufferToBinaryString(reader.result as ArrayBuffer)
          resolve(btoa(binary))
        }
        reader.onerror = () => {
          reader.abort()
          reject(new Error('Error reading the file.'))
        }
      })
      try {
        const { data } = await importCertificates({ report: encoded })
        setActionId(data?.importArloCertificates)
        startPolling()
      } catch (err) {
        setImportInProgress(false)
      }
    },
    [importCertificates, startPolling]
  )

  const alertSeverity: AlertColor | undefined = useMemo(() => {
    if (result?.invalid) return 'warning'
    if (result?.processed && result.added && result.processed > result.added)
      return 'warning'
    return 'success'
  }, [result?.added, result?.processed, result?.invalid])

  return (
    <Container maxWidth="lg" sx={{ py: 5, textAlign: 'center' }}>
      <Stack gap={4} alignItems="center">
        <Typography variant="h1">
          {t('pages.arlo.import-certificate-report')}
        </Typography>

        {importInProgress ? (
          <CircularProgress data-testid="arlo-import-loading" />
        ) : null}

        {importResultError || importError || result?.error ? (
          <Alert severity="error" variant="outlined">
            {(importResultError ?? importError)?.message ?? result?.error}
          </Alert>
        ) : null}

        {result && !importInProgress ? (
          <Alert severity={alertSeverity} variant="outlined">
            {t('pages.arlo.import-certificate-success', result)}
          </Alert>
        ) : null}

        {result?.invalid && result.invalidEntries?.length ? (
          <>
            <Alert severity="error" variant="outlined">
              <Typography>Invalid entries:</Typography>
              {result.invalidEntries.map(entry => `${entry?.email} \n`)}
            </Alert>
          </>
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
