import InfoIcon from '@mui/icons-material/Info'
import {
  TableBody as MUITableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material'
import { Link } from '@mui/material'
import { PropsWithChildren, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { TableNoRows } from '@app/components/Table/TableNoRows'
import { GetCourseAuditLogsQuery } from '@app/generated/graphql'
import { ProfileWithAvatar } from '@app/modules/profile/components/ProfileWithAvatar'
import { CourseTrainer } from '@app/types'
import { getCourseLeadTrainer } from '@app/util'

import { TableLoading } from '../TableLoading'

type Props = {
  logs: GetCourseAuditLogsQuery['logs']
  loading?: boolean
  colSpan?: number
}

export const TableBody: FC<PropsWithChildren<Props>> = ({
  logs,
  colSpan,
  loading,
}) => {
  const { t } = useTranslation()
  const leadTrainer = (trainers: CourseTrainer[]) => {
    return getCourseLeadTrainer(trainers ?? [])?.profile ?? { id: '' }
  }

  if (loading) return <TableLoading colSpan={colSpan} />

  return (
    <MUITableBody data-testid="course-exceptions-log-table-body">
      <TableNoRows
        noRecords={logs.length === 0}
        filtered={false}
        itemsName={t('common.records').toLowerCase()}
        colSpan={colSpan}
      />
      {logs.map(log => (
        <TableRow key={log.id}>
          <TableCell>
            {t('dates.withTime', {
              date: log.course.start,
            })}
          </TableCell>
          <TableCell sx={{ maxWidth: 150 }}>
            <ProfileWithAvatar
              useLink={true}
              profile={leadTrainer(
                log.course.trainers as unknown as CourseTrainer[]
              )}
            />
          </TableCell>
          {log.course?.organization ? (
            <TableCell>
              <Link href={`/organisations/${log.course.organization.id}`}>
                {log.course.organization.name}
              </Link>
            </TableCell>
          ) : null}
          {log.course?.id ? (
            <TableCell>
              <Link href={`/courses/${log.course.id}/details`}>
                {log.course.course_code}
              </Link>
            </TableCell>
          ) : null}
          <TableCell sx={{ maxWidth: 200 }}>
            <Tooltip data-testid="reason-tooltip" title={log.payload.reason}>
              <InfoIcon />
            </Tooltip>
          </TableCell>
          <TableCell sx={{ maxWidth: 150 }}>
            <ProfileWithAvatar useLink={true} profile={log.authorizedBy} />
          </TableCell>
          <TableCell>
            {t('dates.withTime', {
              date: log.created_at,
            })}
          </TableCell>
        </TableRow>
      ))}
    </MUITableBody>
  )
}
