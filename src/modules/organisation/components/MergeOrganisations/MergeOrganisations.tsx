import Button from '@mui/material/Button'
import { FC, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SnackbarMessage } from '@app/components/SnackbarMessage'
import { useAuth } from '@app/context/auth'
import {
  GetOrganisationDetailsQuery,
  MergeOrganisationsStatus,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { MergeOrganisationsDialog } from '../MergeOrganisationsDialog'
type Props = {
  selectedOrgs: GetOrganisationDetailsQuery['orgs'][0][]
}

const snackbar = {
  [MergeOrganisationsStatus.Success]: () => (
    <SnackbarMessage
      severity="success"
      messageKey="organisation-merge-success"
    />
  ),
  [MergeOrganisationsStatus.Fail]: () => (
    <SnackbarMessage severity="error" messageKey="organisation-merge-fail" />
  ),
}

export const MergeOrganisations: FC<Props> = ({ selectedOrgs }) => {
  const navigate = useNavigate()
  const {
    acl: { isAdmin },
  } = useAuth()

  const { t } = useScopedTranslation('pages.admin.organizations.merge')
  const location = useLocation()
  const merging = location.pathname.includes('/merge')
  const [mergeOrganisationsDialogOpen, setMergeOrganisationsDialogOpen] =
    useState(false)

  const mergeStatus = location.state?.mergeStatus as MergeOrganisationsStatus

  if (!isAdmin()) return null
  return (
    <>
      {!merging && (
        <Button
          variant="contained"
          data-testid="merge-organizations-button"
          onClick={() => navigate('../merge', { state: location.state })}
        >
          {t('title')}
        </Button>
      )}
      {merging && (
        <Button
          variant="contained"
          data-testid="merge-selected-button"
          disabled={selectedOrgs.length < 2}
          onClick={() =>
            setMergeOrganisationsDialogOpen(!mergeOrganisationsDialogOpen)
          }
        >
          {t('merge-selected')}
        </Button>
      )}
      {mergeOrganisationsDialogOpen && (
        <MergeOrganisationsDialog
          data-testid="merge-organisations-dialog"
          selectedOrgs={selectedOrgs}
          open={mergeOrganisationsDialogOpen}
          onClose={() => setMergeOrganisationsDialogOpen(false)}
        />
      )}

      {mergeStatus ? snackbar[mergeStatus]() : null}
    </>
  )
}
