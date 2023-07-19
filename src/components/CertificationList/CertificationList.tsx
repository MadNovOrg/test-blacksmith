import {
  Box,
  Button,
  Grid,
  Link,
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
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CertificateDocument } from '@app/components/CertificatePDF'
import { Grade } from '@app/components/Grade'
import { LinkToProfile } from '@app/components/LinkToProfile'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { useAuth } from '@app/context/auth'
import { Grade_Enum } from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { CertificateStatus, CourseLevel, CourseParticipant } from '@app/types'

import { CertificateStatusChip } from '../CertificateStatusChip'
import { TableNoRows } from '../Table/TableNoRows'

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

  const selectedParticipants = useMemo(
    () => participants.filter(p => isSelected(p.id)),
    [participants, isSelected]
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
        participants.flatMap(p =>
          p.certificate?.status === CertificateStatus.REVOKED ? [] : [p.id]
        )
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
  }, [participants, t, checkbox, showCol])

  const downloadCertificates = useCallback(
    async (participants: CourseParticipant[]) => {
      const tuples: [string, JSX.Element][] = participants.map(p => [
        `${p.profile?.fullName} - ${p.certificate?.courseName ?? ''}.pdf`,
        <CertificateDocument
          key={p.id}
          participantName={p.profile?.fullName}
          courseLevel={p.certificate?.courseLevel ?? CourseLevel.Level_1}
          grade={p.grade ?? Grade_Enum.Pass}
          certificationNumber={p.certificate?.number ?? ''}
          expiryDate={p.certificate?.expiryDate ?? ''}
          accreditedBy={p.course.accreditedBy}
          blendedLearning={p.course.go1Integration}
          bildStrategies={p.course.bildStrategies}
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
    []
  )

  return (
    <>
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
          md={6}
          sm={12}
          display="flex"
          justifyContent="flex-end"
          flexDirection={isMobile ? 'column' : 'row'}
          spacing={2}
        >
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
                  participants.filter(
                    p => p.certificate?.status !== CertificateStatus.REVOKED
                  ) ?? []
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
              noRecords={!participants.length}
              filtered={filtered}
              colSpan={cols.length}
              itemsName={t('certifications').toLowerCase()}
            />

            {participants?.map(p => {
              if (!p.certificate) return null

              const status = p.certificate?.status as CertificateStatus
              const isRevoked =
                p.certificate.status === CertificateStatus.REVOKED
              const isOnHold =
                p.certificate.status === CertificateStatus.ON_HOLD
              const statusTooltip =
                isRevoked || isOnHold
                  ? p.certificateChanges?.[0]?.payload?.note ?? '' // if revoked or on hold, the first changelog has the reason
                  : undefined

              return (
                <TableRow
                  key={p.id}
                  data-testid={`cert-row-${p.id}`}
                  sx={
                    isRevoked
                      ? { bgcolor: theme => theme.colors.red[50] }
                      : undefined
                  }
                >
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
                      <Link
                        href={`/organisations/${p.course?.organization?.id}`}
                      >
                        {p.course?.organization?.name}
                      </Link>
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
