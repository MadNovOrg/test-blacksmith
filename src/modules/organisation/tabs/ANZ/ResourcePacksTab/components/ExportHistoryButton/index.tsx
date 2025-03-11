import { LoadingButton } from '@mui/lab'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

type Props = {
  disabled: boolean
  orgId: string
}
export const ExportResourcePacksHistoryButton: React.FC<
  React.PropsWithChildren<Props>
> = ({ orgId, disabled }) => {
  const { t } = useScopedTranslation(
    'pages.org-details.tabs.resource-packs.export',
  )

  const exportHistory = () => {
    console.log('exportHistory for org:', orgId)
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={exportHistory}
      disabled={disabled}
      data-testid="export-resource-pack-history"
    >
      {t('button-label')}
    </LoadingButton>
  )
}
