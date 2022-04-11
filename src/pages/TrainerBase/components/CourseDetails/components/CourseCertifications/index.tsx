import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Grid,
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
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CertificateDocument } from '@app/components/CertificatePDF'
import { Grade } from '@app/components/Grade'
import { TableHead } from '@app/components/Table/TableHead'
import useCourseParticipants from '@app/hooks/useCourseParticipants'
import {
  Course,
  CourseParticipant,
  SortOrder,
  Grade as GradeEnum,
} from '@app/types'
import { LoadingStatus } from '@app/util'

type CourseCertificationsProps = {
  course: Course
}

export const CourseCertifications: React.FC<CourseCertificationsProps> = ({
  course,
}) => {
  const { t } = useTranslation()

  const [order, setOrder] = useState<SortOrder>('asc')
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [selectedParticipants, setSelectedParticipants] = useState<
    CourseParticipant[]
  >([])

  const { data: certifiedParticipants, status } = useCourseParticipants(
    course?.id ?? '',
    {
      sortBy: 'name',
      order,
      where: {
        certificate: { id: { _is_null: false } },
      },
    }
  )

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
                event.target.checked ? certifiedParticipants ?? [] : []
              )
            }}
          />
        ),
      },
      {
        id: 'name',
        label: t('pages.course-participants.name'),
        sorting: true,
      },
      {
        id: 'contact',
        label: t('pages.course-participants.contact'),
        sorting: true,
      },
      {
        id: 'organisation',
        label: t('pages.course-participants.organisation'),
        sorting: false,
      },
      {
        id: 'grade',
        label: t('pages.course-details.tabs.certifications.grade'),
        sorting: false,
      },
      {
        id: 'certificate',
        label: t('pages.course-details.tabs.certifications.certificate'),
        sorting: false,
      },
    ].filter(Boolean)
  }, [certifiedParticipants, selectedParticipants, t])

  const handleSortChange = useCallback(
    columnName => {
      if (sortColumn === columnName) {
        setOrder(prevState => (prevState === 'asc' ? 'desc' : 'asc'))
      } else {
        setOrder('asc')
        setSortColumn(columnName)
      }
    },
    [sortColumn]
  )

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
        `${participant.profile?.fullName} - ${course.name}.pdf`,
        <CertificateDocument
          key={participant.id}
          participantName={participant.profile?.fullName}
          courseName={course.name}
          courseLevel={course.level}
          grade={participant.grade ?? GradeEnum.PASS}
          courseDeliveryType={course.deliveryType}
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
    [course]
  )

  return (
    <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
      {status === LoadingStatus.FETCHING ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          data-testid="course-fetching"
        >
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1" color="grey.800">
              {t('pages.course-details.tabs.certifications.title')}
            </Typography>

            <Box>
              <Button
                variant="outlined"
                color="primary"
                disabled={selectedParticipants.length === 0}
                onClick={() => downloadCertificates(selectedParticipants)}
              >
                {t(
                  'pages.course-details.tabs.certifications.download-selected',
                  {
                    number: selectedParticipants.length,
                  }
                )}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={() =>
                  downloadCertificates(certifiedParticipants ?? [])
                }
              >
                {t(
                  'pages.course-details.tabs.certifications.download-all-certifications'
                )}
              </Button>
            </Box>
          </Grid>

          <Table>
            <TableHead
              cols={cols}
              order={order}
              orderBy={sortColumn}
              onRequestSort={handleSortChange}
              sx={{
                '& .MuiTableRow-root': {
                  backgroundColor: 'grey.300',
                },
              }}
            />
            <TableBody>
              {certifiedParticipants?.map(courseParticipant => (
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
                  <TableCell>{courseParticipant.profile.fullName}</TableCell>
                  <TableCell>
                    {courseParticipant.profile.email}
                    {courseParticipant.profile.contactDetails.map(
                      contact => contact.value
                    )}
                  </TableCell>
                  <TableCell>
                    {courseParticipant.profile.organizations.map(org => (
                      <Typography key={org.organization.id}>
                        {org.organization.name}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" mb={2} alignItems="center">
                      {courseParticipant.grade ? (
                        <Grade grade={courseParticipant.grade} />
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: 2 }}
                      onClick={() => downloadCertificates([courseParticipant])}
                    >
                      {t(
                        'pages.course-details.tabs.certifications.view-certificate'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Container>
  )
}
