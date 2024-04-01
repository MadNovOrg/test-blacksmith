import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'

import { Course_Level_Enum } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { getReschedulingTermsFee } from '../../shared'

type Props = {
  startDate: Date
  level: Course_Level_Enum
}

const TERMS = {
  '0-fee': 0,
  '15-fee': 15,
  '25-fee': 25,
} as const

const TRAINER_TERMS = {
  '0-fee-trainer': 0,
  '25-fee-trainer': 25,
  '50-fee-trainer': 50,
} as const

const LEVEL_TERMS: Record<
  Course_Level_Enum,
  typeof TERMS | typeof TRAINER_TERMS
> = {
  [Course_Level_Enum.Level_1]: TERMS,
  [Course_Level_Enum.Level_1Mva]: TERMS,
  [Course_Level_Enum.Level_2]: TERMS,
  [Course_Level_Enum.ThreeDaySafetyResponseTrainer]: TERMS,
  [Course_Level_Enum.Advanced]: TERMS,
  [Course_Level_Enum.IntermediateTrainer]: TRAINER_TERMS,
  [Course_Level_Enum.AdvancedTrainer]: TRAINER_TERMS,
  [Course_Level_Enum.BildRegular]: TERMS,
  [Course_Level_Enum.BildAdvancedTrainer]: TERMS,
  [Course_Level_Enum.BildIntermediateTrainer]: TERMS,
}

export const ReschedulingTermsTable: React.FC<
  React.PropsWithChildren<Props>
> = ({ startDate, level }) => {
  const { t } = useScopedTranslation('pages.edit-course.review-changes-modal')

  const applicableFee = getReschedulingTermsFee(startDate, level)
  const termsToUse = LEVEL_TERMS[level]

  return (
    <Table data-testid="rescheduling-terms-table">
      <TableHead>
        <TableRow>
          <TableCell>{t('col-start-date')}</TableCell>
          <TableCell>{t('col-fee')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(termsToUse).map(k => {
          const fee = termsToUse[k as keyof typeof termsToUse]
          const highlighted = fee === applicableFee

          return (
            <TableRow
              key={k}
              data-testid={`fee-row-${k}`}
              data-highlighted={highlighted}
            >
              <TableCell sx={{ fontWeight: highlighted ? 700 : 500 }}>
                {t(`${k}-label`)}
              </TableCell>
              <TableCell sx={{ fontWeight: highlighted ? 700 : 500 }}>
                {t(k)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
