import { Alert, Typography } from '@mui/material'
import React, { useState } from 'react'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import {
  Go1ChangeError,
  Go1ChangeType,
  Go1LicensesChangeInput,
  Go1LicensesChangeMutation,
  Go1LicensesChangeMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import go1LicensesHistoryChange from '@app/queries/go1-licensing/go1-licenses-history-change'

import { FormData, Type, ManageLicensesForm } from '../ManageLicensesForm'

type Props = {
  opened: boolean
  onClose: () => void
  onSave: () => void
  orgId: string
  currentBalance: number
}

const formTypeEventMap = {
  [Type.ADD]: Go1ChangeType.LicensesAdded,
  [Type.REMOVE]: Go1ChangeType.LicensesRemoved,
}

export const ManageLicensesDialog: React.FC<Props> = ({
  opened,
  onClose,
  onSave,
  orgId,
  currentBalance,
}) => {
  const { profile } = useAuth()
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses')
  const fetcher = useFetcher()
  const [errorMessageLabel, setErrorMessageLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: FormData) => {
    setSaving(true)

    const mutationInput: Go1LicensesChangeInput = {
      type: formTypeEventMap[data.type],
      amount: Number(data.amount),
      payload: {
        ...(data.invoiceId ? { invoiceId: data.invoiceId } : null),
        ...(data.licensePrice ? { licensePrice: data.licensePrice } : null),
        note: data.note,
        invokedBy: profile?.fullName,
        invokedById: profile?.id,
      },
      orgId,
    }

    const response = await fetcher<
      Go1LicensesChangeMutation,
      Go1LicensesChangeMutationVariables
    >(go1LicensesHistoryChange, { input: mutationInput })

    setSaving(false)

    if (response.go1LicensesChange?.success) {
      onSave()
    } else {
      if (
        response.go1LicensesChange?.error ===
        Go1ChangeError.InvoiceNotAuthorized
      ) {
        setErrorMessageLabel(`error-invoice-not-authorized`)
      } else {
        setErrorMessageLabel(`error-${mutationInput.type}-licenses`)
      }
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
      {errorMessageLabel ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t(errorMessageLabel)}
        </Alert>
      ) : null}
      <ManageLicensesForm
        onSave={handleSave}
        onCancel={onClose}
        currentBalance={currentBalance}
        saving={saving}
      />
    </Dialog>
  )
}
