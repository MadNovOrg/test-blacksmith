import { LoadingButton } from '@mui/lab'
import { Button, Chip, Stack, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import { useAuth } from '@app/context/auth'
import { useFetcher } from '@app/hooks/use-fetcher'
import { SetCourseTrainerStatus } from '@app/queries/courses/set-course-trainer-status'
import { Course, CourseTrainer, InviteStatus } from '@app/types'

enum Action {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

const actionToStatus = {
  [Action.ACCEPT]: InviteStatus.ACCEPTED,
  [Action.DECLINE]: InviteStatus.DECLINED,
}

export type AcceptDeclineProps = {
  course: Course
  onUpdate: (
    course: Course,
    trainer: CourseTrainer,
    status: InviteStatus
  ) => void
}

export const AcceptDeclineCourse: React.FC<AcceptDeclineProps> = ({
  course,
  onUpdate,
  children,
}) => {
  const { t } = useTranslation()
  const { profile } = useAuth()
  const fetcher = useFetcher()

  const [action, setAction] = useState<Action>()
  const [saving, setSaving] = useState(false)

  const courseTrainer = useMemo(
    () => (course.trainers ?? []).find(t => t.profile.id === profile?.id),
    [course, profile]
  )

  const openModal = useCallback((_action: Action) => {
    return () => setAction(_action)
  }, [])

  const closeModal = useCallback(
    () => !saving && setAction(undefined),
    [saving]
  )

  const onSubmit = useCallback(async () => {
    if (!courseTrainer || !action) return

    setSaving(true)
    const status = actionToStatus[action]
    try {
      await fetcher(SetCourseTrainerStatus, { id: courseTrainer.id, status })
      setSaving(false)
      closeModal()
      onUpdate(course, courseTrainer, status)
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }, [closeModal, courseTrainer, action, fetcher, onUpdate, course])

  const modalText = useCallback(
    (path: string) => {
      return t(`components.accept-decline-course.modal_${action}.${path}`)
    },
    [t, action]
  )

  if (!courseTrainer || courseTrainer?.status === InviteStatus.ACCEPTED) {
    return <>{children}</>
  }

  if (courseTrainer?.status === InviteStatus.DECLINED) {
    return (
      <Chip
        label={t('components.accept-decline-course.declined')}
        size="small"
        color="error"
        data-testid="AcceptDeclineCourse-declinedChip"
      />
    )
  }

  return (
    <>
      <Stack direction="column" gap={1}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={openModal(Action.ACCEPT)}
          data-testid="AcceptDeclineCourse-acceptBtn"
        >
          {t('components.accept-decline-course.accept')}
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={openModal(Action.DECLINE)}
          data-testid="AcceptDeclineCourse-declineBtn"
        >
          {t('components.accept-decline-course.decline')}
        </Button>
      </Stack>

      <Dialog open={!!action} onClose={closeModal} title={modalText('title')}>
        <Typography variant="body2">{modalText('msg')}</Typography>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
          mt={4}
        >
          <Button
            variant="outlined"
            onClick={closeModal}
            disabled={saving}
            data-testid="AcceptDeclineCourse-modalCancel"
          >
            {modalText('cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={onSubmit}
            loading={saving}
            data-testid="AcceptDeclineCourse-modalSubmit"
          >
            {modalText('submit')}
          </LoadingButton>
        </Stack>
      </Dialog>
    </>
  )
}
