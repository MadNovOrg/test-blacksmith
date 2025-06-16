import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Button,
  CircularProgress,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { Avatar } from '@app/components/Avatar'
import { BackButton } from '@app/components/BackButton'
import { Sticky } from '@app/components/Sticky'
import { TableHead } from '@app/components/Table/TableHead'
import {
  Blended_Learning_Status_Enum,
  Go1EnrollmentStatus,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { FullHeightPageLayout } from '@app/layouts/FullHeightPageLayout'
import { useUpdateCourseParticipantGO1Data } from '@app/modules/course_details/hooks/course-participant/update-course-participant-go1-data'
import useCourseParticipantByPK from '@app/modules/course_details/hooks/course-participant/useCourseParticipantGO1EnrollmentsByPK'

export const CourseParticipantBlendedLearningSync = () => {
  const { participantId } = useParams() as {
    participantId: string
  }
  const navigate = useNavigate()

  const { t } = useScopedTranslation('pages.blended-learning-sync')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const mapActionStatusToEnum: Record<
    Go1EnrollmentStatus,
    Blended_Learning_Status_Enum
  > = useMemo(
    () => ({
      [Go1EnrollmentStatus.Completed]: Blended_Learning_Status_Enum.Completed,
      [Go1EnrollmentStatus.Inprogress]: Blended_Learning_Status_Enum.InProgress,
    }),
    [],
  )

  const cols = useMemo(
    () => [
      { id: 'radio', label: '', sorting: false },
      { id: 'name', label: t('col-learning-name'), sorting: false },
      { id: 'status', label: t('col-status'), sorting: false },
    ],
    [t],
  )

  const { courseParticipant, blendedLearningEnrollments, error, loading } =
    useCourseParticipantByPK(participantId)

  const [
    { data: updatedParticipantData, fetching: updating },
    updateCourseParticipantGO1Data,
  ] = useUpdateCourseParticipantGO1Data()

  const currentSyncedEnrollment = useMemo(() => {
    if (
      !courseParticipant?.go1EnrolmentId ||
      !blendedLearningEnrollments.length
    )
      return null

    return (
      blendedLearningEnrollments.find(
        enrollment => enrollment.id === courseParticipant?.go1EnrolmentId,
      ) ?? null
    )
  }, [blendedLearningEnrollments, courseParticipant?.go1EnrolmentId])

  const [chosenEnrollment, setChosenEnrollment] = useState<{
    id: number
    status: Blended_Learning_Status_Enum
  } | null>(null)

  useEffect(() => {
    if (currentSyncedEnrollment && !chosenEnrollment) {
      setChosenEnrollment({
        id: currentSyncedEnrollment.id,
        status:
          mapActionStatusToEnum[
            currentSyncedEnrollment.status as Go1EnrollmentStatus
          ],
      })
    }
  }, [chosenEnrollment, currentSyncedEnrollment, mapActionStatusToEnum])

  useEffect(() => {
    if (updatedParticipantData?.update_course_participant_by_pk?.id) {
      navigate('../details', {
        replace: true,
      })
    }
  }, [navigate, updatedParticipantData?.update_course_participant_by_pk?.id])

  const disabledSync = useMemo(() => {
    if (
      !chosenEnrollment ||
      (courseParticipant?.go1EnrolmentId &&
        chosenEnrollment.id === courseParticipant?.go1EnrolmentId)
    )
      return true
  }, [chosenEnrollment, courseParticipant?.go1EnrolmentId])

  return (
    <FullHeightPageLayout bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
          <Box width={400} display="flex" flexDirection="column" pr={4}>
            <Sticky top={20}>
              <Box mb={2}>
                <BackButton
                  label={t('back-btn-text')}
                  to={'../details'}
                  replace
                />
              </Box>

              <Box mb={5}>
                <Typography variant="h2" mb={2}>
                  {t('heading')}
                </Typography>
              </Box>

              <Box mb={4}>
                <Typography
                  color={theme.palette.grey[700]}
                  fontWeight={600}
                  mb={1}
                >
                  {t('attendee-label')}
                </Typography>

                <List>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar src={courseParticipant?.profile.avatar ?? ''} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={courseParticipant?.profile.fullName ?? ''}
                    />
                  </ListItem>
                </List>
              </Box>
            </Sticky>
          </Box>

          <Box flex={1}>
            <Box mt={isMobile ? 2 : 8}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {t('table-title')}
                </Typography>
                <Typography variant="body1" mb={2}>
                  {t('table-subtitle')}
                </Typography>

                {(() => {
                  if (loading) {
                    return (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CircularProgress />
                      </Box>
                    )
                  }

                  if (error) {
                    return (
                      <Alert
                        variant="outlined"
                        severity="error"
                        sx={{ marginBottom: 2 }}
                      >
                        {t('error-fetching-data')}
                      </Alert>
                    )
                  }

                  if (!blendedLearningEnrollments?.length) {
                    return (
                      <Alert
                        variant="outlined"
                        severity="error"
                        sx={{ marginBottom: 2 }}
                      >
                        {t('no-enrollments')}
                      </Alert>
                    )
                  }

                  return blendedLearningEnrollments?.length ? (
                    <>
                      <Alert
                        variant="outlined"
                        severity="info"
                        sx={{ marginBottom: 2 }}
                      >
                        <Trans i18nKey="sync-info" t={t} />
                      </Alert>

                      <Table sx={{ background: 'white' }}>
                        <TableHead cols={cols} />
                        <TableBody>
                          {blendedLearningEnrollments.map(
                            (enrollment, index) => (
                              <TableRow key={enrollment.id} data-index={index}>
                                <TableCell>
                                  <Radio
                                    checked={
                                      chosenEnrollment?.id === enrollment.id
                                    }
                                    onChange={() =>
                                      setChosenEnrollment({
                                        id: enrollment.id,
                                        status:
                                          mapActionStatusToEnum[
                                            enrollment.status as Go1EnrollmentStatus
                                          ],
                                      })
                                    }
                                    value={enrollment.id}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {`${enrollment.learningObject?.title}${
                                      enrollment.id ===
                                      currentSyncedEnrollment?.id
                                        ? ' (Current)'
                                        : ''
                                    }`}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {t(`status-${enrollment.status}`)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                      <Box display="flex" justifyContent="flex-end" my={3}>
                        <Box>
                          <Button
                            onClick={() => {
                              navigate('../details', {
                                replace: true,
                              })
                            }}
                            sx={{ mr: 2 }}
                          >
                            {t('cancel-btn-text')}
                          </Button>

                          <LoadingButton
                            disabled={disabledSync}
                            loading={updating}
                            onClick={() => {
                              if (!chosenEnrollment) return

                              updateCourseParticipantGO1Data({
                                courseParticipantId: participantId,
                                go1EnrolmentId: chosenEnrollment.id,
                                go1EnrolmentStatus: chosenEnrollment.status,
                              })
                            }}
                            variant="contained"
                            data-testid="sync-btn"
                          >
                            {t('sync-btn-text')}
                          </LoadingButton>
                        </Box>
                      </Box>
                    </>
                  ) : null
                })()}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </FullHeightPageLayout>
  )
}
