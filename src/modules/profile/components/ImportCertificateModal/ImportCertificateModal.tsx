import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import React, {
  ComponentProps,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, gql } from 'urql'

import { Dialog } from '@app/components/dialogs'
import {
  ImportLegacyCertificateMutation,
  ImportLegacyCertificateMutationVariables,
} from '@app/generated/graphql'

export const MUTATION = gql`
  mutation ImportLegacyCertificate($input: ImportLegacyCertificateInput!) {
    importLegacyCertificate(input: $input) {
      trainerRoleAdded
      success
      error
    }
  }
`

export type ImportCertificateModalProps = {
  onCancel: () => void
  onSubmit: () => void
  profileId?: string
} & ComponentProps<typeof Dialog>

export const ImportCertificateModal = forwardRef<
  ImportLegacyCertificateMutation | undefined,
  React.PropsWithChildren<ImportCertificateModalProps>
>(({ onCancel, onSubmit, profileId, ...props }, ref) => {
  const { t } = useTranslation()

  const [code, setCode] = useState('')

  const [{ data, error, fetching }, importCertificate] = useMutation<
    ImportLegacyCertificateMutation,
    ImportLegacyCertificateMutationVariables
  >(MUTATION)

  useImperativeHandle(
    ref,
    () => {
      return data
    },
    [data],
  )

  useEffect(() => {
    if (data?.importLegacyCertificate?.success) {
      onSubmit()
    }
  }, [data, onSubmit])

  return (
    <Dialog
      {...props}
      slots={{
        Title: () => (
          <>{t('common.course-certificate.update-certification-details')}</>
        ),
      }}
      maxWidth={600}
    >
      <Box>
        <Typography variant="body1" color="grey.700">
          {t('common.course-certificate.import-certificate-description')}
        </Typography>

        {error || data?.importLegacyCertificate?.error ? (
          <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
            {t([
              `components.import-certificate-dialog.${data?.importLegacyCertificate?.error}-error`,
              'components.import-certificate-dialog.generic-error',
            ])}
          </Alert>
        ) : null}

        <TextField
          sx={{ my: 3 }}
          onChange={event => setCode(event.target.value)}
          variant="filled"
          label={t('common.course-certificate.enter-certificate-number')}
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
          <LoadingButton
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={() => importCertificate({ input: { code, profileId } })}
            disabled={!code}
            loading={fetching}
          >
            {t('common.course-certificate.add-certificate')}
          </LoadingButton>
        </Box>
      </Box>
    </Dialog>
  )
})

ImportCertificateModal.displayName = ImportCertificateModal.name
