import { TableRow, TableCell, CircularProgress, TableBody } from '@mui/material'
import { FC, PropsWithChildren } from 'react'

type TableLoadingProps = {
  colSpan?: number
}

export const TableLoading: FC<PropsWithChildren<TableLoadingProps>> = ({
  colSpan,
}) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan}>
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        </TableCell>
      </TableRow>
    </TableBody>
  )
}
