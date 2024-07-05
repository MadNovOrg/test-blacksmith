import { LoadingButton } from '@mui/lab'
import { saveAs } from 'file-saver'
import React, { useEffect } from 'react'
import { useQuery } from 'urql'
import { utils as xlsxUtils, write } from 'xlsx'

import {
  OrgLicensesWithHistoryQuery,
  OrgLicensesWithHistoryQueryVariables,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import orgLicensesWithHistory from '@app/queries/go1-licensing/org-licenses-with-history'

type Props = {
  disabled: boolean
  orgId: string
}

export const ExportHistoryButton: React.FC<React.PropsWithChildren<Props>> = ({
  orgId,
  disabled,
}) => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.licenses.export',
  )

  const [{ data, fetching }, fetchHistory] = useQuery<
    OrgLicensesWithHistoryQuery,
    OrgLicensesWithHistoryQueryVariables
  >({
    query: orgLicensesWithHistory,
    pause: true, // don't fire on mount
    variables: {
      id: orgId,
    },
  })

  useEffect(() => {
    if (data?.organization_by_pk?.go1LicensesHistory?.length) {
      const historyData: string[][] = [
        [
          t('col-date'),
          t('col-event'),
          t('col-invoice-id'),
          t('col-course-code'),
          t('col-course-start'),
          t('col-note'),
          t('col-invoked-by'),
          t('col-amount'),
          t('col-balance'),
          t('col-reserved-balance'),
          t('col-license-price'),
        ],
        ...data.organization_by_pk.go1LicensesHistory.map(historyItem => {
          return [
            _t('dates.defaultShort', {
              date: historyItem.captured_at,
            }),
            historyItem.event,
            historyItem.payload?.invoiceId ?? '',
            historyItem.payload?.courseCode ?? '',
            _t('dates.withTime', {
              date: historyItem.payload?.courseStartDate ?? '',
            }),
            historyItem.payload?.note ?? '',
            historyItem.payload?.invokedBy ?? '',
            `${historyItem.change > 0 ? '+' : ''}${historyItem.change}`,
            historyItem.balance,
            historyItem.reservedBalance,
            historyItem.payload.licensePrice ?? '',
          ]
        }),
      ]

      const wb = xlsxUtils.book_new()
      const ws = xlsxUtils.aoa_to_sheet(historyData)
      xlsxUtils.book_append_sheet(wb, ws, 'Licenses history')

      const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' })

      saveAs(new Blob([buffer]), `licenses-history-${orgId}.xlsx`)
    }
  }, [data, orgId, _t, t])

  const exportHistory = () => {
    fetchHistory({ requestPolicy: 'network-only' })
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={exportHistory}
      disabled={disabled}
      loading={fetching}
      data-testid="export-history"
    >
      {fetching ? t('exporting-button-text') : t('button-text')}
    </LoadingButton>
  )
}
