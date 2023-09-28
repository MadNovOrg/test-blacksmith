import {
  Box,
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
import { sortBy } from 'lodash-es'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateStatusChip } from '@app/components/CertificateStatusChip'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import useOrg, { ALL_ORGS } from '@app/hooks/useOrg'
import { useTableSort } from '@app/hooks/useTableSort'
import theme from '@app/theme'
import { CertificateStatus, CourseLevel } from '@app/types'

type IndividualsByLevelListParams = {
  orgId: string
  courseLevel: CourseLevel | null
  certificateStatus: CertificateStatus[]
}

const PER_PAGE = 5
const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

export const IndividualsByLevelList: React.FC<
  React.PropsWithChildren<IndividualsByLevelListParams>
> = ({ orgId, courseLevel, certificateStatus }) => {
  const { t } = useTranslation()
  const { profile, acl } = useAuth()

  const sorting = useTableSort('fullName', 'asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const { profilesByLevel, loading } = useOrg(
    orgId,
    profile?.id,
    acl.canViewAllOrganizations(),
    certificateStatus
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
      courseLevel
        ? {
            id: 'expiryDate',
            label: t('common.expiry-date'),
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
          darker
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
            const isRevoked = certificationStatus === CertificateStatus.REVOKED
            const isOnHold = certificationStatus === CertificateStatus.ON_HOLD
            const statusTooltip =
              isRevoked || isOnHold
                ? certification?.participant?.certificateChanges[0]?.payload
                    ?.note
                : undefined

            return (
              <TableRow key={profile.id} sx={{ backgroundColor: 'white' }}>
                <TableCell>
                  <ProfileAvatar
                    profile={profile}
                    link={`/profile/${profile.id}${
                      orgId !== ALL_ORGS ? `?orgId=${orgId}` : ''
                    }`}
                  />
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
                    <CertificateStatusChip
                      status={certificationStatus}
                      tooltip={statusTooltip}
                    />
                  </TableCell>
                ) : null}
                {courseLevel ? (
                  <TableCell>
                    <Typography variant="body2">
                      {certificationStatus !== CertificateStatus.REVOKED &&
                        t('dates.default', {
                          date: new Date(certification?.expiryDate),
                        })}
                    </Typography>
                  </TableCell>
                ) : null}
                <TableCell>
                  <Box display="flex" flexDirection="column" alignItems="left">
                    {profile.upcomingEnrollments.map(enrollment => (
                      <Link
                        key={enrollment.courseId}
                        variant="body2"
                        href={`/courses/${enrollment.courseId}/details`}
                      >
                        {`${t(
                          `common.certificates.${enrollment?.courseLevel?.toLowerCase()}`
                        )} ${enrollment.course?.course_code}`}
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
