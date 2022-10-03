import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { formatDistanceToNow, isPast } from 'date-fns'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CertificateDocument } from '@app/components/CertificatePDF'
import { Grade } from '@app/components/Grade'
import { TableHead, Col } from '@app/components/Table/TableHead'
import { useTableChecks } from '@app/hooks/useTableChecks'
import type { Sorting } from '@app/hooks/useTableSort'
import { CourseLevel, CourseParticipant, Grade as GradeEnum } from '@app/types'

import { TableNoRows } from '../Table/TableNoRows'

export type CertificationListColumns = (
  | 'name'
  | 'contact'
  | 'organization'
  | 'grade'
  | 'status'
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

export const CertificationList: React.FC<CertificationListProps> = ({
  participants,
  filtered = false,
  sorting,
  hideTitle,
  columns = ['name', 'contact', 'organization', 'grade'],
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
      checkbox.headCol(participants.map(p => p.id)),
      ...col('name', { sorting: true }),
      ...col('contact', { sorting: true }),
      ...col('organization'),
      ...col('grade'),
      ...col('certificate'),
      ...col('course-code'),
      ...col('status'),
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
          courseLevel={p.certificate?.courseLevel ?? CourseLevel.LEVEL_1}
          grade={p.grade ?? GradeEnum.PASS}
          courseDeliveryType={p.course.deliveryType}
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
            disabled={selected.size === 0}
            onClick={() => downloadCertificates(selectedParticipants)}
          >
            {t('components.certification-list.download-selected', {
              number: selected.size,
            })}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => downloadCertificates(participants ?? [])}
          >
            {t('components.certification-list.download-all-certifications')}
          </Button>
        </Stack>
      </Grid>

      <Table>
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

            const expiryDate = new Date(p.certificate.expiryDate)
            const expired = isPast(expiryDate)
            const status = expired ? 'status-expired' : 'status-active'

            return (
              <TableRow key={p.id}>
                {checkbox.rowCell(p.id)}

                {showCol('name') ? (
                  <TableCell>{p.profile.fullName}</TableCell>
                ) : null}

                {showCol('contact') ? (
                  <TableCell>
                    {p.profile.email}
                    {p.profile.contactDetails.map(contact => contact.value)}
                  </TableCell>
                ) : null}

                {showCol('organisation') ? (
                  <TableCell>
                    {p.profile.organizations.map(org => (
                      <Typography key={org.organization.id}>
                        {org.organization.name}
                      </Typography>
                    ))}
                  </TableCell>
                ) : null}

                {showCol('grade') ? (
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {p.grade ? <Grade grade={p.grade} /> : null}
                    </Box>
                  </TableCell>
                ) : null}

                {showCol('certificate') ? (
                  <TableCell>
                    {p.grade ? (
                      <>
                        <Grade grade={p.grade} />
                        <Typography variant="body2" color="grey.700">
                          {p.certificate.number}
                        </Typography>
                      </>
                    ) : null}
                  </TableCell>
                ) : null}

                {showCol('course-code') ? (
                  <TableCell>
                    <Typography variant="body2" color="grey.700">
                      {p.course.course_code}
                    </Typography>
                  </TableCell>
                ) : null}

                {showCol('status') ? (
                  <TableCell>
                    <Chip
                      label={t(`components.certification-list.${status}`)}
                      color={expired ? 'error' : 'success'}
                      size="small"
                    />
                    <Typography mt={1} variant="body2" color="grey.700">
                      {expired
                        ? `${formatDistanceToNow(expiryDate)} ${t(
                            'common.ago'
                          )}`
                        : t('dates.default', { date: expiryDate })}
                    </Typography>
                  </TableCell>
                ) : null}

                <TableCell sx={{ width: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ whiteSpace: 'nowrap' }}
                    onClick={() =>
                      navigate(`/certification/${p.certificate?.id}`)
                    }
                  >
                    {t('components.certification-list.view-certificate')}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
