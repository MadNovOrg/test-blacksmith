import { LoadingButton } from '@mui/lab'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { differenceInYears } from 'date-fns'
import saveAs from 'file-saver'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'
import { utils as xlsxUtils, write } from 'xlsx'

import { Dialog } from '@app/components/dialogs'
import { GET_LICENSES_HISTORY } from '@app/components/dialogs/ExportBlendedDialog/queries/all-org-licenses-with-history'
import { FilterByDates } from '@app/components/filters/FilterByDates'
import {
  LicensesHistoryBetweenDatesQuery,
  LicensesHistoryBetweenDatesQueryVariables,
} from '@app/generated/graphql'

type Props = {
  isOpen: boolean
  closeModal: () => void
}

type DateFilters = {
  filterStartDate?: Date
  filterEndDate?: Date
}

export const ExportBlendedDialog: React.FC<React.PropsWithChildren<Props>> = ({
  isOpen,
  closeModal,
}) => {
  const { t } = useTranslation()
  const [dateFilters, setDateFilters] = useState<DateFilters>()
  const [error, setError] = useState<string | null>(null)
  const [needFetch, setNeedFetch] = useState<boolean>(false)

  // Memoize variables passed to useQuery
  const queryVariables = useMemo(
    () => ({
      from: dateFilters?.filterStartDate?.toISOString(),
      to: dateFilters?.filterEndDate?.toISOString(),
    }),
    [dateFilters],
  )

  const [{ data, fetching }, fetchHistory] = useQuery<
    LicensesHistoryBetweenDatesQuery,
    LicensesHistoryBetweenDatesQueryVariables
  >({
    query: GET_LICENSES_HISTORY,
    pause: true, // don't fire on mount
    variables: queryVariables,
  })

  const fileName = useMemo(
    () =>
      `licenses-history-${dateFilters?.filterEndDate?.toDateString()}-${dateFilters?.filterStartDate?.toDateString()}.xlsx`,
    [dateFilters],
  )

  useEffect(() => {
    if (data?.go1LicensesHistory?.length && needFetch) {
      const historyData: string[][] = [
        [
          t('pages.org-details.tabs.licenses.export.col-date'),
          t('pages.org-details.tabs.licenses.export.col-organisation'),
          t('pages.org-details.tabs.licenses.export.col-event'),
          t('pages.org-details.tabs.licenses.export.col-invoice-id'),
          t('pages.org-details.tabs.licenses.export.col-course-code'),
          t('pages.org-details.tabs.licenses.export.col-course-start'),
          t('pages.org-details.tabs.licenses.export.col-note'),
          t('pages.org-details.tabs.licenses.export.col-invoked-by'),
          t('pages.org-details.tabs.licenses.export.col-amount'),
          t('pages.org-details.tabs.licenses.export.col-balance'),
          t('pages.org-details.tabs.licenses.export.col-reserved-balance'),
          t('pages.org-details.tabs.licenses.export.col-license-price'),
        ],
        ...data.go1LicensesHistory.map(historyItem => {
          return [
            t('dates.defaultShort', {
              date: historyItem.captured_at,
            }),
            historyItem.organization.name,
            historyItem.event,
            historyItem.payload?.invoiceId ?? '',
            historyItem.payload?.courseCode ?? '',
            t('dates.withTime', {
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

      saveAs(new Blob([buffer]), fileName)
      setNeedFetch(false)
      closeModal()
    }
  }, [closeModal, data, fileName, needFetch, t])

  const onCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const onExport = useCallback(() => {
    if (!dateFilters?.filterStartDate || !dateFilters.filterEndDate) {
      setError(t('pages.admin.organizations.export.dates-non-null'))
      return
    }
    if (
      differenceInYears(dateFilters.filterStartDate, dateFilters.filterEndDate)
    ) {
      setError(t('pages.admin.organizations.export.date-interval'))
    } else {
      setError(null)
      fetchHistory({ requestPolicy: 'network-only' })
      setNeedFetch(true)
    }
  }, [dateFilters, fetchHistory, t])

  const onDatesChange = useCallback((from?: Date, to?: Date) => {
    setError(null)
    setDateFilters(prev => {
      return {
        ...prev,
        filterStartDate: from,
        filterEndDate: to ? new Date(to?.setHours(23, 59)) : undefined,
      }
    })
  }, [])

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      title={t('pages.admin.organizations.export.blended-learning')}
      maxWidth={600}
    >
      <Stack gap={6}>
        {fetching ? (
          <CircularProgress />
        ) : (
          <Box>
            <FilterByDates
              onChange={onDatesChange}
              title={t(
                'pages.admin.organizations.export.filter-by-captured-date',
              )}
              data-testid={'date-range'}
              queryParam={'date-range'}
            />
            {error && (
              <Typography variant="body2" color="red">
                {error}
              </Typography>
            )}
          </Box>
        )}
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, mt: 2 }}>
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <LoadingButton
          variant="contained"
          onClick={onExport}
          loading={fetching}
          disabled={fetching}
        >
          {t('export')}
        </LoadingButton>
      </Box>
    </Dialog>
  )
}
