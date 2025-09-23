import { SxProps } from '@mui/material'
import Box from '@mui/material/Box'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import MuiTableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import React, { useCallback } from 'react'

import theme from '@app/theme'
import { SortOrder } from '@app/types'
import { noop } from '@app/util'

export type Col = {
  id: string
  label?: string
  align?: TableCellProps['align']
  sortBy?: string
  sorting?: boolean
  component?: React.ReactNode
}

export type TableHeadProps = {
  cols: Col[]
  order?: SortOrder
  orderBy?: string
  onRequestSort?: (_: string) => void
  sx?: SxProps
  darker?: boolean
}

export const TableHead: React.FC<React.PropsWithChildren<TableHeadProps>> = ({
  cols,
  order = 'asc',
  orderBy = '',
  onRequestSort = noop,
  darker = false,
  sx,
}) => {
  const createSortHandler = useCallback(
    (col: Col) => () => onRequestSort(col.id),
    [onRequestSort],
  )

  return (
    <MuiTableHead
      sx={{
        ...sx,
        ...(darker && {
          '.MuiTableRow-root': {
            backgroundColor: 'grey.300',
          },
          '&& .MuiTableCell-root': {
            color: theme.palette.secondaryGrey.main,
            fontWeight: 'bold',
          },
        }),
      }}
      data-testid={'table-head'}
    >
      <TableRow>
        {cols.map(col => {
          const isCheckbox = col.id === 'selection'
          const canSort = !isCheckbox && col.sorting

          return (
            <TableCell
              key={col.id}
              sortDirection={orderBy === col.id ? order : false}
              padding={isCheckbox ? 'checkbox' : 'normal'}
              align={col.align ?? 'left'}
            >
              {col.component}
              {canSort ? (
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={createSortHandler(col)}
                  sx={{ fontWeight: 'bold' }}
                >
                  {col.label ?? ''}
                  {orderBy === col.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                <span style={{ fontWeight: 'bold' }}>{col.label ?? ''}</span>
              )}
            </TableCell>
          )
        })}
      </TableRow>
    </MuiTableHead>
  )
}
