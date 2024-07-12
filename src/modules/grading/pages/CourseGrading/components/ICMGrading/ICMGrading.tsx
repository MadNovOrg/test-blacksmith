import { LoadingButton } from '@mui/lab'
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { BackButton } from '@app/components/BackButton'
import { Dialog } from '@app/components/dialogs'
import { Sticky } from '@app/components/Sticky'
import { useAuth } from '@app/context/auth'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Trainer_Type_Enum,
  Grade_Enum,
  SaveCourseGradingMutation,
  SaveCourseGradingMutationVariables,
} from '@app/generated/graphql'
import { CourseGradingMenu } from '@app/modules/course_details/course_grading_tab/components/CourseGradingMenu/CourseGradingMenu'
import { CourseDetailsTabs } from '@app/modules/course_details/pages/CourseDetails'
import {
  HoldsRecord,
  ModulesSelectionList,
} from '@app/modules/grading/components/ModulesSelectionList'

import useCourseGradingData from '../../hooks/useCourseGradingData'
import { useGradingParticipants } from '../../hooks/useGradingParticipants'
import { SAVE_COURSE_GRADING_MUTATION } from '../../queries/save-course-grading'
import { GradingCount } from '../GradingCount'
import { GradingTitle } from '../GradingTitle'
import { ModuleGroupNoteInput } from '../ModuleGroupNoteInput/ModuleGroupNoteInput'
import { ParticipantsList } from '../ParticipantsList'

type Props = {
  course: NonNullable<ReturnType<typeof useCourseGradingData>['data']>
}

export const ICMGrading: FC<Props> = ({ course }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const notesRef = useRef(new Map<string, string>())
  const { acl } = useAuth()
  const { t } = useTranslation()

  const [modalOpened, setModalOpened] = useState(false)
  const [grade, setGrade] = useState<Grade_Enum | undefined>()

  const [
    {
      data: savingCourseGradingData,
      fetching: savingCourseGrading,
      error: savingCourseGradingError,
    },
    saveCourseGrading,
  ] = useMutation<
    SaveCourseGradingMutation,
    SaveCourseGradingMutationVariables
  >(SAVE_COURSE_GRADING_MUTATION)

  const modulesSelectionRef = useRef<Record<string, boolean> | null>(null)

  const STORAGE_KEY = `grading-modules-selection-${course?.id}`

  const filteredCourseParticipants = useGradingParticipants(course.participants)

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
        modules: Array<{
          id: string
          name: string
          covered: boolean
          submodules:
            | Array<{
                id: string
                name: string
              }>
            | undefined
        }>
      }
    > = {}

    const rawStoredSelection = localStorage.getItem(STORAGE_KEY)
    const storedSelection: Record<string, boolean> = JSON.parse(
      rawStoredSelection ?? '{}',
    )
    course.modules.forEach(courseModule => {
      if (!courseModule.covered || !courseModule.module.moduleGroup) {
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

      groups[courseModule.module.moduleGroup?.id].modules.push({
        id: courseModule.module.id,
        name: courseModule.module.name,
        covered: storedSelection[courseModule.module.id] ?? true,
        submodules: course.modules.find(
          x => x.module.id === courseModule.module.id,
        )?.module.submodules,
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

  const saveGrades = () => {
    if (!course || !grade) return

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

    saveCourseGrading({
      modules,
      participantIds: attendedParticipants,
      grade,
      courseId: course.id,
      notes:
        attendedParticipants.length === 1
          ? Array.from(notesRef.current).map(([moduleGroupId, note]) => ({
              moduleGroupId,
              note,
              participantId: attendedParticipants[0],
            }))
          : [],
    })
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

  useEffect(() => {
    if (savingCourseGradingData && !savingCourseGradingError) {
      localStorage.removeItem(STORAGE_KEY)
      navigate(`/courses/${course.id}/details?tab=${CourseDetailsTabs.GRADING}`)
    }
  }, [
    STORAGE_KEY,
    course.id,
    navigate,
    savingCourseGradingData,
    savingCourseGradingError,
  ])

  const handleModuleSelectionChange = (selection: HoldsRecord) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    modulesSelectionRef.current = selection
  }

  const canAddModuleNotes = acl.canAddModuleNotes(
    course.trainers
      .filter(t => t.type === Course_Trainer_Type_Enum.Leader)
      .map(t => t.profile_id),
  )

  return (
    <>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'}>
        <Box width={400} display="flex" flexDirection="column" pr={4}>
          <Sticky>
            <Box mb={2}>
              <BackButton
                label={t('pages.course-grading-details.back-button-text')}
              />
            </Box>

            <GradingTitle>{course.name}</GradingTitle>
            <GradingCount
              gradingAll={
                course.participants.length === filteredCourseParticipants.length
              }
              count={filteredCourseParticipants.length}
            />

            <ParticipantsList participants={filteredCourseParticipants} />

            <Typography color={theme.palette.grey[700]} fontWeight={600} mb={1}>
              {t('pages.course-details.tabs.grading.title')}
            </Typography>
            <Typography mb={2}>
              {t('pages.course-grading.grading-menu-description')}
            </Typography>

            <CourseGradingMenu
              onChange={grade => setGrade(grade)}
              courseLevel={course.level as unknown as Course_Level_Enum}
              courseDeliveryType={
                course.deliveryType as unknown as Course_Delivery_Type_Enum
              }
            />
          </Sticky>
        </Box>

        {course.modules?.length ? (
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

            {savingCourseGradingError ? (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                data-testid="saving-grading-error-alert"
              >
                {t('pages.course-grading.grading-error')}
              </Alert>
            ) : null}

            <ModulesSelectionList
              moduleGroups={moduleGroups}
              onChange={handleModuleSelectionChange}
              slots={{
                afterModuleGroup: groupId =>
                  filteredCourseParticipants.length === 1 &&
                  canAddModuleNotes ? (
                    <ModuleGroupNoteInput
                      groupId={groupId}
                      onChange={e =>
                        notesRef.current.set(groupId, e.target.value)
                      }
                    />
                  ) : null,
              }}
            />

            <Typography mt={3} color={theme.palette.dimGrey.main}>
              {t('pages.course-grading.submit-description')}
            </Typography>

            <Box display="flex" justifyContent="right" mt={5}>
              <LoadingButton
                variant="contained"
                onClick={openConfirmationModal}
                disabled={!grade}
              >
                {t('pages.course-grading.submit-button-text')}
              </LoadingButton>
            </Box>
          </Box>
        ) : (
          t('pages.course-grading.no-modules')
        )}
      </Box>

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
            loading={savingCourseGrading}
            onClick={() => saveGrades()}
          >
            {t('pages.course-grading.modal-confirm-btn-text')}
          </LoadingButton>
        </Box>
      </Dialog>
    </>
  )
}
