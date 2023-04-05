import {
  Select,
  Box,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material'
import React, { useState } from 'react'

import {
  RevokeCertMutation,
  RevokeCertMutationVariables,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { MUTATION as REVOKE_CERT_MUTATION } from '@app/queries/certificate/revoke-certificate'

export type RevokeCertModalProps = {
  certificateId: string
  participantId: string
  onClose: VoidFunction
  onSuccess: VoidFunction
}

const RevokeCertModal: React.FC<
  React.PropsWithChildren<RevokeCertModalProps>
> = ({ certificateId, participantId, onClose, onSuccess }) => {
  const { t, _t } = useScopedTranslation(
    'common.course-certificate.revoke-cert-modal'
  )
  const [reason, setReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fetcher = useFetcher()

  const allowRevoke =
    reason && confirmed && (reason !== 'OTHER' || otherReason.trim())

  const handleRevoke = async () => {
    if (!allowRevoke) return

    setError(null)
    setSaving(true)

    try {
      await fetcher<RevokeCertMutation, RevokeCertMutationVariables>(
        REVOKE_CERT_MUTATION,
        {
          id: certificateId,
          participantId,
          payload: {
            note: `${reason}${reason === 'OTHER' ? ` - ${otherReason}` : ''}`,
          },
        }
      )
      setSaving(false)
      onSuccess()
    } catch (e: unknown) {
      setSaving(false)
      setError('revoke-error')
    }
  }

  return (
    <Box>
      <Typography variant="body1" gutterBottom color="secondary">
        {t('description')}
      </Typography>

      <Box mt={2}>
        <FormControl variant="standard" fullWidth>
          <InputLabel data-testid="revoke-reason-input" id="reason-label">
            {t('reason-for-revoke')}
          </InputLabel>
          <Select
            labelId="reason-label"
            onChange={e => {
              setReason(e.target.value)
              if (e.target.value !== 'OTHER') {
                setOtherReason('')
              }
            }}
            data-testid="revoke-reason-select"
            id="revoke-reason"
            label={t('reason-for-revoke')}
            value={reason}
          >
            <MenuItem value="BAD_BEHAVIOUR">{t('bad-behaviour')}</MenuItem>
            <MenuItem value="LEGAL_REASON">{t('legal-reason')}</MenuItem>
            <MenuItem value="OTHER">{t('other')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {reason === 'OTHER' && (
        <Box mt={2}>
          <TextField
            variant="standard"
            required
            label={t('specify-reason')}
            placeholder={t('specify-reason')}
            fullWidth
            value={otherReason}
            onChange={event => setOtherReason(event.target.value)}
          />
        </Box>
      )}

      <Box mt={2}>
        <FormControlLabel
          name="confirm-revoke"
          sx={{ flex: 1 }}
          control={
            <Checkbox
              data-testid="revoke-checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
            />
          }
          label={
            <Typography variant="caption">{t('confirm-revoke')}</Typography>
          }
        />
      </Box>

      {error && (
        <Box>
          <Typography variant="body2" color="error">
            {_t(error)}
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
          data-testid="confirm-button"
          sx={{ ml: 2 }}
          disabled={!allowRevoke || saving}
          onClick={handleRevoke}
        >
          {_t('confirm')}
        </Button>
      </Box>
    </Box>
  )
}

export default RevokeCertModal
