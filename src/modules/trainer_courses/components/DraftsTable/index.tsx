import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody/TableBody'
import TableCell, { TableCellProps } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { GetCourseDraftsQuery } from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { Profile } from '@app/types'

type Props = {
  drafts: TableDraft[]
  sorting?: ReturnType<typeof useTableSort>
  isFiltered?: boolean
  loading?: boolean
  hiddenColumns?: Set<Cols>
}

export const DraftsTable: React.FC<React.PropsWithChildren<Props>> = ({
  drafts,
  sorting,
  isFiltered = false,
  loading = false,
  hiddenColumns = new Set<Cols>(),
  ...props
}) => {
  const { t } = useTranslation()

  const cols = useMemo(() => {
    const columns: ColHead[] = [
      { id: 'name', label: t('pages.draft-courses.col-name'), sorting: true },
      {
        id: 'venue',
        label: t('pages.draft-courses.col-venue'),
        sorting: false,
      },
      {
        id: 'courseType',
        label: t('pages.draft-courses.col-type'),
        sorting: true,
      },
      {
        id: 'start',
        label: t('pages.draft-courses.col-start'),
        sorting: false,
      },
      { id: 'end', label: t('pages.draft-courses.col-end'), sorting: false },
      {
        id: 'createdAt',
        label: t('pages.draft-courses.col-created-at'),
        sorting: true,
      },
      {
        id: 'createdBy',
        label: t('pages.draft-courses.col-created-by'),
      },
    ]

    return columns.filter(col => !hiddenColumns.has(col.id))
  }, [t, hiddenColumns])

  return (
    <Table {...props}>
      <TableHead
        cols={cols}
        order={sorting?.dir}
        orderBy={sorting?.by}
        onRequestSort={sorting?.onSort}
      />
      <TableBody>
        <TableNoRows
          noRecords={!loading && !drafts.length}
          filtered={isFiltered}
          colSpan={cols.length}
          itemsName={t('drafts').toLowerCase()}
        />

        {drafts.map((d, index) => {
          return (
            <TableRow
              key={d.id}
              className="DraftsRow"
              data-testid={`draft-course-row-${d.id}`}
              data-index={index}
            >
              {!hiddenColumns.has('name') ? (
                <NameCell id={d.id} name={d.name} />
              ) : null}
              {!hiddenColumns.has('venue') ? (
                <VenueCell venue={d.draft.courseData.venue} />
              ) : null}
              {!hiddenColumns.has('courseType') ? (
                <TypeCell draft={d.draft.courseData} />
              ) : null}
              {!hiddenColumns.has('start') ? (
                <DateCell date={d.draft.courseData.startDateTime} />
              ) : null}
              {!hiddenColumns.has('end') ? (
                <DateCell date={d.draft.courseData.endDateTime} />
              ) : null}
              {!hiddenColumns.has('createdAt') ? (
                <DateCell date={d.createdAt} />
              ) : null}
              {!hiddenColumns.has('createdBy') ? (
                <CreatedByCell profile={d.profile} />
              ) : null}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function NameCell({ id, name }: { id: string; name: string }) {
  return (
    <TableCell>
      <Link href={`${id}`}>
        <Typography variant="body1">{name}</Typography>
      </Link>
    </TableCell>
  )
}

export function VenueCell({
  venue,
}: {
  venue: { id: string; name: string; city: string }
}) {
  return (
    <TableCell>
      <Typography mb={1}>{venue?.name}</Typography>
      <Typography variant="body2">
        {!venue?.id ? 'Online' : venue?.city}
      </Typography>
    </TableCell>
  )
}

function TypeCell({ draft }: { draft: TableDraft }) {
  const { t } = useTranslation()
  const { go1Integration, type } = draft

  return (
    <TableCell>
      <Typography
        variant="body2"
        sx={{ color: 'inherit' }}
        gutterBottom={go1Integration}
      >
        {t(`course-types.${type}`)}
      </Typography>
      {go1Integration ? (
        <Typography variant="body2" color="grey.600">
          {t('common.blended-learning')}
        </Typography>
      ) : (
        ''
      )}
    </TableCell>
  )
}
export function DateCell({ date }: { date: Date }) {
  const { t } = useTranslation()

  return (
    <TableCell>
      {date && (
        <Box>
          <Typography variant="body2" gutterBottom>
            {t('dates.defaultShort', {
              date: date,
            })}
          </Typography>
          <Typography variant="body2" whiteSpace="nowrap">
            {t('dates.time', {
              date: date,
            })}
          </Typography>
        </Box>
      )}
    </TableCell>
  )
}

export function CreatedByCell({
  profile,
}: {
  profile: Pick<Profile, 'givenName' | 'familyName'>
}) {
  return (
    <TableCell>
      {profile && (
        <Box>
          <Typography variant="body2">
            {profile.givenName} {profile.familyName}
          </Typography>
        </Box>
      )}
    </TableCell>
  )
}

export type Cols =
  | 'name'
  | 'venue'
  | 'courseType'
  | 'start'
  | 'end'
  | 'createdAt'
  | 'createdBy'

export type ColHead = {
  id: Cols
  label: string
  sorting?: boolean
  align?: TableCellProps['align']
}

export type TableDraft = GetCourseDraftsQuery['course_draft'][0]['data']
