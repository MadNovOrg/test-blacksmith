import { Box, Button, Grid } from '@mui/material'
import { useCallback, useRef, useState } from 'react'

import { Tile } from '@app/components/Tile'
import { useAuth } from '@app/context/auth'
import { Resource_Packs_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useOrgResourcePacks } from '@app/modules/course/hooks/useOrgResourcePacks'

import { ExportResourcePacksHistoryButton } from './components/ExportHistoryButton'
import { ManageResourcePacksDialog } from './components/ManageResourcePacksDialog'
import {
  ResourcePacksHistoryTable,
  ResourcePacksHistoryTableRef,
} from './components/ResourcePacksHistoryTable'
import { TileContent } from './components/TileContent'

type Props = {
  orgId: string
}
export const ResourcePacksTab: React.FC<React.PropsWithChildren<Props>> = ({
  orgId,
}) => {
  const historyTableRef = useRef<ResourcePacksHistoryTableRef>(null)

  const { t } = useScopedTranslation('pages.org-details.tabs.resource-packs')

  const { acl } = useAuth()

  const [openManage, setOpenManage] = useState(false)
  const onCloseManage = useCallback(() => setOpenManage(false), [])

  const { resourcePacks, refetch } = useOrgResourcePacks({ orgId })

  const onManageFormSubmitSuccess = useCallback(() => {
    refetch({ requestPolicy: 'network-only' })

    historyTableRef.current?.refetchOrgResourcePacksHistory({
      requestPolicy: 'network-only',
    })
  }, [refetch])

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Tile justifyContent="space-between">
            <TileContent
              titleTestId="remaining-resource-packs"
              title={t('total-remaining-resource-packs.title')}
              firstRowCount={
                resourcePacks.balance[
                  Resource_Packs_Type_Enum.DigitalWorkbook
                ] ?? 0
              }
              firstRowLabel={t(
                'total-remaining-resource-packs.digital-resource-packs',
              )}
              secondRowCount={
                resourcePacks.balance[Resource_Packs_Type_Enum.PrintWorkbook] ??
                0
              }
              secondRowLabel={t(
                'total-remaining-resource-packs.print-resource-packs',
              )}
            />

            {acl.canManageResourcePacks() ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setOpenManage(true)
                }}
                data-testid="manage-remaining-resource-packs"
              >
                {t('manage-button-label')}
              </Button>
            ) : null}
          </Tile>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Tile justifyContent="space-between">
            <TileContent
              titleTestId="unused-resource-packs"
              title={t('unused-resource-packs.title')}
              firstRowCount={
                resourcePacks.reserved[
                  Resource_Packs_Type_Enum.DigitalWorkbook
                ] ?? 0
              }
              firstRowLabel={t('unused-resource-packs.digital-resource-packs')}
              secondRowCount={
                resourcePacks.reserved[
                  Resource_Packs_Type_Enum.PrintWorkbook
                ] ?? 0
              }
              secondRowLabel={t('unused-resource-packs.print-resource-packs')}
            />
          </Tile>
        </Grid>
      </Grid>
      <Box mt={2} mb={2} textAlign="right">
        <ExportResourcePacksHistoryButton orgId={orgId} disabled={false} />
      </Box>

      <Box>
        <ResourcePacksHistoryTable orgId={orgId} ref={historyTableRef} />
      </Box>

      <ManageResourcePacksDialog
        onClose={onCloseManage}
        onFormSubmitSuccess={onManageFormSubmitSuccess}
        open={openManage}
        orgId={orgId}
      />
    </>
  )
}
