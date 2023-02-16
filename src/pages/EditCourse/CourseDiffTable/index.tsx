import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody/TableBody'
import TableCell from '@mui/material/TableCell/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow/TableRow'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { CourseDiff } from '../types'

type Props = {
  diff: CourseDiff[]
}

export const CourseDiffTable: React.FC<React.PropsWithChildren<Props>> = ({
  diff,
}) => {
  const { t, _t } = useScopedTranslation(
    'pages.edit-course.review-changes-modal'
  )

  return (
    <Table data-testid="course-diff-table" sx={{ mb: 2 }}>
      <TableHead>
        <TableRow>
          <TableCell>{t('col-property')}</TableCell>
          <TableCell>{t('col-old-value')}</TableCell>
          <TableCell>{t('col-new-value')}</TableCell>
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
                    { date: d.oldValue[1] }
                  )}`
                : d.oldValue}
            </TableCell>
            <TableCell>
              {Array.isArray(d.newValue)
                ? `${_t('dates.longWithTime', { date: d.newValue[0] })} - ${_t(
                    'dates.longWithTime',
                    { date: d.newValue[1] }
                  )}`
                : d.newValue}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
