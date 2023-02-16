import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useQuery } from 'urql'

import { Tile } from '@app/components/Tile'
import { useAuth } from '@app/context/auth'
import {
  OrgLicensesWithHistoryQuery,
  OrgLicensesWithHistoryQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useTablePagination } from '@app/hooks/useTablePagination'
import orgLicensesWithHistory from '@app/queries/go1-licensing/org-licenses-with-history'

import { ExportHistoryButton } from './components/ExportHistoryButton'
import { LicensesHistoryTable } from './components/LicensesHistoryTable'
import { ManageLicensesDialog } from './components/ManageLicensesDialog'

type Props = {
  orgId: string
}

export const LicensesTab: React.FC<React.PropsWithChildren<Props>> = ({
  orgId,
}) => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation('pages.org-details.tabs.licenses')

  const [manageModalOpened, setManageModalOpened] = useState(false)

  const openModal = () => setManageModalOpened(true)
  const closeModal = () => setManageModalOpened(false)

  const { Pagination, perPage, currentPage } = useTablePagination({
    id: 'tbl',
    initialPerPage: 5,
  })

  const [{ data, fetching, error }, refetch] = useQuery<
    OrgLicensesWithHistoryQuery,
    OrgLicensesWithHistoryQueryVariables
  >({
    query: orgLicensesWithHistory,
    variables: {
      id: orgId,
      offset: perPage * (currentPage - 1),
      limit: perPage,
    },
    requestPolicy: 'cache-and-network',
  })

  const handleSave = () => {
    refetch()
    closeModal()
  }

  const licensesHistory = data?.organization_by_pk?.go1LicensesHistory
  const totalHistory =
    data?.organization_by_pk?.go1LicensesHistory_aggregate?.aggregate?.count

  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
          {t('org-history-fetch-error')}
        </Alert>
      ) : null}

      {fetching && !data ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="org-licenses-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : null}

      {!fetching && data ? (
        <>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Tile justifyContent="space-between">
                <Box>
                  <Typography
                    variant="h2"
                    mb={2}
                    data-testid="licenses-remaining"
                  >
                    {data?.organization_by_pk?.go1Licenses}
                  </Typography>
                  <Typography variant="body2">
                    {t('remaining-licenses')}
                  </Typography>
                </Box>
                {acl.canManageBlendedLicenses() ? (
                  <Button variant="contained" size="small" onClick={openModal}>
                    {t('manage-button-label')}
                  </Button>
                ) : null}
              </Tile>
            </Grid>
            <Grid item xs={6}>
              <Tile>
                <Box>
                  <Typography variant="h2" mb={2}>
                    {data.organization_by_pk?.reservedGo1Licenses ?? 0}
                  </Typography>
                  <Typography variant="body2">
                    {t('unused-licenses')}
                  </Typography>
                </Box>
              </Tile>
            </Grid>
          </Grid>

          <Box mt={2} mb={2} textAlign="right">
            <ExportHistoryButton disabled={!totalHistory} orgId={orgId} />
          </Box>

          {licensesHistory ? (
            <LicensesHistoryTable items={licensesHistory}>
              {totalHistory ? <Pagination total={totalHistory} /> : null}
            </LicensesHistoryTable>
          ) : null}

          <ManageLicensesDialog
            opened={manageModalOpened}
            onClose={closeModal}
            onSave={handleSave}
            orgId={orgId}
            currentBalance={data?.organization_by_pk?.go1Licenses ?? 0}
          />
        </>
      ) : null}
    </>
  )
}
