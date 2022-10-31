import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { getReschedulingTermsFee } from '../../utils'

type Props = {
  startDate: Date
}

const TERMS = {
  '0-fee': 0,
  '15-fee': 15,
  '25-fee': 25,
}

export const ReschedulingTermsTable: React.FC<Props> = ({ startDate }) => {
  const { t } = useScopedTranslation('pages.edit-course.review-changes-modal')

  const applicableFee = getReschedulingTermsFee(startDate)

  return (
    <Table data-testid="rescheduling-terms-table">
      <TableHead>
        <TableRow>
          <TableCell>{t('col-start-date')}</TableCell>
          <TableCell>{t('col-fee')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(TERMS).map(k => {
          const fee = TERMS[k as keyof typeof TERMS]
          const fontWeight = fee === applicableFee ? 700 : 500

          return (
            <TableRow key={k}>
              <TableCell sx={{ fontWeight }}>{t(`${k}-label`)}</TableCell>
              <TableCell sx={{ fontWeight }}>{t(k)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
