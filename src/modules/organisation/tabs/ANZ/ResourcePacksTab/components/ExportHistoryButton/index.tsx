import { LoadingButton } from '@mui/lab'
import { saveAs } from 'file-saver'
import { useEffect } from 'react'
import { utils as xlsxUtils, write } from 'xlsx'

import { Resource_Packs_Type_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useAllOrgResourcePacksHistory } from '@app/modules/organisation/queries/get-all-org-resource-packs-history'

type Props = {
  disabled: boolean
  orgId: string
}
const exportOption: Record<Resource_Packs_Type_Enum, string> = {
  [Resource_Packs_Type_Enum.DigitalWorkbook]: 'DIGITAL',
  [Resource_Packs_Type_Enum.PrintWorkbook]: 'PRINT',
}
const getCostPerRP = (amount: number | string | null | undefined) => {
  if (Number(amount)) return Number(amount).toFixed(2)
  return ''
}
export const ExportResourcePacksHistoryButton: React.FC<
  React.PropsWithChildren<Props>
> = ({ orgId, disabled }) => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-packs.export',
  )

  const {
    data: resourcePacksHistory,
    fetching,
    refetch,
  } = useAllOrgResourcePacksHistory(orgId, true)

  useEffect(() => {
    if (resourcePacksHistory?.history?.length) {
      const historyData: string[][] = [
        [
          t('columns.date'),
          t('columns.event'),
          t('columns.option'),
          t('columns.invoice-nr'),
          t('columns.course-code'),
          t('columns.course-start'),
          t('columns.note'),
          t('columns.invoked-by'),
          t('columns.amount'),
          t('columns.balance'),
          t('columns.reserved-balance'),
          t('columns.cost-per-resource-pack'),
          t('columns.currency'),
        ],
        ...resourcePacksHistory.history.map(historyItem => {
          return [
            _t('dates.defaultShort', {
              date: historyItem.created_at,
            }),
            historyItem.event,
            exportOption[historyItem.resourcePacksType],
            historyItem.payload?.invoiceNumber ?? '',
            historyItem.course?.code ?? '',
            _t('dates.defaultShort', {
              date: historyItem.course?.schedule[0]?.start ?? '',
            }),
            historyItem.payload?.note ?? '',
            historyItem.payload?.invokedByName ?? '',
            historyItem.change,
            historyItem.totalBalance,
            historyItem.reservedBalance,
            getCostPerRP(historyItem.payload?.costPerResourcePack),
            historyItem.payload?.currency,
          ]
        }),
      ]
      const wb = xlsxUtils.book_new()
      const ws = xlsxUtils.aoa_to_sheet(historyData)
      xlsxUtils.book_append_sheet(wb, ws, 'Org resource packs history')

      const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' })

      saveAs(new Blob([buffer]), `org-rp-history-${orgId}.xlsx`)
    }
  }, [_t, orgId, resourcePacksHistory?.history, t])

  const exportHistory = () => {
    refetch({ requestPolicy: 'network-only' })
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={exportHistory}
      disabled={disabled}
      loading={fetching}
      data-testid="export-resource-pack-history"
    >
      {t('button-label')}
    </LoadingButton>
  )
}
