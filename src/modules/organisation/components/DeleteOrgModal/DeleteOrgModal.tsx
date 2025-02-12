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
import sanitize from 'sanitize-html'
import { useMutation, useQuery } from 'urql'

import { Dialog } from '@app/components/dialogs'
import { useAuth } from '@app/context/auth'
import {
  DeleteOrgMutation,
  DeleteOrgMutationVariables,
  GetOrganisationDetailsForDeleteQuery,
  GetOrganisationDetailsForDeleteQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { DELETE_ORG } from '@app/modules/organisation/queries/delete-org'

import { GET_ORGANISATION_DETAILS_FOR_DELETE } from './queries'

type OrgAggregateData = {
  count: { members: number; courses: number; orders: number }
}

export type DeleteOrgModalProps = {
  onClose: () => void
  open: boolean
  org: {
    id: string
    name: string
  }
}

const DeleteOrgModal = ({ onClose, open, org }: DeleteOrgModalProps) => {
  const { acl } = useAuth()
  const { t, _t } = useScopedTranslation('pages.org-details.tabs.details')
  const navigate = useNavigate()

  const [{ data: orgData, error: fetchOrgError }] = useQuery<
    GetOrganisationDetailsForDeleteQuery,
    GetOrganisationDetailsForDeleteQueryVariables
  >({
    query: GET_ORGANISATION_DETAILS_FOR_DELETE,
    variables: {
      orgId: org.id,
    },
    requestPolicy: 'network-only',
  })

  const [{ data, fetching, error }, deleteOrg] = useMutation<
    DeleteOrgMutation,
    DeleteOrgMutationVariables
  >(DELETE_ORG)

  const allowOrgDelete = useMemo(() => {
    if (!orgData) return false

    return !(
      (orgData.orgs?.members?.aggregate?.count ?? 0) +
      (orgData.orgs?.courses?.aggregate?.count ?? 0) +
      (orgData.orgs?.orders?.aggregate?.count ?? 0) +
      (orgData.orgs?.affiliatedOrgs?.aggregate?.count ?? 0)
    )
  }, [orgData])

  const deleteOrgModalData = useMemo<OrgAggregateData | null>(() => {
    const org = orgData?.orgs ? orgData?.orgs : null

    if (!org) return null

    if (
      [
        org.members?.aggregate?.count,
        org.courses?.aggregate?.count,
        org.orders?.aggregate?.count,
        org.affiliatedOrgs?.aggregate?.count,
      ].some(agg => !agg && agg !== 0)
    ) {
      return null
    }

    return {
      count: {
        members: org.members?.aggregate?.count as number,
        courses: org.courses?.aggregate?.count as number,
        orders: org.orders?.aggregate?.count as number,
        affiliatedOrgs: org.affiliatedOrgs?.aggregate?.count ?? 0,
      },
    }
  }, [orgData?.orgs])

  useEffect(() => {
    if (data?.deleteOrganisation?.success) {
      navigate('/organisations/all')
    }
  }, [data?.deleteOrganisation?.success, navigate])

  const sanitizedOrgName = sanitize(org.name)

  const dialogContent = () => {
    if (allowOrgDelete) {
      return t('confirm-deleting', {
        interpolation: { escapeValue: false },
        name: sanitizedOrgName,
      })
    } else if (acl.isAustralia()) {
      return t('cannot-be-deleted-with-main-org', {
        interpolation: { escapeValue: false },
        name: sanitizedOrgName,
      })
    } else {
      return t('cannot-be-deleted', {
        interpolation: { escapeValue: false },
        name: sanitizedOrgName,
      })
    }
  }

  return deleteOrgModalData ? (
    <Dialog
      onClose={onClose}
      open={open}
      data-testid="delete-org-modal"
      slots={{
        Actions: () => (
          <>
            <Button onClick={onClose} data-testid="delete-org-cancel">
              {_t('cancel')}
            </Button>
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
          <DialogContentText data-testid="delete-org-modal-content">
            {dialogContent()}
            {error || fetchOrgError ? (
              <Alert severity="error">{t('error-on-delete')}</Alert>
            ) : null}
            {!allowOrgDelete ? (
              <List>
                {Object.keys(deleteOrgModalData.count).map(key => {
                  const count =
                    deleteOrgModalData?.count[
                      key as keyof typeof deleteOrgModalData.count
                    ] ?? 0

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
  ) : null
}

export default DeleteOrgModal
