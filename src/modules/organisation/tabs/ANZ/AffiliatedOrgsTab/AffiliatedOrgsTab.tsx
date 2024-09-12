import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { CountryCode } from 'libphonenumber-js'
import { maxBy } from 'lodash-es'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import { Organization } from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import useAffiliatedOrganisations from '@app/modules/organisation/hooks/ANZ/useAffiliatedOrganisations'
import useOrgV2 from '@app/modules/organisation/hooks/ANZ/useOrgV2'
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_ROW_OPTIONS,
} from '@app/util'

import { AddAffiliatedOrgModal } from '../../components/AddAffiliatedOrgModal'
import { ManageAffiliatedOrgsButton } from '../../components/ManageAffiliatedOrgsButton/ManageAffiliatedOrgsButton'
import { ManageAffiliatedOrgsMenu } from '../../components/ManageAffiliatedOrgsMenu'
import { RemoveAffiliatedOrgModal } from '../../components/RemoveAffiliatedOrgModal'

type AffiliatedOrgsTabParams = {
  orgId: string
}

export const AffiliatedOrgsTab: React.FC<
  React.PropsWithChildren<AffiliatedOrgsTabParams>
> = ({ orgId }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(DEFAULT_PAGINATION_LIMIT)
  const [showAddAffiliateModal, setShowAddAffiliateModal] = useState(false)
  const [showRemoveAffiliateModal, setShowRemoveAffiliateModal] =
    useState(false)
  const [affiliateToUnlinkId, setAffiliateToUnlinkId] = useState<string>('')

  const { selected, checkbox, isSelected, setSelected } = useTableChecks()

  const { data, fetching, error } = useOrgV2({
    orgId,
    profileId: profile?.id,
    showAll: acl.canViewAllOrganizations(),
    withMainOrganisation: true,
    withAffiliatedOrganisationsCount: true,
  })

  const { data: affiliatedOrgs, reexecute: fetchAffiliatedOrgs } =
    useAffiliatedOrganisations(orgId, perPage, currentPage * perPage, true)

  const org = data?.orgs.length ? data.orgs[0] : null

  const count = org?.affiliated_organisations_aggregate?.aggregate?.count

  const cols = useMemo(() => {
    const _t = (col: string) =>
      t(`pages.org-details.tabs.affiliated-orgs.cols-${col}`)

    const madatoryCols = [
      checkbox.headCol(affiliatedOrgs?.organizations.map(org => org.id) ?? []),
      {
        id: 'name',
        label: _t('name'),
      },
      {
        id: 'country',
        label: _t('country'),
      },
      {
        id: 'region',
        label: _t('region-state-territory'),
      },
      {
        id: 'sector',
        label: _t('sector'),
      },
      {
        id: 'lastActivity',
        label: _t('last-activity'),
      },
      {
        id: 'createdAt',
        label: _t('created-on'),
      },
    ]

    const actionCols = [
      {
        id: 'actions',
        label: _t('actions'),
      },
    ]
    return [
      ...madatoryCols,
      ...(acl.canLinkToMainOrg() ? actionCols : []),
    ] as Col[]
  }, [acl, affiliatedOrgs?.organizations, checkbox, t])

  const showRegionCol = useMemo(() => {
    const colRegion = cols.find(({ id }) => id === 'region')
    if (colRegion) {
      return {
        isEmpty: !affiliatedOrgs?.organizations?.some(
          org => org?.address.region,
        ),
        id: colRegion.id,
      }
    }

    return {
      isEmpty: false,
    }
  }, [affiliatedOrgs?.organizations, cols])

  const filterCols = useMemo(() => {
    const { isEmpty: isEmptyRegionCol, id: regionColId } = showRegionCol

    if (isEmptyRegionCol) {
      return cols.filter(col => col.id != regionColId)
    }

    return cols
  }, [cols, showRegionCol])

  const affiliatedOrgsLastActivityData = useMemo(() => {
    const lastActivity: { [key: string]: Date | undefined } = {}

    affiliatedOrgs?.organizations.forEach(affiliatedOrg => {
      lastActivity[affiliatedOrg.id] = maxBy(
        affiliatedOrg.members,
        'profile.lastActivity',
      )?.profile.lastActivity
    })
    return lastActivity
  }, [affiliatedOrgs?.organizations])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    [],
  )

  const affiliatedOrgIds = useMemo(() => {
    return [...Array.from(selected), affiliateToUnlinkId].filter(Boolean)
  }, [affiliateToUnlinkId, selected])

  const handleCloseAddAffiliateModal = useCallback(() => {
    setShowAddAffiliateModal(false)
  }, [])

  const handleSubmitAddAffiliateOrgModal = useCallback(() => {
    setShowAddAffiliateModal(false)
    fetchAffiliatedOrgs({ requestPolicy: 'network-only' })
  }, [fetchAffiliatedOrgs])

  const handleCloseRemoveAffiliateModal = useCallback(() => {
    setShowRemoveAffiliateModal(false)
    setAffiliateToUnlinkId('')
  }, [])

  const handleSubmitRemoveAffiliatedOrgsModal = useCallback(() => {
    setShowRemoveAffiliateModal(false)
    setAffiliateToUnlinkId('')
    setSelected([])
    fetchAffiliatedOrgs({ requestPolicy: 'network-only' })
  }, [fetchAffiliatedOrgs, setSelected])

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1" mb={2}>
          {t('pages.org-details.tabs.affiliated-orgs.title')}
        </Typography>
        {acl.canLinkToMainOrg() ? (
          <Box display={'flex'}>
            <ManageAffiliatedOrgsButton
              disabled={affiliatedOrgIds.length < 1}
              handleClick={() => setShowRemoveAffiliateModal(true)}
            />

            <Button
              variant="contained"
              size="large"
              sx={{
                width: '250px',
                height: '50px',
                ml: '20px',
                mr: '10px',
              }}
              onClick={() => setShowAddAffiliateModal(true)}
              data-testid="add-an-affiliate"
            >
              {t('pages.org-details.tabs.affiliated-orgs.add-an-affiliate')}
            </Button>
          </Box>
        ) : null}
      </Box>

      {fetching ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-details-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {showAddAffiliateModal ? (
        <AddAffiliatedOrgModal
          mainOrgId={orgId}
          mainOrgName={org?.name ?? ''}
          mainOrgCountryCode={(org?.address?.countryCode as CountryCode) ?? ''}
          onClose={handleCloseAddAffiliateModal}
          onSave={handleSubmitAddAffiliateOrgModal}
        />
      ) : null}

      {showRemoveAffiliateModal ? (
        <RemoveAffiliatedOrgModal
          affiliatedOrgsIds={affiliatedOrgIds}
          onClose={handleCloseRemoveAffiliateModal}
          onSave={handleSubmitRemoveAffiliatedOrgsModal}
        />
      ) : null}

      {!fetching && !error && org ? (
        <Box sx={{ mt: '20px' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table data-testid="affiliated-organisations">
              <TableHead cols={filterCols} />
              <TableBody>
                <TableNoRows
                  noRecords={
                    !fetching && !affiliatedOrgs?.organizations?.length
                  }
                  itemsName={t('common.affiliated-orgs').toLocaleLowerCase()}
                  colSpan={cols.length}
                />

                {affiliatedOrgs?.organizations?.map(affiliatedOrg => (
                  <TableRow
                    key={`affiliated-org-${affiliatedOrg.id}`}
                    data-testid={`affiliated-org-${affiliatedOrg.id}`}
                    sx={{
                      backgroundColor: isSelected(affiliatedOrg.id)
                        ? 'grey.50'
                        : '',
                    }}
                  >
                    {checkbox.rowCell(
                      affiliatedOrg.id,
                      !acl.canLinkToMainOrg(),
                    )}
                    <TableCell>{affiliatedOrg.name}</TableCell>
                    <TableCell>{affiliatedOrg.address?.country}</TableCell>
                    {!showRegionCol.isEmpty ? (
                      <TableCell>{affiliatedOrg.address?.region}</TableCell>
                    ) : null}
                    <TableCell>
                      {t(`common.org-sectors.${affiliatedOrg.sector}`)}
                    </TableCell>
                    <TableCell>
                      {affiliatedOrgsLastActivityData[affiliatedOrg?.id]
                        ? t('dates.withTime', {
                            date: affiliatedOrgsLastActivityData[
                              affiliatedOrg?.id
                            ],
                          })
                        : t('indeterminate')}
                    </TableCell>
                    <TableCell>
                      {t('dates.withTime', {
                        date: affiliatedOrg.createdAt,
                      })}
                    </TableCell>
                    {acl.canLinkToMainOrg() ? (
                      <TableCell>
                        <ManageAffiliatedOrgsMenu
                          affiliatedOrg={
                            affiliatedOrg as Organization['affiliated_organisations'][0]
                          }
                          onUnlinkClick={item => {
                            setAffiliateToUnlinkId(item.id)
                            setShowRemoveAffiliateModal(true)
                          }}
                        />
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {count ? (
            <TablePagination
              component="div"
              count={count}
              page={currentPage}
              onPageChange={(_, page) => setCurrentPage(page)}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPage={perPage}
              rowsPerPageOptions={DEFAULT_PAGINATION_ROW_OPTIONS}
            />
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}
