import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useTablePagination } from '@app/hooks/useTablePagination'
import { useTableSort } from '@app/hooks/useTableSort'
import { useWaitlist } from '@app/hooks/useWaitlist'
import { Course } from '@app/types'

type TabProperties = { course: Course }

export const WaitlistTab = ({ course }: TabProperties) => {
  const { t } = useTranslation()
  const { Pagination, limit, offset } = useTablePagination()
  const sort = useTableSort('createdAt', 'asc')

  const { data, total, isLoading } = useWaitlist({
    courseId: course.id,
    sort,
    limit,
    offset,
  })

  const cols = useMemo(() => {
    const _t = (col: string) => t(`pages.course-details.tabs.waitlist.${col}`)

    return [
      { id: 'givenName', label: _t('name'), sorting: true },
      { id: 'email', label: _t('contact'), sorting: false },
      { id: 'createdAt', label: _t('joined'), sorting: true },
    ]
  }, [t])

  return (
    <>
      <Table data-testid="waitlist-table">
        <TableHead
          cols={cols}
          orderBy={sort.by}
          order={sort.dir}
          onRequestSort={sort.onSort}
        />

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={cols.length}>
                <Stack direction="row" alignItems="center">
                  <CircularProgress size={20} />
                </Stack>
              </TableCell>
            </TableRow>
          ) : null}

          <TableNoRows
            noRecords={!isLoading && data.length === 0}
            filtered={false}
            itemsName={t(
              'pages.course-details.tabs.waitlist.waitlist'
            ).toLowerCase()}
            colSpan={cols.length}
          />

          {data.map(entry => (
            <TableRow key={entry.id} data-testid={`waitlist-entry-${entry.id}`}>
              <TableCell>{`${entry.givenName} ${entry.familyName}`}</TableCell>
              <TableCell>
                <Stack direction="column" alignItems="left">
                  <Typography variant="body1">{entry.email}</Typography>
                  <Typography variant="body2">{entry.phone}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                {t('dates.default', { date: entry.createdAt })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination total={total} />
    </>
  )
}
