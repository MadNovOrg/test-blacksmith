import { TableRow, TableCell, Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  noRecords: boolean
  filtered?: boolean
  itemsName?: string
  colSpan?: number
}

export const TableNoRows: React.FC<Props> = ({
  noRecords,
  filtered = false,
  itemsName,
  colSpan = 1,
}) => {
  const { t } = useTranslation()

  if (!noRecords) return null

  return (
    <TableRow data-testid="TableNoRows">
      <TableCell colSpan={colSpan} sx={{ p: 0, backgroundColor: '#fff' }}>
        <Box
          sx={{
            textAlign: 'center',
            padding: '5vmax 0',
            fontSize: '1.8rem',
            fontWeight: '100',
            color: t => t.palette.grey[500],
          }}
        >
          {t('components.table-no-rows.noRecords', {
            itemsName: itemsName ?? t('components.table-no-rows.itemsName'),
          })}

          {filtered ? (
            <Box
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: t => t.palette.grey[600],
              }}
              data-testid="TableNoRows-fixFilters"
            >
              {t('components.table-no-rows.fixFilters')}
            </Box>
          ) : null}
        </Box>
      </TableCell>
    </TableRow>
  )
}
