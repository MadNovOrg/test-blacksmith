import React from 'react'
import MuiTableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'
import { SxProps } from '@mui/material'

import { SortOrder } from '@app/types'

type Col = {
  id: string
  label: string
  sorting?: boolean
}

export type TableHeadProps = {
  cols: Col[]
  order: SortOrder
  orderBy: string
  onRequestSort: (_: string) => void
  sx?: SxProps
}

export const TableHead: React.FC<TableHeadProps> = ({
  cols,
  order,
  orderBy,
  onRequestSort,
  sx,
}) => {
  const createSortHandler = (col: string) => () => onRequestSort(col)

  return (
    <MuiTableHead sx={sx}>
      <TableRow>
        {cols.map(c => (
          <TableCell
            key={c.id}
            sortDirection={orderBy === c.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === c.id}
              direction={orderBy === c.id ? order : 'asc'}
              onClick={createSortHandler(c.id)}
              disabled={c.sorting === false}
            >
              {c.label}
              {orderBy === c.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  )
}
