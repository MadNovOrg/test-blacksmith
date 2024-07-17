import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import {
  Grade_Enum,
  Course_Level_Enum,
  CertificateStatus,
} from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { CertificateDocument } from '@app/modules/certifications/components/CertificatePDF'
import { CourseDetailsFilters } from '@app/modules/course/components/CourseForm/CourseDetailsFilters'
import { OrgAndName } from '@app/modules/course/components/CourseForm/CourseDetailsFilters/utils'
import { Grade } from '@app/modules/grading/components/Grade'
import { LinkToProfile } from '@app/modules/profile/components/LinkToProfile'
import { ProfileAvatar } from '@app/modules/profile/components/ProfileAvatar'
import { CourseParticipant } from '@app/types'

import { CertificateStatusChip } from '../CertificateStatusChip'

export type CertificationListColumns = (
  | 'name'
  | 'contact'
  | 'organisation'
  | 'grade'
  | 'status'
  | 'date-obtained'
  | 'date-expired'
  | 'certificate'
  | 'course-code'
)[]

type CertificationListProps = {
  courseId?: number
  participants: CourseParticipant[]
  filtered?: boolean
  sorting: Sorting
  hideTitle?: boolean
  columns?: CertificationListColumns
}

export const CertificationList: React.FC<
  React.PropsWithChildren<CertificationListProps>
