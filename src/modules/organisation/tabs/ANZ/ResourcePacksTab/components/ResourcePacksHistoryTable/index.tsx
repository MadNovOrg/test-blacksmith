import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { useQuery } from 'urql'

import { TableHead } from '@app/components/Table/TableHead'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useOrgResourcePacksHistory } from '@app/modules/organisation/queries/get-org-resource-packs-history'
import theme from '@app/theme'

import { ResourcePacksEventCol } from './ResourcePacksEventCol'

export type ResourcePacksHistoryTableRef = {
  refetchOrgResourcePacksHistory: ReturnType<typeof useQuery>[1]
}

type ResourcePacksHistoryTableProps = {
  orgId: string
}

export const ResourcePacksHistoryTable = forwardRef<
  ResourcePacksHistoryTableRef,
  ResourcePacksHistoryTableProps
>(({ orgId }: ResourcePacksHistoryTableProps, ref) => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.resource-packs.table',
  )

  const { Pagination, perPage, currentPage } = useTablePagination({
    id: 'org-resource-packs-history-tbl',
    initialPerPage: 12,
  })

  const [{ data: resourcePacksHistory }, refetch] = useOrgResourcePacksHistory({
    limit: perPage,
    offset: perPage * (currentPage - 1),
    orgId,
  })

  useImperativeHandle(ref, () => ({
    refetchOrgResourcePacksHistory: refetch,
  }))

  const cols = useMemo(
    () => [
      { id: 'date', label: t('col-date'), sorting: false },
      { id: 'event', label: t('col-event'), sorting: false },
      { id: 'option', label: t('col-option'), sorting: false },
      { id: 'change', label: t('col-amount'), sorting: false },
      { id: 'balance', label: t('col-balance'), sorting: false },
      {
        id: 'reserved-balance',
        label: t('col-reserved-balance'),
        sorting: false,
      },
    ],
    [t],
  )

  return (
    <>
      <Table>
        <TableHead darker cols={cols} />
        <TableBody>
          {resourcePacksHistory?.history.map((historyItem, index) => (
            <TableRow
              key={historyItem.id}
              sx={{ backgroundColor: 'white', height: 70 }}
              data-index={index}
            >
              <TableCell>
                {_t('dates.defaultShort', {
                  date: historyItem.created_at,
                })}
              </TableCell>
              <TableCell>
                <ResourcePacksEventCol event={historyItem} />
              </TableCell>
              <TableCell>
                {t(`event.${historyItem.resourcePacksType}`)}
              </TableCell>
              <TableCell>
                <Typography
                  fontWeight={historyItem.change > 0 ? 500 : 'inherit'}
                  color={
                    historyItem.change < 0 ? theme.palette.grey[700] : 'body1'
                  }
                >
                  {historyItem.change > 0 ? '+' : ''}
                  {historyItem.change}
                </Typography>
              </TableCell>
              <TableCell>{historyItem.totalBalance}</TableCell>
              <TableCell>{historyItem.reservedBalance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination total={0} />
    </>
  )
})

ResourcePacksHistoryTable.displayName = 'ResourcePacksHistoryTable'
