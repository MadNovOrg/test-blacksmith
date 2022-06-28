import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  // Typography,
  CircularProgress,
  Stack,
  Box,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { Promo_Code } from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'

type Props = {
  promoCodes: Array<Partial<Promo_Code>>
  sorting: Sorting
  loading: boolean
  filtered: boolean
}

export const List: React.FC<Props> = ({
  promoCodes,
  sorting,
  loading,
  filtered,
}) => {
  const { t } = useTranslation()
  const { checkbox } = useTableChecks()

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.promoCodes.cols-${col}`)
    return [
      checkbox.headCol(promoCodes.map(o => o.id)),
      { id: 'code', label: _t('code') },
      { id: 'type', label: _t('type'), align: 'center' },
      { id: 'amount', label: _t('amount') },
      {
        id: 'createdAt',
        label: _t('createdAt'),
        align: 'center',
        sorting: true,
      },
    ] as Col[]
  }, [t, promoCodes, checkbox])

  return (
    <Table>
      <TableHead
        cols={cols}
        orderBy={sorting.by}
        order={sorting.dir}
        onRequestSort={sorting.onSort}
      />
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={cols.length}>
              <Stack direction="row" alignItems="center">
                <CircularProgress size={20} />
              </Stack>
            </TableCell>
          </TableRow>
        ) : null}

        <TableNoRows
          noRecords={!loading && !promoCodes.length}
          filtered={filtered}
          itemsName={t('promoCodes').toLowerCase()}
          colSpan={cols.length}
        />

        {promoCodes.map(promo => {
          return (
            <TableRow key={promo.id}>
              {checkbox.rowCell(promo.id)}

              <TableCell>{promo.code}</TableCell>

              <TableCell width="140" align="center">
                {t(`pages.promoCodes.type-${promo.type}`)}
              </TableCell>

              <TableCell>{promo.amount}</TableCell>

              <TableCell width="140" align="center">
                {t('dates.default', { date: promo.createdAt })}
                <Box sx={{ fontSize: '.9em' }}>
                  {t('dates.time', { date: promo.createdAt })}
                </Box>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