> = ({
  participants,
  filtered = false,
  sorting,
  hideTitle,
  columns = ['name', 'contact', 'organisation', 'grade', 'status'],
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { acl } = useAuth()
  const { checkbox, selected, isSelected } = useTableChecks()

  const [keywordArray, setKeywordArray] = useState<string[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<string>()

  const handleWhereConditionChange = (
    whereCondition: Record<string, object>,
  ) => {
    const condition = whereCondition.condition as OrgAndName
    setSelectedOrganization(condition?.selectedOrganization)
    setKeywordArray(condition?.keywordArray)
  }

  const filteredPatricipants = useMemo(() => {
    let courseParticipants = participants

    if (selectedOrganization && selectedOrganization !== '') {
      courseParticipants = participants?.filter(cp =>
        cp.profile.organizations.some(
          org => org.organization.name === selectedOrganization,
        ),
      )
    }

    if (keywordArray?.length && keywordArray[0] !== '') {
      courseParticipants = courseParticipants?.filter(cp => {
        const userInfo = [cp.profile.fullName, cp.profile.email]
          .join(' ')
          .toLocaleLowerCase()
        return keywordArray.every(keyword => userInfo.includes(keyword))
      })
    }
    return courseParticipants
  }, [keywordArray, participants, selectedOrganization])

  const selectedParticipants = useMemo(
    () => filteredPatricipants.filter(p => isSelected(p.id)),
    [filteredPatricipants, isSelected],
  )

  const colsToShow: Set<string> = useMemo(() => new Set(columns), [columns])
  const showCol = useCallback((id: string) => colsToShow.has(id), [colsToShow])

  const cols = useMemo(() => {
    const _t = (id: string) => t(`components.certification-list.${id}`)
    const col = (id: string, extra?: Partial<Col>, check = true) => {
      return !check || showCol(id) ? [{ id: id, label: _t(id), ...extra }] : []
    }

    return [
      checkbox.headCol(
        filteredPatricipants.flatMap(p =>
          p.certificate?.status === CertificateStatus.Revoked ? [] : [p.id],
        ),
      ),
      ...col('name', { sorting: true }),
      ...col('contact', { sorting: true }),
      ...col('organisation'),
      ...col('grade'),
      ...col('certificate'),
      ...col('course-code'),
      ...col('status'),
      ...col('date-obtained'),
      ...col('date-expired'),
      ...col('actions', {}, false),
    ] as Col[]
  }, [filteredPatricipants, t, checkbox, showCol])

  const downloadCertificates = useCallback(
    async (filteredPatricipants: CourseParticipant[]) => {
      const tuples: [string, JSX.Element][] = filteredPatricipants.map(p => [
        `${p.profile?.fullName} - ${
          p.certificate?.courseName.replace(':', '') ?? ''
        }.pdf`,
        <CertificateDocument
          key={p.id}
          participantName={p.profile?.fullName}
          courseLevel={p.certificate?.courseLevel ?? Course_Level_Enum.Level_1}
          grade={p.grade ?? Grade_Enum.Pass}
          certificationNumber={p.certificate?.number ?? ''}
          expiryDate={p.certificate?.expiryDate ?? ''}
          accreditedBy={p.course.accreditedBy}
          blendedLearning={p.course.go1Integration}
          reaccreditation={p.course.reaccreditation}
        />,
      ])
      if (tuples.length > 1) {
        const zip = new JSZip()
        for (const [fileName, document] of tuples) {
          zip.file(fileName, pdf(document).toBlob())
        }
        const blob = await zip.generateAsync({ type: 'blob' })
        saveAs(blob, `export_${new Date().toISOString()}.zip`)
      } else if (tuples.length > 0) {
        const [fileName, document] = tuples[0]
        saveAs(await pdf(document).toBlob(), fileName)
      }
    },
    [],
  )

  return (
    <>
      <Helmet>
        <title>{t('pages.browser-tab-titles.users.certifications')}</title>
      </Helmet>
      <Grid
        container
        justifyContent={hideTitle ? 'end' : 'space-between'}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {!hideTitle ? (
          <Typography variant="subtitle1" color="grey.800">
            {t('components.certification-list.title')}
          </Typography>
        ) : null}

        <Grid
          item
          container
          md={12}
          sm={12}
          display="flex"
          justifyContent="flex-end"
          flexDirection={isMobile ? 'column' : 'row'}
          spacing={2}
        >
          <Grid item md={12} sx={{ marginTop: '15px' }}>
            <CourseDetailsFilters
              courseId={participants[0]?.course?.id}
              handleWhereConditionChange={handleWhereConditionChange}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              data-testid="download-selected-certifications"
              disabled={selected.size === 0}
              fullWidth={isMobile}
              onClick={() => downloadCertificates(selectedParticipants)}
            >
              {t('components.certification-list.download-selected', {
                number: selected.size,
              })}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              data-testid="download-all-certifications"
              color="primary"
              fullWidth={isMobile}
              onClick={() => {
                downloadCertificates(
                  filteredPatricipants.filter(
                    p => p.certificate?.status !== CertificateStatus.Revoked,
                  ) ?? [],
                )
              }}
            >
              {t('components.certification-list.download-all-certifications')}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid sx={{ overflowX: 'auto' }}>
        <Table data-testid="certification-table">
          <TableHead
            cols={cols}
            orderBy={sorting.by}
            order={sorting.dir}
            onRequestSort={sorting.onSort}
          ></TableHead>
          <TableBody data-testid={'table-body'}>
            <TableNoRows
              noRecords={!filteredPatricipants.length}
              filtered={filtered}
              colSpan={cols.length}
              itemsName={t('certifications').toLowerCase()}
            />

            {filteredPatricipants?.map(p => {
              if (!p.certificate) return null

              const status = p.certificate?.status
              const isRevoked =
                p.certificate.status === CertificateStatus.Revoked
              const isOnHold = p.certificate.status === CertificateStatus.OnHold
              const statusTooltip =
                isRevoked || isOnHold
                  ? p.certificateChanges?.[0]?.payload?.note ?? '' // if revoked or on hold, the first changelog has the reason
                  : undefined

              return (
                <TableRow key={p.id} data-testid={`cert-row-${p.id}`}>
                  {checkbox.rowCell(p.id, isRevoked)}

                  {showCol('name') ? (
                    <TableCell data-testid="name">
                      <ProfileAvatar
                        profile={p.profile}
                        disableLink={
                          !acl.canViewProfiles() ||
                          (p.profile.archived &&
                            !acl.canViewArchivedProfileData())
                        }
                      />
                    </TableCell>
                  ) : null}

                  {showCol('contact') ? (
                    <TableCell data-testid="contact">
                      <LinkToProfile
                        profileId={p.profile.id}
                        isProfileArchived={p.profile.archived}
                      >
                        {p.profile.email}
                        {p.profile.contactDetails.map(contact => contact.value)}
                      </LinkToProfile>
                    </TableCell>
                  ) : null}

                  {showCol('organisation') ? (
                    <TableCell data-testid="organisation">
                      <Box display={'flex'} flexDirection={'column'}>
                        {p.profile.organizations.map(o => {
                          return (
                            <Typography key={o.organization.id}>
                              {o.organization.name}
                            </Typography>
                          )
                        })}
                      </Box>
                    </TableCell>
                  ) : null}

                  {showCol('grade') ? (
                    <TableCell data-testid="grade">
                      <Box display="flex" alignItems="flex-start">
                        {p.grade ? <Grade grade={p.grade} /> : null}
                      </Box>
                    </TableCell>
                  ) : null}

                  {showCol('certificate') ? (
                    <TableCell data-testid="certificate">
                      {p.grade ? (
                        <>
                          <Grade grade={p.grade} />
                          <Typography
                            data-testid="certificate-number"
                            variant="body2"
                            color="grey.700"
                          >
                            {p.certificate.number}
                          </Typography>
                        </>
                      ) : null}
                    </TableCell>
                  ) : null}

                  {showCol('course-code') ? (
                    <TableCell data-testid="course-code">
                      <Typography variant="body2" color="grey.700">
                        {p.course?.course_code}
                      </Typography>
                    </TableCell>
                  ) : null}

                  {showCol('status') ? (
                    <TableCell data-testid="status">
                      <CertificateStatusChip
                        status={status}
                        tooltip={statusTooltip}
                      />
                    </TableCell>
                  ) : null}

                  {showCol('date-obtained') ? (
                    <TableCell data-testid="date-obtained">
                      <Typography variant="body2" color="grey.700">
                        {t('dates.default', {
                          date: p.certificate.certificationDate,
                        })}
                      </Typography>
                    </TableCell>
                  ) : null}

                  {showCol('date-expired') ? (
                    <TableCell data-testid="date-expired">
                      <Typography variant="body2" color="grey.700">
                        {t('dates.default', {
                          date: p.certificate.expiryDate,
                        })}
                      </Typography>
                    </TableCell>
                  ) : null}

                  <TableCell sx={{ width: 0 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ whiteSpace: 'nowrap' }}
                        onClick={() =>
                          navigate(`/certification/${p.certificate?.id}`)
                        }
                        data-testid={`view-certificate-${p.course?.id}`}
                        disabled={isRevoked && !acl.canViewRevokedCert()}
                      >
                        {t('components.certification-list.view-certificate')}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Grid>
    </>
  )
}
