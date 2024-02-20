import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material'
import React, { useState } from 'react'
import { useMutation } from 'urql'

import {
  UndoRevokeCertMutation,
  UndoRevokeCertMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { MUTATION as UNDO_REVOKE_CERT_MUTATION } from '@app/queries/certificate/undo-revoke-certificate'

export type UndoRevokeModalProps = {
  certificateId: string
  participantId: string
  onClose: VoidFunction
  onSuccess: VoidFunction
}

const UndoRevokeModal: React.FC<
  React.PropsWithChildren<UndoRevokeModalProps>
> = ({ certificateId, participantId, onClose, onSuccess }) => {
  const { t, _t } = useScopedTranslation(
    'common.course-certificate.undo-revoke-modal'
  )
  const [confirmed, setConfirmed] = useState(false)

  const [{ error, fetching: saving }, undoRevokeCert] = useMutation<
    UndoRevokeCertMutation,
    UndoRevokeCertMutationVariables
  >(UNDO_REVOKE_CERT_MUTATION)

  const allowUndoRevoke = confirmed

  const handleUndoRevoke = async () => {
    if (!allowUndoRevoke) return
    await undoRevokeCert({ id: certificateId, participantId })
    onSuccess()
    if (!error) onSuccess()
  }

  return (
    <Box>
      <Typography variant="body1" gutterBottom color="secondary">
        {t('description')}
      </Typography>

      <Box mt={2}>
        <FormControlLabel
          name="confirm-undo"
          sx={{ flex: 1 }}
          control={
            <Checkbox
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
            />
          }
          label={<Typography variant="caption">{t('confirm-undo')}</Typography>}
        />
      </Box>

      {error && (
        <Box>
          <Typography variant="body2" color="error">
            {t('undo-error')}
          </Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="text" onClick={onClose}>
          {_t('cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          disabled={!allowUndoRevoke || saving}
          onClick={handleUndoRevoke}
        >
          {_t('confirm')}
        </Button>
      </Box>
    </Box>
  )
}

export default UndoRevokeModal
