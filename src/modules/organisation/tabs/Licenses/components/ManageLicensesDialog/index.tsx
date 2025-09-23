import { Alert, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  Go1ChangeError,
  Go1ChangeType,
  Go1LicensesChangeInput,
  Go1LicensesChangeMutation,
  Go1LicensesChangeMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import GO1_LICENSES_CHANGE_HISTORY from '@app/modules/organisation/queries/go1-licenses-history-change'

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

export const ManageLicensesDialog: React.FC<React.PropsWithChildren<Props>> = ({
  opened,
  onClose,
  onSave,
  orgId,
  currentBalance,
}) => {
  const { profile } = useAuth()
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses')
  const [errorMessageLabel, setErrorMessageLabel] = useState('')

  const [{ fetching: saving }, go1LicenseChange] = useMutation<
    Go1LicensesChangeMutation,
    Go1LicensesChangeMutationVariables
  >(GO1_LICENSES_CHANGE_HISTORY)

  const handleSave = async (data: FormData) => {
    const mutationInput: Go1LicensesChangeInput = {
      type: formTypeEventMap[data.type as Type],
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

    const { data: response } = await go1LicenseChange({ input: mutationInput })

    if (response?.go1LicensesChange?.success) {
      onSave()
    } else {
      switch (response?.go1LicensesChange?.error) {
        case Go1ChangeError.InvoiceNotAuthorized: {
          setErrorMessageLabel(`error-invoice-not-authorized`)
          break
        }
        case Go1ChangeError.InvalidInvoice: {
          setErrorMessageLabel(`error-invalid-invoice`)
          break
        }

        case Go1ChangeError.InvoicePaid: {
          setErrorMessageLabel(`error-invoice-paid`)
          break
        }

        default: {
          setErrorMessageLabel(`error-${mutationInput.type}-licenses`)
          break
        }
      }
    }
  }

  useEffect(() => {
    setErrorMessageLabel('')
  }, [])

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      title={t('manage-modal-title')}
      maxWidth={600}
      data-testid="manage-licenses-dialog"
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
