import {
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import Link from '@mui/material/Link'
import { Box } from '@mui/system'
import { formatDistanceToNow } from 'date-fns'
import { sortBy } from 'lodash-es'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@app/components/Avatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import useOrg from '@app/hooks/useOrg'
import { useTableSort } from '@app/hooks/useTableSort'
import theme from '@app/theme'
import { CertificateStatus, CourseLevel } from '@app/types'

type IndividualsByLevelListParams = {
  orgId: string
  courseLevel: CourseLevel | null
}

const PER_PAGE = 5
const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

const certificationStatusColor = {
  [CertificateStatus.EXPIRED_RECENTLY]: 'error',
  [CertificateStatus.EXPIRED]: 'error',
  [CertificateStatus.EXPIRING_SOON]: 'warning',
  [CertificateStatus.ACTIVE]: 'success',
} as const

export const IndividualsByLevelList: React.FC<IndividualsByLevelListParams> = ({
  orgId,
  courseLevel,
}) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()

  const sorting = useTableSort('fullName', 'asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const { profilesByLevel, loading } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations()
  )

  const currentPageUsers = useMemo(() => {
    const profiles = profilesByLevel.get(courseLevel) || []
    let sorted
    if (sorting.by === 'fullName') {
      sorted = sortBy(profiles, p => p.fullName)
    } else {
      sorted = sortBy(profiles, p => {
        const cert = p.certificates.find(c => c.courseLevel === courseLevel)
        return cert?.expiryDate
      })
    }
    if (sorting.dir === 'desc') sorted = sorted.reverse()
    return sorted.slice(currentPage * perPage, currentPage * perPage + perPage)
  }, [profilesByLevel, courseLevel, sorting, currentPage, perPage])

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
    },
    []
  )

  const cols = useMemo(() => {
    return [
      {
        id: 'fullName',
        label: t('common.name'),
        sorting: true,
      },
      {
        id: 'organization',
        label: t('common.organization'),
      },
      courseLevel
        ? {
            id: 'status',
            label: t('common.status'),
            sorting: true,
          }
        : null,
      {
        id: 'enrolled',
        label: t('common.enrolled'),
      },
    ].filter(Boolean) as Col[]
  }, [courseLevel, t])

  if (loading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        data-testid="individuals-fetching"
      >
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <>
      <Table>
        <TableHead
          sx={{
            '.MuiTableRow-root': {
              backgroundColor: 'grey.300',
            },
          }}
          cols={cols}
          orderBy={sorting.by}
          order={sorting.dir}
          onRequestSort={sorting.onSort}
        />
        <TableBody>
          {currentPageUsers.map(profile => {
            const certification = profile.certificates.find(
              c => c.courseLevel === courseLevel
            )
            const certificationStatus =
              certification?.status as CertificateStatus
            return (
              <TableRow key={profile.id} sx={{ backgroundColor: 'white' }}>
                <TableCell>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Avatar size={32} name={profile.fullName ?? ''} />
                    <Link
                      variant="body2"
                      color={theme.palette.grey[900]}
                      ml={1}
                      href={`/profile/${profile.id}?orgId=${orgId}`}
                    >
                      {profile.fullName}
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" alignItems="left">
                    {profile.organizations.map(orgMember => (
                      <Box
                        key={orgMember.id}
                        display="flex"
                        flexDirection="row"
                      >
                        <Typography
                          variant="body2"
                          color={theme.palette.grey[900]}
                        >
                          {orgMember.organization.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={theme.palette.grey[600]}
                          ml={1}
                        >
                          {orgMember.position}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
                {courseLevel ? (
                  <TableCell>
                    <Chip
                      label={t(
                        `common.certification-status.${certificationStatus.toLowerCase()}`
                      )}
                      size="small"
                      color={certificationStatusColor[certificationStatus]}
                    />
                    <Typography variant="body2">
                      {t(
                        certificationStatus ===
                          CertificateStatus.EXPIRED_RECENTLY
                          ? 'common.expired-ago'
                          : 'common.expiring-in',
                        {
                          time: formatDistanceToNow(
                            new Date(certification?.expiryDate)
                          ),
                        }
                      )}
                    </Typography>
                  </TableCell>
                ) : null}
                <TableCell>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    {profile.upcomingEnrollments.map(enrollment => (
                      <Link
                        key={enrollment.courseId}
                        variant="body2"
                        href={`/courses/${enrollment.courseId}/details`}
                      >
                        {`${t(
                          `common.certificates.${enrollment?.courseLevel?.toLowerCase()}`
                        )} ${enrollment.courseId}`}
                      </Link>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={profilesByLevel.get(courseLevel)?.length ?? 0}
        page={currentPage}
        onPageChange={(_, page) => setCurrentPage(page)}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={perPage}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        data-testid="individuals-by-level-pagination"
      />
    </>
  )
}
