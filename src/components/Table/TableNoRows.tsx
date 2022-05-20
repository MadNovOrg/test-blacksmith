import { TableRow, TableCell, Box, Typography } from '@mui/material'
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

  const key = filtered ? 'noMatches' : 'noRecords'
  const opts = {
    itemsName: itemsName ?? t('components.table-no-rows.itemsName'),
  }

  return (
    <TableRow data-testid="TableNoRows">
      <TableCell colSpan={colSpan}>
        <Box sx={{ textAlign: 'center', padding: '5vmax 0' }}>
          <Typography variant="body1" fontWeight="bold">
            {t(`components.table-no-rows.${key}-first`, opts)}
          </Typography>

          {filtered ? (
            <Typography variant="body2" mt={1} data-testid="TableNoRows-second">
              {t(`components.table-no-rows.${key}-second`)}
            </Typography>
          ) : null}
        </Box>
      </TableCell>
    </TableRow>
  )
}
