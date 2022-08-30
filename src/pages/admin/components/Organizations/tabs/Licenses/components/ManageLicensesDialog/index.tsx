import { Alert, Typography } from '@mui/material'
import React, { useState } from 'react'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  Go1ChangeType,
  Go1LicensesChangeInput,
  Go1LicensesChangeMutation,
  Go1LicensesChangeMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import go1LicensesHistoryChange from '@app/queries/go1-licensing/go1-licenses-history-change'

import { FormData, ManageLicensesForm } from '../ManageLicensesForm'

type Props = {
  opened: boolean
  onClose: () => void
  onSave: () => void
  orgId: string
}

export const ManageLicensesDialog: React.FC<Props> = ({
  opened,
  onClose,
  onSave,
  orgId,
}) => {
  const { profile } = useAuth()
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses')
  const fetcher = useFetcher()
  const [savingError, setSavingError] = useState(false)

  const handleSave = async (data: FormData) => {
    const mutationInput: Go1LicensesChangeInput = {
      type: Go1ChangeType.LicensesAdded,
      amount: Number(data.amount),
      payload: {
        invoiceId: data.invoiceId,
        note: data.note,
        invokedBy: profile?.fullName,
      },
      orgId,
    }

    const response = await fetcher<
      Go1LicensesChangeMutation,
      Go1LicensesChangeMutationVariables
    >(go1LicensesHistoryChange, { input: mutationInput })

    if (response.go1LicensesChange?.success) {
      onSave()
    } else {
      setSavingError(true)
    }
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      title={t('manage-modal-title')}
      maxWidth={600}
    >
      <Typography variant="body2" mb={2}>
        {t('manage-modal-description')}
      </Typography>
      {savingError ? (
        <Alert severity="error">{t('error-adding-licenses')}</Alert>
      ) : null}
      <ManageLicensesForm
        onSave={handleSave}
        onCancel={onClose}
        currentBalance={100}
      />
    </Dialog>
  )
}
