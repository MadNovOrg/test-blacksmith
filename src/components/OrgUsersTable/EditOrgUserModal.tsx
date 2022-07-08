import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { uniq } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFetcher } from '@app/hooks/use-fetcher'
import { positions } from '@app/pages/common/CourseBooking/components/org-data'
import {
  MUTATION as RemoveOrgMemberQuery,
  ParamsType as RemoveOrgMemberParamsType,
} from '@app/queries/organization/remove-org-member'
import {
  MUTATION as UpdateOrgMemberQuery,
  ParamsType as UpdateOrgMemberParamsType,
} from '@app/queries/organization/update-org-member'
import theme from '@app/theme'
import { OrganizationMember } from '@app/types'

export type EditOrgUserModalProps = {
  orgMember: OrganizationMember
  onClose: () => void
  onChange?: () => void
}

export const EditOrgUserModal: React.FC<EditOrgUserModalProps> = function ({
  orgMember,
  onClose,
  onChange,
}) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [error, setError] = useState<string>()
  const [isAdmin, setIsAdmin] = useState(orgMember.isAdmin)
  const [position, setPosition] = useState<string | null>(
    orgMember.position ?? null
  )

  const onRemove = useCallback(async () => {
    try {
      await fetcher<null, RemoveOrgMemberParamsType>(RemoveOrgMemberQuery, {
        id: orgMember.id,
      })
      if (onChange) onChange()
      onClose()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }, [fetcher, onChange, onClose, orgMember])

  const onSave = useCallback(async () => {
    try {
      await fetcher<null, UpdateOrgMemberParamsType>(UpdateOrgMemberQuery, {
        id: orgMember.id,
        member: { isAdmin, position },
      })
      if (onChange) onChange()
      onClose()
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }, [fetcher, isAdmin, onChange, onClose, orgMember, position])

  const allPositions = useMemo(() => {
    return uniq([
      ...positions.edu,
      ...positions.hsc_child,
      ...positions.hsc_adult,
      ...positions.other,
    ])
  }, [])

  return (
    <Container>
      <Autocomplete
        value={position}
        options={allPositions}
        onChange={(_, value) => setPosition(value)}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            variant="standard"
            label={t('common.position')}
            inputProps={{ ...params.inputProps, sx: { height: 40 } }}
            sx={{ bgcolor: 'grey.100', my: 2 }}
          />
        )}
      />

      <FormControlLabel
        sx={{ py: 2 }}
        control={
          <Switch
            checked={isAdmin}
            onChange={e => {
              setIsAdmin(e.target.checked)
            }}
            sx={{ px: 2 }}
          />
        }
        label={
          <Box>
            <Typography variant="body1">
              {t(
                'pages.org-details.tabs.users.edit-user-modal.organization-admin'
              )}
            </Typography>
            <Typography variant="body2" color={theme.palette.grey[700]}>
              {t(
                'pages.org-details.tabs.users.edit-user-modal.organization-admin-hint'
              )}
            </Typography>
          </Box>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Grid
        container
        display="flex"
        justifyContent="space-between"
        gap={2}
        mt={2}
      >
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          size="large"
          onClick={onRemove}
        >
          {t(
            'pages.org-details.tabs.users.edit-user-modal.remove-from-organization'
          )}
        </Button>
        <Box>
          <Button
            type="button"
            variant="text"
            color="secondary"
            size="large"
            onClick={onClose}
            sx={{ mr: 2 }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            onClick={onSave}
          >
            {t('common.save-changes')}
          </Button>
        </Box>
      </Grid>
    </Container>
  )
}
