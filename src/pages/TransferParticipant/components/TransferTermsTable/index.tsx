import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'

import { CourseLevel } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { getTransferTermsFee, isTrainTheTrainerCourse } from '../../utils'

type Props = {
  startDate: Date
  courseLevel: CourseLevel
}

export const TERMS = {
  '0-fee': 0,
  '15-fee': 15,
  '25-fee': 25,
} as const

const TRAIN_TRAINER_TERMS = {
  '0-fee-trainer': 0,
  '25-fee-trainer': 25,
  '50-fee-trainer': 50,
}

export const TransferTermsTable: React.FC<React.PropsWithChildren<Props>> = ({
  startDate,
  courseLevel,
}) => {
  const { t } = useScopedTranslation(
    'pages.transfer-participant.transfer-details'
  )

  const applicableFee = getTransferTermsFee(startDate, courseLevel)

  const isTrainTheTrainerLevel = isTrainTheTrainerCourse(courseLevel)

  const termsToUse = isTrainTheTrainerLevel ? TRAIN_TRAINER_TERMS : TERMS

  return (
    <Table data-testid="transfer-terms-table">
      <TableHead>
        <TableRow>
          <TableCell>{t('col-start-date')}</TableCell>
          <TableCell>{t('col-fee')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(termsToUse).map(k => {
          const fee = termsToUse[k as keyof typeof termsToUse]
          const hightlighted = fee === applicableFee
          const fontWeight = hightlighted ? 700 : 500

          return (
            <TableRow
              key={k}
              data-testid={`term-row-${k}`}
              data-highlighted={hightlighted}
            >
              <TableCell sx={{ fontWeight }}>{t(`${k}-label`)}</TableCell>
              <TableCell sx={{ fontWeight }}>{t(k)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
