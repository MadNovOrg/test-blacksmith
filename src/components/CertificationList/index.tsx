import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
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
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CertificateDocument } from '@app/components/CertificatePDF'
import { Grade } from '@app/components/Grade'
import { TableHead } from '@app/components/Table/TableHead'
import {
  CourseLevel,
  CourseParticipant,
  Grade as GradeEnum,
  SortOrder,
} from '@app/types'

type CertificationListProps = {
  participants: CourseParticipant[]
  sortingOptions: {
    onSort: (columnName: string) => void
    order: SortOrder
    orderBy: string
  }
  hideTitle?: boolean
  columns?: (
    | 'name'
    | 'contact'
    | 'organization'
    | 'grade'
    | 'status'
    | 'certificate'
  )[]
}

export const CertificationList: React.FC<CertificationListProps> = ({
  participants,
  sortingOptions,
  hideTitle,
  columns = ['name', 'contact', 'organization', 'grade'],
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [selectedParticipants, setSelectedParticipants] = useState<
    CourseParticipant[]
  >([])

  const cols = useMemo(() => {
    return [
      {
        id: 'selection',
        label: '',
        sorting: false,
        component: (
          <Checkbox
            checked={selectedParticipants.length > 0}
            onChange={event => {
              setSelectedParticipants(() =>
                event.target.checked ? participants ?? [] : []
              )
            }}
          />
        ),
      },
      columns.includes('name')
        ? {
            id: 'name',
            label: t('components.certification-list.name'),
            sorting: true,
          }
        : null,
      columns.includes('contact')
        ? {
            id: 'contact',
            label: t('components.certification-list.contact'),
            sorting: true,
          }
        : null,
      columns.includes('organization')
        ? {
            id: 'organisation',
            label: t('pages.course-participants.organisation'),
            sorting: false,
          }
        : null,
      columns.includes('grade')
        ? {
            id: 'grade',
            label: t('components.certification-list.grade'),
            sorting: false,
          }
        : null,
      columns.includes('certificate')
        ? {
            id: 'certificate',
            label: t('components.certification-list.certificate'),
            sorting: false,
          }
        : null,
      columns.includes('status')
        ? {
            id: 'status',
            label: t('components.certification-list.status'),
            sorting: false,
          }
        : null,
      {
        id: 'actions',
        label: t('components.certification-list.certificate'),
        sorting: false,
      },
    ].filter(Boolean)
  }, [columns, participants, selectedParticipants, t])

  const handleParticipantSelection = useCallback((participantId, checked) => {
    setSelectedParticipants(prevState =>
      checked
        ? [...prevState, participantId]
        : prevState.filter(id => id !== participantId)
    )
  }, [])

  const downloadCertificates = useCallback(
    async (participants: CourseParticipant[]) => {
      const tuples: [string, JSX.Element][] = participants.map(participant => [
        `${participant.profile?.fullName} - ${
          participant.certificate?.courseName ?? ''
        }.pdf`,
        <CertificateDocument
          key={participant.id}
          participantName={participant.profile?.fullName}
          courseName={participant.certificate?.courseName ?? ''}
          courseLevel={
            participant.certificate?.courseLevel ?? CourseLevel.LEVEL_1
          }
          grade={participant.grade ?? GradeEnum.PASS}
          courseDeliveryType={participant.course.deliveryType}
          certificationNumber={participant.certificate?.number ?? ''}
          expiryDate={participant.certificate?.expiryDate ?? ''}
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

  const certificateExpired = (expiryDate: string) =>
    isPast(new Date(expiryDate))

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

        <Box>
          <Button
            variant="outlined"
            color="primary"
            disabled={selectedParticipants.length === 0}
            onClick={() => downloadCertificates(selectedParticipants)}
          >
            {t('components.certification-list.download-selected', {
              number: selectedParticipants.length,
            })}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => downloadCertificates(participants ?? [])}
          >
            {t('components.certification-list.download-all-certifications')}
          </Button>
        </Box>
      </Grid>

      <Table>
        <TableHead
          cols={cols}
          order={sortingOptions.order}
          orderBy={sortingOptions.orderBy}
          onRequestSort={sortingOptions.onSort}
          sx={{
            '& .MuiTableRow-root': {
              backgroundColor: 'grey.300',
            },
          }}
        />
        <TableBody>
          {participants?.map(courseParticipant => {
            const expired =
              courseParticipant.certificate &&
              certificateExpired(courseParticipant.certificate?.expiryDate)
            return (
              <TableRow
                key={courseParticipant.id}
                data-testid={`attending-participant-row-${courseParticipant.id}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedParticipants.includes(courseParticipant)}
                    onChange={event =>
                      handleParticipantSelection(
                        courseParticipant,
                        event.target.checked
                      )
                    }
                  />
                </TableCell>
                {columns.includes('name') ? (
                  <TableCell>{courseParticipant.profile.fullName}</TableCell>
                ) : null}
                {columns.includes('contact') ? (
                  <TableCell>
                    {courseParticipant.profile.email}
                    {courseParticipant.profile.contactDetails.map(
                      contact => contact.value
                    )}
                  </TableCell>
                ) : null}
                {columns.includes('organization') ? (
                  <TableCell>
                    {courseParticipant.profile.organizations.map(org => (
                      <Typography key={org.organization.id}>
                        {org.organization.name}
                      </Typography>
                    ))}
                  </TableCell>
                ) : null}
                {columns.includes('grade') ? (
                  <TableCell>
                    <Box display="flex" mb={2} alignItems="center">
                      {courseParticipant.grade ? (
                        <Grade grade={courseParticipant.grade} />
                      ) : null}
                    </Box>
                  </TableCell>
                ) : null}
                {columns.includes('certificate') ? (
                  <TableCell>
                    {courseParticipant.grade ? (
                      <Grid
                        container
                        direction="column"
                        mb={2}
                        alignItems="start"
                      >
                        <Grade grade={courseParticipant.grade} />
                        <Typography mt={1} variant="body2" color="grey.700">
                          {courseParticipant.certificate?.number}
                        </Typography>
                      </Grid>
                    ) : null}
                  </TableCell>
                ) : null}
                {columns.includes('status') ? (
                  <TableCell>
                    {courseParticipant.certificate ? (
                      <Grid
                        container
                        direction="column"
                        mb={2}
                        alignItems="start"
                      >
                        <Chip
                          label={
                            expired
                              ? t(
                                  `components.certification-list.statuses.expired`
                                )
                              : t(
                                  `components.certification-list.statuses.active`
                                )
                          }
                          color={expired ? 'error' : 'success'}
                          size="small"
                        />
                        <Typography mt={1} variant="body2" color="grey.700">
                          {expired
                            ? `${formatDistanceToNow(
                                new Date(
                                  courseParticipant.certificate.expiryDate
                                )
                              )} ${t('common.ago')}`
                            : courseParticipant.certificate.expiryDate}
                        </Typography>
                      </Grid>
                    ) : null}
                  </TableCell>
                ) : null}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2 }}
                    onClick={() =>
                      navigate(
                        `/certification/${courseParticipant.certificate?.id}`
                      )
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
