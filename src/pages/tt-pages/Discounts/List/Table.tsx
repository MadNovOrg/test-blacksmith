import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead, Col } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { GetPromoCodesQuery } from '@app/generated/graphql'
import type { Sorting } from '@app/hooks/useTableSort'

import { Row } from './Row'

type Props = {
  promoCodes: GetPromoCodesQuery['promoCodes']
  sorting: Sorting
  loading: boolean
  filtered: boolean
}

export const DiscountsTable: React.FC<React.PropsWithChildren<Props>> = ({
  promoCodes,
  sorting,
  loading,
  filtered,
}) => {
  const { t } = useTranslation()

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.promoCodes.cols-${col}`)
    return [
      { id: 'code', label: _t('code') },
      { id: 'type', label: _t('type'), align: 'center' },
      { id: 'appliesTo', label: _t('appliesTo') },
      { id: 'start', label: _t('start') },
      { id: 'end', label: _t('end') },
      { id: 'createdBy', label: _t('createdBy') },
      { id: 'status', label: _t('status') },
    ] as Col[]
  }, [t])

  return (
    <>
      <Typography fontWeight="bold">
        {t('pages.promoCodes.list-title-all')}
      </Typography>
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
            itemsName={t('promo-codes').toLowerCase()}
            colSpan={cols.length}
          />

          {promoCodes.map(promo => (
            <Row key={promo.id} promo={promo} />
          ))}
        </TableBody>
      </Table>
    </>
  )
}
