import { LoadingButton } from '@mui/lab'
import {
  Box,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Container,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputBase,
} from '@mui/material'
import { t } from 'i18next'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'
import { CourseGradingMenu } from '@app/components/CourseGradingMenu'
import { Dialog } from '@app/components/Dialog'
import { FullHeightPage } from '@app/components/FullHeightPage'
import { Sticky } from '@app/components/Sticky'
import { useFetcher } from '@app/hooks/use-fetcher'
import { CourseDetailsTabs } from '@app/pages/trainer-pages/CourseDetails'
import {
  MUTATION,
  ParamsType,
  ResponseType,
} from '@app/queries/grading/save-course-grading'
import theme from '@app/theme'
import { Grade } from '@app/types'
import { LoadingStatus } from '@app/util'

import {
  HoldsRecord,
  ModulesSelectionList,
} from '../CourseGradingDetails/ModulesSelectionList'

import useCourseGradingData from './useCourseGradingData'

export const CourseGrading = () => {
  const { id: courseId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [modalOpened, setModalOpened] = useState(false)
  const [savingGradesStatus, setSavingGradesStatus] = useState(
    LoadingStatus.IDLE
  )
  const [grade, setGrade] = useState<Grade | undefined>()
  const [feedback, setFeedback] = useState('')

  const modulesSelectionRef = useRef<Record<string, boolean> | null>(null)

  const { data: course, status } = useCourseGradingData(courseId ?? '')
  const fetcher = useFetcher()

  const STORAGE_KEY = `grading-modules-selection-${courseId}`

  const participantIds = useMemo(() => {
    return new Set(searchParams.get('participants')?.split(',') ?? [])
  }, [searchParams])

  const filteredCourseParticipants = useMemo(() => {
    if (!participantIds || !participantIds.size) {
      return course?.participants
    }

    return course?.participants?.filter(participant =>
      participantIds.has(participant.id)
    )
  }, [course?.participants, participantIds])

  const moduleGroups = useMemo(() => {
    if (!course?.modules) {
      return []
    }

    const groups: Record<
      string,
      {
        id: string
        name: string
        mandatory: boolean
        modules: Array<{ id: string; name: string; covered: boolean }>
      }
    > = {}

    const rawStoredSelection = localStorage.getItem(STORAGE_KEY)
    const storedSelection: Record<string, boolean> = JSON.parse(
      rawStoredSelection ?? '{}'
    )

    course.modules.forEach(courseModule => {
      if (!courseModule.covered) {
        return
      }

      const moduleGroup = groups[courseModule.module.moduleGroup.id]

      if (!moduleGroup) {
        groups[courseModule.module.moduleGroup.id] = {
          id: courseModule.module.moduleGroup.id,
          name: courseModule.module.moduleGroup.name,
          mandatory: courseModule.module.moduleGroup.mandatory,
          modules: [],
        }
      }

      groups[courseModule.module.moduleGroup.id].modules.push({
        id: courseModule.module.id,
        name: courseModule.module.name,
        covered: storedSelection[courseModule.module.id] ?? true,
      })
    })

    return Object.values(groups)
  }, [STORAGE_KEY, course?.modules])

  const openConfirmationModal = () => {
    setModalOpened(true)
  }

  const closeConfirmationModal = () => {
    setModalOpened(false)
  }

  const saveGrades = async () => {
    if (!course || !grade) return

    try {
      setSavingGradesStatus(LoadingStatus.FETCHING)

      const modules: Array<{
        course_participant_id: string
        module_id: string
        completed: boolean
      }> = []

      const attendedParticipants: string[] = []

      filteredCourseParticipants?.forEach(participant => {
        if (!participant.attended || participant.grade) {
          return
        }

        attendedParticipants.push(participant.id)

        for (const id in modulesSelectionRef.current) {
          modules.push({
            course_participant_id: participant.id,
            module_id: id,
            completed: modulesSelectionRef.current[id],
          })
        }
      })

      await fetcher<ResponseType, ParamsType>(MUTATION, {
        modules,
        participantIds: attendedParticipants,
        grade,
        feedback,
        courseId: course.id,
      })

      localStorage.removeItem(STORAGE_KEY)
      navigate(`/courses/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`)
    } catch (err) {
      setSavingGradesStatus(LoadingStatus.ERROR)
    }
  }

  useEffect(() => {
    const initialSelection: Record<string, boolean> = {}

    moduleGroups.forEach(group => {
      group.modules.forEach(module => {
        if (module.covered) {
          initialSelection[module.id] = true
        }
      })
    })

    modulesSelectionRef.current = initialSelection
  }, [moduleGroups])

  const handleModuleSelectionChange = (selection: HoldsRecord) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    modulesSelectionRef.current = selection
  }

  return (
    <FullHeightPage bgcolor={theme.palette.grey[100]}>
      <Container maxWidth="lg" sx={{ padding: theme.spacing(2, 0, 4, 0) }}>
        {status === LoadingStatus.FETCHING ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            data-testid="course-fetching"
          >
            <CircularProgress />
          </Stack>
        ) : null}

        {status === LoadingStatus.ERROR ? (
          <Alert severity="error">
            {t('pages.course-grading-details.course-error-alert-text')}
          </Alert>
        ) : null}
        {course ? (
          <>
            <Box display="flex">
              <Box width={400} display="flex" flexDirection="column" pr={4}>
                <Sticky>
                  <Box mb={2}>
                    <BackButton
                      to={`/courses/${courseId}/details?tab=${CourseDetailsTabs.GRADING}`}
                      label={t('pages.course-grading-details.back-button-text')}
                    />
                  </Box>

                  <Typography variant="h2" mb={2}>
                    {t('pages.course-grading.title')}
                  </Typography>
                  <Typography variant="h3" mb={5}>
                    {course?.name}
                  </Typography>
                  <Typography
                    color={theme.palette.grey[700]}
                    fontWeight={600}
                    mb={1}
                  >
                    {!participantIds.size
                      ? t('pages.course-grading.attendees-list-title-all')
                      : t('pages.course-grading.attendees-list-title', {
                          count: filteredCourseParticipants?.length,
                        })}
                  </Typography>

                  <List
                    sx={{
                      position: 'relative',
                      overflow: 'scroll',
                      maxHeight: 400,
                      '& ul': { padding: 0 },
                      marginBottom: theme.spacing(2),
                    }}
                  >
                    {filteredCourseParticipants?.map(participant => {
                      return participant.attended && !participant.grade ? (
                        <ListItem disableGutters key={participant.id}>
                          <ListItemAvatar>
                            <Avatar src={participant.profile.avatar ?? ''} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${participant.profile.fullName}`}
                          />
                        </ListItem>
                      ) : null
                    })}
                  </List>

                  <Typography
                    color={theme.palette.grey[700]}
                    fontWeight={600}
                    mb={1}
                  >
                    {t('pages.course-grading.grading-menu-title')}
                  </Typography>
                  <Typography mb={2}>
                    {t('pages.course-grading.grading-menu-description')}
                  </Typography>

                  <CourseGradingMenu
                    onChange={grade => setGrade(grade)}
                    courseLevel={course.level}
                    courseDeliveryType={course.deliveryType}
                  />
                </Sticky>
              </Box>

              {course?.modules?.length ? (
                <Box flex={1} mt={'6px'}>
                  <Typography variant="h5" fontWeight="500" mb={2}>
                    {t('pages.course-grading.modules-selection-title')}
                  </Typography>
                  <Typography
                    variant="body1"
                    mb={4}
                    color={theme.palette.dimGrey.main}
                  >
                    {t('pages.course-grading.modules-selection-description')}
                  </Typography>

                  <ModulesSelectionList
                    moduleGroups={moduleGroups}
                    onChange={handleModuleSelectionChange}
                  />

                  <Typography variant="h6" fontWeight="500" mb={1} mt={4}>
                    {t('pages.course-grading.feedback-field-title')}
                  </Typography>

                  <Box
                    sx={{
                      backgroundColor: theme.palette.common.white,
                      borderBottom: `2px solid ${theme.palette.grey[500]}`,
                      padding: theme.spacing(1, 2),
                      marginBottom: theme.spacing(3),
                      borderRadius: '2px',
                    }}
                  >
                    <InputBase
                      placeholder={t(
                        'pages.course-grading.feedback-field-placeholder'
                      )}
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      sx={{ display: 'block' }}
                      data-testid="feedback-input"
                    />
                  </Box>
                  <Box display="flex" justifyContent="right">
                    <LoadingButton
                      variant="contained"
                      onClick={openConfirmationModal}
                      disabled={!grade}
                    >
                      {t('pages.course-grading.submit-button-text')}
                    </LoadingButton>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </>
        ) : null}
        <Dialog
          open={modalOpened}
          onClose={closeConfirmationModal}
          title={t('pages.course-grading.modal-title')}
        >
          <Typography>{t('pages.course-grading.modal-description')}</Typography>
          <Box mt={4} display="flex" justifyContent="right">
            <Button
              sx={{ marginRight: 1 }}
              onClick={() => closeConfirmationModal()}
            >
              {t('pages.course-grading.modal-cancel-btn-text')}
            </Button>
            <LoadingButton
              variant="contained"
              loading={savingGradesStatus === LoadingStatus.FETCHING}
              onClick={() => saveGrades()}
            >
              {t('pages.course-grading.modal-confirm-btn-text')}
            </LoadingButton>
          </Box>
        </Dialog>
      </Container>
    </FullHeightPage>
  )
}
