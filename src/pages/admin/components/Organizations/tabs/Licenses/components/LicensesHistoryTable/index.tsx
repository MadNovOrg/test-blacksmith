import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'

import { TableHead } from '@app/components/Table/TableHead'
import { Go1_Licenses_History } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'

import { EventTypeCol } from './EventTypeCol'

type Props = {
  items: Omit<Go1_Licenses_History, 'org_id'>[]
}

export const LicensesHistoryTable: React.FC<Props> = ({ items, children }) => {
  const { t, _t } = useScopedTranslation(
    'pages.org-details.tabs.licenses.table'
  )

  const cols = useMemo(
    () => [
      { id: 'date', label: t('col-date'), sorting: false },
      { id: 'event', label: t('col-event'), sorting: false },
      { id: 'change', label: t('col-action'), sorting: false },
      { id: 'balance', label: t('col-balance'), sorting: false },
      {
        id: 'reserved-balance',
        label: t('col-reserved-balance'),
        sorting: false,
      },
    ],
    [t]
  )

  return (
    <Box>
      <Table>
        <TableHead darker cols={cols} />
        <TableBody>
          {items.map((historyItem, index) => (
            <TableRow
              key={historyItem.id}
              sx={{ backgroundColor: 'white', height: 70 }}
              data-index={index}
            >
              <TableCell>
                {_t('dates.defaultShort', {
                  date: historyItem.captured_at,
                })}
              </TableCell>
              <TableCell>
                <EventTypeCol item={historyItem} />
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
              <TableCell>{historyItem.balance}</TableCell>
              <TableCell>{historyItem.reservedBalance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {children}
    </Box>
  )
}
