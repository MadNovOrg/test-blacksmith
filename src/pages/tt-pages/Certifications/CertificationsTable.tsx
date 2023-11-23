import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CertificateDocument } from '@app/components/CertificatePDF'
import { CertificateStatusChip } from '@app/components/CertificateStatusChip'
import { Grade } from '@app/components/Grade'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { TableNoRows } from '@app/components/Table/TableNoRows'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Level_Enum,
  GetCertificationsQuery,
  Grade_Enum,
} from '@app/generated/graphql'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { CertificateStatus, Profile } from '@app/types'

type CertificationsTableProps = {
  certificates: GetCertificationsQuery['certifications']
  filtered?: boolean
  sorting: Sorting
}

export const CertificationsTable: React.FC<
  React.PropsWithChildren<CertificationsTableProps>
> = ({ certificates, filtered = false, sorting }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { acl } = useAuth()
  const { checkbox, selected, isSelected } = useTableChecks()

  const selectedCertificates = useMemo(
    () => certificates.filter(c => isSelected(c.id)),
    [certificates, isSelected]
  )

  const cols = useMemo(() => {
    const _t = (id: string) => t(`components.certification-list.${id}`)
    return [
      checkbox.headCol(
        certificates.flatMap(c =>
          c.status === CertificateStatus.REVOKED ||
          c.participant?.grade === Grade_Enum.Fail
            ? []
            : [c.id]
        )
      ),
      { id: 'name', label: _t('name'), sorting: true },
      { id: 'certificate', label: _t('certificate') },
      { id: 'course-code', label: _t('course-code') },
      { id: 'status', label: _t('status') },
      { id: 'date-expired', label: _t('date-expired') },
      { id: 'date-obtained', label: _t('date-obtained') },
      { id: 'organisation', label: _t('organisation') },
      { id: 'actions', label: _t('actions') },
    ] as Col[]
  }, [certificates, t, checkbox])

  const downloadCertificates = useCallback(
    async (certificates: GetCertificationsQuery['certifications']) => {
      const tuples: [string, JSX.Element][] = certificates.map(c => [
        `${c.profile?.fullName} - ${c.courseName.replace(':', '') ?? ''}.pdf`,
        <CertificateDocument
          key={c.id}
          participantName={c.profile?.fullName ?? ''}
          courseLevel={c.courseLevel as Course_Level_Enum}
          grade={c.participant?.grade ?? Grade_Enum.Pass}
          certificationNumber={c.number}
          expiryDate={c.expiryDate}
          accreditedBy={c.course?.accreditedBy ?? Accreditors_Enum.Icm}
          blendedLearning={Boolean(c.course?.go1Integration)}
          reaccreditation={Boolean(c.course?.reaccreditation)}
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
      <Grid container justifyContent={'end'} alignItems="center" sx={{ mb: 2 }}>
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
              onClick={() => downloadCertificates(selectedCertificates)}
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
                  certificates.filter(
                    c => c.status !== CertificateStatus.REVOKED
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
              noRecords={!certificates.length}
              filtered={filtered}
              colSpan={cols.length}
              itemsName={t('certifications').toLowerCase()}
            />

            {certificates.map(c => {
              const status = c.status as CertificateStatus
              const isRevoked = c.status === CertificateStatus.REVOKED
              const isOnHold = c.status === CertificateStatus.ON_HOLD
              const isFail = c.participant?.grade === Grade_Enum.Fail
              const statusTooltip =
                isRevoked || isOnHold
                  ? c.participant?.certificateChanges?.[0]?.payload?.note ?? '' // if revoked or on hold, the first changelog has the reason
                  : undefined

              return (
                <TableRow key={c.id} data-testid={`cert-row-${c.id}`}>
                  {checkbox.rowCell(c.id, isRevoked || isFail)}

                  <TableCell data-testid="name">
                    <ProfileAvatar
                      profile={c.profile as Profile}
                      disableLink={Boolean(
                        !acl.canViewProfiles() ||
                          (c.profile?.archived &&
                            !acl.canViewArchivedProfileData())
                      )}
                    />
                  </TableCell>

                  <TableCell data-testid="certificate">
                    <Grade grade={c.participant?.grade ?? Grade_Enum.Pass} />
                    <Typography
                      data-testid="certificate-number"
                      variant="body2"
                      color="grey.700"
                    >
                      {c.number}
                    </Typography>
                  </TableCell>

                  <TableCell data-testid="course-code">
                    <Typography variant="body2" color="grey.700">
                      {c.course?.course_code ?? c.legacyCourseCode}
                    </Typography>
                  </TableCell>

                  <TableCell data-testid="status">
                    <CertificateStatusChip
                      status={isFail ? CertificateStatus.INACTIVE : status}
                      tooltip={statusTooltip}
                    />
                  </TableCell>

                  <TableCell data-testid="date-obtained">
                    {isFail ? null : (
                      <Typography variant="body2" color="grey.700">
                        {t('dates.default', {
                          date: c.certificationDate,
                        })}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell data-testid="date-expired">
                    {isFail ? null : (
                      <Typography variant="body2" color="grey.700">
                        {t('dates.default', {
                          date: c.expiryDate,
                        })}
                      </Typography>
                    )}
                  </TableCell>

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
                        onClick={() => navigate(`/certification/${c.id}`)}
                        data-testid={`view-certificate-${c.id}`}
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
