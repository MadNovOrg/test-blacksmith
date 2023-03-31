import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Box,
  Button,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CertificateDocument } from '@app/components/CertificatePDF'
import { Grade } from '@app/components/Grade'
import { ProfileAvatar } from '@app/components/ProfileAvatar'
import { Col, TableHead } from '@app/components/Table/TableHead'
import { Course_Delivery_Type_Enum, Grade_Enum } from '@app/generated/graphql'
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
  columns = ['name', 'contact', 'organisation', 'grade'],
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
          courseName={p.certificate?.courseName ?? ''}
          courseLevel={p.certificate?.courseLevel ?? CourseLevel.Level_1}
          grade={p.grade ?? Grade_Enum.Pass}
          courseDeliveryType={
            p.course.deliveryType as unknown as Course_Delivery_Type_Enum
          }
          certificationNumber={p.certificate?.number ?? ''}
          expiryDate={p.certificate?.expiryDate ?? ''}
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

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            data-testid="download-selected-certifications"
            disabled={selected.size === 0}
            onClick={() => downloadCertificates(selectedParticipants)}
          >
            {t('components.certification-list.download-selected', {
              number: selected.size,
            })}
          </Button>

          <Button
            variant="contained"
            data-testid="download-all-certifications"
            color="primary"
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
        </Stack>
      </Grid>

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

            return (
              <TableRow key={p.id}>
                {checkbox.rowCell(
                  p.id,
                  p.certificate.status === CertificateStatus.REVOKED
                )}

                {showCol('name') ? (
                  <TableCell data-testid="name">
                    <ProfileAvatar profile={p.profile} />
                  </TableCell>
                ) : null}

                {showCol('contact') ? (
                  <TableCell data-testid="contact">
                    <Link href={`/profile/${p.profile.id}`}>
                      {p.profile.email}
                      {p.profile.contactDetails.map(contact => contact.value)}
                    </Link>
                  </TableCell>
                ) : null}

                {showCol('organisation') ? (
                  <TableCell data-testid="organisation">
                    <Link href={`/organisations/${p.course.organization?.id}`}>
                      {p.course.organization?.name}
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
                      {p.course.course_code}
                    </Typography>
                  </TableCell>
                ) : null}

                {showCol('status') ? (
                  <TableCell data-testid="status">
                    <CertificateStatusChip status={status} />
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
                    justifyContent="flex-start"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ whiteSpace: 'nowrap' }}
                      onClick={() =>
                        navigate(`/certification/${p.certificate?.id}`)
                      }
                      data-testid="view-certificate"
                    >
                      {t('components.certification-list.view-certificate')}
                    </Button>
                    {status === CertificateStatus.ON_HOLD ? (
                      <WarningAmberIcon color="warning" />
                    ) : null}
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
