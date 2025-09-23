import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody/TableBody'
import TableCell from '@mui/material/TableCell/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow/TableRow'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import type { CourseDiff } from '../../utils/shared'

type Props = {
  diff: CourseDiff[]
}

export const CourseDiffTable: React.FC<React.PropsWithChildren<Props>> = ({
  diff,
}) => {
  const { t, _t } = useScopedTranslation(
    'pages.edit-course.review-changes-modal',
  )

  const cells = [t('col-property'), t('col-old-value'), t('col-new-value')]

  return (
    <Table data-testid="course-diff-table" sx={{ mb: 2 }}>
      <TableHead>
        <TableRow>
          {cells.map((cell, index) => (
            <TableCell key={`${cell}+${index}`}>{cell}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {diff.map(d => (
          <TableRow key={d.type}>
            <TableCell>{t(`col-${d.type}-type`)}</TableCell>
            <TableCell
              sx={{ textDecoration: 'line-through', color: 'dimGrey.main' }}
            >
              {Array.isArray(d.oldValue)
                ? `${_t('dates.longWithTime', { date: d.oldValue[0] })} - ${_t(
                    'dates.longWithTime',
                    { date: d.oldValue[1] },
                  )}`
                : d.oldValue}
            </TableCell>
            <TableCell>
              {Array.isArray(d.newValue)
                ? `${_t('dates.longWithTime', { date: d.newValue[0] })} - ${_t(
                    'dates.longWithTime',
                    { date: d.newValue[1] },
                  )}`
                : d.newValue}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
