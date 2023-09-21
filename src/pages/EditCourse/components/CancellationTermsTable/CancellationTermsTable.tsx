import {
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { getCancellationTermsFee } from '@app/pages/EditCourse/shared'

export const TERMS = {
  'eight-weeks-plus': 0,
  'four-to-eight-weeks': 25,
  'two-to-four-weeks': 50,
  'one-to-two-weeks': 75,
  'less-than-week': 100,
}

export type CancellationTermsTableProps = {
  courseStartDate: Date
  sx?: SxProps
}

export const CancellationTermsTable: React.FC<
  React.PropsWithChildren<CancellationTermsTableProps>
> = ({ courseStartDate, sx }) => {
  const { t } = useTranslation()

  const applicableFee = getCancellationTermsFee(courseStartDate)

  return (
    <Table data-testid="cancellation-terms-table" sx={sx}>
      <TableHead sx={{ bgColor: 'grey.200' }}>
        <TableRow>
          <TableCell>
            <Typography variant="caption" color="grey.700">
              {t(
                'pages.edit-course.cancellation-modal.before-course-start-date'
              )}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="caption" color="grey.700">
              {t('pages.edit-course.cancellation-modal.cancellation-fee')}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(TERMS).map(k => {
          const fee = TERMS[k as keyof typeof TERMS]
          const fontWeight = fee === applicableFee ? 700 : 500
          return (
            <TableRow key={k}>
              <TableCell>
                <Typography
                  variant="body2"
                  color="grey.700"
                  fontWeight={fontWeight}
                >
                  {t(`pages.edit-course.cancellation-modal.terms.${k}`)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="grey.700"
                  fontWeight={fontWeight}
                >
                  {fee === 0
                    ? t(`pages.edit-course.cancellation-modal.terms.no-fee`)
                    : t(
                        `pages.edit-course.cancellation-modal.terms.percent-of-payment-due`,
                        { percent: fee }
                      )}
                </Typography>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
