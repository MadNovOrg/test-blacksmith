import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Button,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { Dialog } from '@app/components/dialogs'
import {
  DeleteOrgMutation,
  DeleteOrgMutationVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { DELETE_ORG } from '@app/queries/organization/delete-org'

export type DeleteOrgModalProps = {
  onClose: () => void
  open: boolean
  org: {
    id: string
    name: string
    count: {
      members: number
      courses: number
      orders: number
    }
  }
}

const DeleteOrgModal = ({ onClose, open, org }: DeleteOrgModalProps) => {
  const { t, _t } = useScopedTranslation('pages.org-details.tabs.details')
  const navigate = useNavigate()

  const [{ data, fetching, error }, deleteOrg] = useMutation<
    DeleteOrgMutation,
    DeleteOrgMutationVariables
  >(DELETE_ORG)

  const allowOrgDelete = useMemo(() => {
    return !(org.count.orders + org.count.members + org.count.orders)
  }, [org.count.members, org.count.orders])

  useEffect(() => {
    if (data?.deleteOrganisation?.success) {
      navigate('/organisations/all')
    }
  }, [data?.deleteOrganisation?.success, navigate])

  return (
    <Dialog
      onClose={onClose}
      open={open}
      slots={{
        Actions: () => (
          <>
            <Button onClick={onClose}>{_t('cancel')}</Button>
            {allowOrgDelete ? (
              <LoadingButton
                data-testid={'delete-org-btn'}
                loading={fetching}
                variant="contained"
                color="error"
                onClick={async () => {
                  await deleteOrg({ orgId: org.id })
                }}
              >
                {_t('delete')}
              </LoadingButton>
            ) : null}
          </>
        ),
        Title: () => <Typography>{t('delete-organisation')}</Typography>,
        Content: () => (
          <DialogContentText>
            {allowOrgDelete
              ? t('confirm-deleting', { name: org.name })
              : t('cannot-be-deleted')}
            {error ? (
              <Alert severity="error">{t('error-on-delete')}</Alert>
            ) : null}
            {!allowOrgDelete ? (
              <List>
                {Object.keys(org.count).map(key => {
                  const count = org.count[key as keyof typeof org.count]

                  return count > 0 ? (
                    <ListItem key={key}>
                      <ListItemText
                        primary={t(`count-${key}`, {
                          num: count,
                        })}
                      />
                    </ListItem>
                  ) : null
                })}
              </List>
            ) : null}
          </DialogContentText>
        ),
      }}
    ></Dialog>
  )
}

export default DeleteOrgModal
