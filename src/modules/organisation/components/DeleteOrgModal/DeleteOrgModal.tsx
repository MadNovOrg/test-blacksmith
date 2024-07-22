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
import {
  DeleteOrgMutation,
  DeleteOrgMutationVariables,
  GetOrganisationDetailsForDeleteQuery,
  GetOrganisationDetailsForDeleteQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { GET_ORGANISATION_DETAILS_FOR_DELETE } from '@app/modules/organisation/components/DeleteOrgModal/queries'
import { DELETE_ORG } from '@app/modules/organisation/queries/delete-org'

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
    requestPolicy: 'cache-and-network',
  })

  const [{ data, fetching, error }, deleteOrg] = useMutation<
    DeleteOrgMutation,
    DeleteOrgMutationVariables
  >(DELETE_ORG)

  const allowOrgDelete = useMemo(() => {
    if (!orgData) return false

    return !(
      (orgData.orgs?.members.aggregate?.count ?? 0) +
      (orgData.orgs?.courses.aggregate?.count ?? 0) +
      (orgData.orgs?.orders.aggregate?.count ?? 0)
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
      ].some(agg => !agg && agg !== 0)
    ) {
      return null
    }

    return {
      count: {
        members: org.members?.aggregate?.count as number,
        courses: org.courses?.aggregate?.count as number,
        orders: org.orders?.aggregate?.count as number,
      },
    }
  }, [orgData?.orgs])

  useEffect(() => {
    if (data?.deleteOrganisation?.success) {
      navigate('/organisations/all')
    }
  }, [data?.deleteOrganisation?.success, navigate])

  const sanitizedOrgName = sanitize(org.name)

  return deleteOrgModalData ? (
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
              ? t('confirm-deleting', {
                  interpolation: { escapeValue: false },
                  name: sanitizedOrgName,
                })
              : t('cannot-be-deleted', {
                  interpolation: { escapeValue: false },
                  name: sanitizedOrgName,
                })}
            {error || fetchOrgError ? (
              <Alert severity="error">{t('error-on-delete')}</Alert>
            ) : null}
            {!allowOrgDelete ? (
              <List>
                {Object.keys(deleteOrgModalData.count).map(key => {
                  const count =
                    deleteOrgModalData!.count[
                      key as keyof typeof deleteOrgModalData.count
                    ]

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
