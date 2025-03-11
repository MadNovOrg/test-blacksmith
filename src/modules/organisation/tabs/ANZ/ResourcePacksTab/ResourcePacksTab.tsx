import { Box, Button, Grid, Typography } from '@mui/material'

import { Tile } from '@app/components/Tile'
import { useAuth } from '@app/context/auth'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { ExportResourcePacksHistoryButton } from './components/ExportHistoryButton'
import { TileContent } from './components/TileContent'

type Props = {
  orgId: string
}
export const ResourcePacksTab: React.FC<React.PropsWithChildren<Props>> = ({
  orgId,
}) => {
  const { acl } = useAuth()
  const { t } = useScopedTranslation('pages.org-details.tabs.resource-packs')

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Tile justifyContent="space-between">
            <TileContent
              titleTestId="remaining-resource-packs"
              title={t('total-remaining-resource-packs.title')}
              firstRowCount={0}
              firstRowLabel={t(
                'total-remaining-resource-packs.digital-resource-packs',
              )}
              secondRowCount={0}
              secondRowLabel={t(
                'total-remaining-resource-packs.print-resource-packs',
              )}
            />

            {acl.canManageResourcePacks() ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  console.log('openModal')
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
              firstRowCount={0}
              firstRowLabel={t('unused-resource-packs.digital-resource-packs')}
              secondRowCount={0}
              secondRowLabel={t('unused-resource-packs.print-resource-packs')}
            />
          </Tile>
        </Grid>
      </Grid>
      <Box mt={2} mb={2} textAlign="right">
        <ExportResourcePacksHistoryButton orgId={orgId} disabled={false} />
      </Box>
      <Box>
        <Typography>
          TO DO: Implement table, based on the db structure, and requested
          columns
        </Typography>
      </Box>
    </>
  )
}
