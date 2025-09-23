import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import Link from '@mui/material/Link'
import { uniqBy } from 'lodash'
import { sortBy } from 'lodash-es'
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import {
  Certificate_Status_Enum,
  Course_Level_Enum,
  GetProfilesWithUpcomingEnrollmentsQuery,
} from '@app/generated/graphql'
import { useTableSort } from '@app/hooks/useTableSort'
import { CertificateStatusChip } from '@app/modules/certifications/components/CertificateStatusChip'
import theme from '@app/theme'
import { ALL_ORGS } from '@app/util'

import { useOrganisationProfilesByCertificateLevel } from '../../../hooks/useOrganisationProfielsByCertificateLevel/useOrganisationProfielsByCertificateLevel'
import { useProfilesWithOrganisations } from '../../../hooks/useProfilesWithOrganisations/useProfilesWithOrganisations'
import { useProfilesWithUpcomingEnrollments } from '../../../hooks/useProfilesWithUpcomingEnrollments/useProfilesWithUpcomingEnrollments'

type IndividualsByLevelListParams = {
  orgId: string
  courseLevel: Course_Level_Enum | null
}
const PER_PAGE = 5
const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20]

export const IndividualsByLevelList: React.FC<
  React.PropsWithChildren<IndividualsByLevelListParams>
> = ({ orgId, courseLevel }) => {
  const { t } = useTranslation()

  const { profilesByLevel } = useOrganisationProfilesByCertificateLevel()

  const sorting = useTableSort('fullName', 'asc')
  const [currentPage, setCurrentPage] = useState(0)
  const [perPage, setPerPage] = useState(PER_PAGE)

  const currentPageUsers = useMemo(() => {
    const profiles = profilesByLevel.get(courseLevel) ?? []
    let sorted
    if (sorting.by === 'fullName') {
      sorted = sortBy(profiles, p => p.fullName)
    } else {
      sorted = sortBy(profiles, p => {
        const cert = p.certificates?.find(c => c?.courseLevel === courseLevel)
        return cert?.expiryDate
      })
    }
    if (sorting.dir === 'desc') sorted = sorted.reverse()
    return sorted.slice(currentPage * perPage, currentPage * perPage + perPage)
  }, [profilesByLevel, courseLevel, sorting, currentPage, perPage])

  const currentPageUsersIds = currentPageUsers.map(p => p.id)

  const { profileWithOrganisations } = useProfilesWithOrganisations({
    ids: currentPageUsersIds,
  })
  const [
    { data: enrollmentsData, fetching: fetchingEnrollments },
    refetchEnrollments,
  ] = useProfilesWithUpcomingEnrollments({
    ids: currentPageUsersIds,
    orgId,
  })

  const handleRowsPerPageChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPerPage(parseInt(event.target.value, 10))
      setCurrentPage(0)
      refetchEnrollments()
    },
    [refetchEnrollments],
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

  const userEnrollments = useMemo(() => {
    const enrollmentsMap = new Map<
      string,
      {
        courses: (
          | GetProfilesWithUpcomingEnrollmentsQuery['profile'][0]['courses'][0]
          | GetProfilesWithUpcomingEnrollmentsQuery['profile'][0]['upcomingEnrollments'][0]
        )[]
      }
    >()
    enrollmentsData?.profile.forEach(profileEnrollments => {
      enrollmentsMap.set(profileEnrollments.id, {
        courses: uniqBy(
          [
            ...profileEnrollments.courses,
            ...profileEnrollments.upcomingEnrollments,
          ],
          'course.id',
        ),
      })
    })
    return enrollmentsMap
  }, [enrollmentsData])

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
            const certification = profile?.certificates
              ?.filter(c => c?.courseLevel === courseLevel)
              ?.sort(
                (a, b) =>
                  +(b?.status === Certificate_Status_Enum.Active) -
                  +(a?.status === Certificate_Status_Enum.Active),
              )[0]

            const certificationStatus =
              certification?.status as Certificate_Status_Enum

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
                    {profileWithOrganisations
                      .get(profile.id)
                      ?.organizations.map(orgMember => (
                        <Box
                          key={orgMember?.id}
                          display="flex"
                          flexDirection="row"
                        >
                          <Typography
                            variant="body2"
                            color={theme.palette.grey[900]}
                          >
                            {orgMember?.organization?.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={theme.palette.grey[600]}
                            ml={1}
                          >
                            {orgMember?.position}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </TableCell>
                {courseLevel ? (
                  <TableCell>
                    <CertificateStatusChip status={certificationStatus} />
                  </TableCell>
                ) : null}
                {courseLevel ? (
                  <TableCell>
                    <Typography variant="body2">
                      {certificationStatus !==
                        Certificate_Status_Enum.Revoked &&
                        t('dates.default', {
                          date: new Date(certification?.expiryDate),
                        })}
                    </Typography>
                  </TableCell>
                ) : null}
                <TableCell>
                  <Box display="flex" flexDirection="column" alignItems="left">
                    {(() => {
                      if (fetchingEnrollments) return <Skeleton width={300} />
                      const enrollments = userEnrollments.get(profile.id)
                      if (!enrollments) return null
                      return enrollments.courses.map(({ course }) => (
                        <Link
                          key={course?.id}
                          variant="body2"
                          href={`/manage-courses/${profile.id}/${course?.id}/details`}
                        >
                          {`${t(
                            `common.certificates.${courseLevel?.toLowerCase()}`,
                          )} ${course?.course_code}`}
                        </Link>
                      ))
                    })()}
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
