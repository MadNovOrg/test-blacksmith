import { LoadingButton } from '@mui/lab'
import { Button, Chip, Stack, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import {
  CourseTrainerInfoFragment,
  Course_Invite_Status_Enum,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { SetCourseTrainerStatus } from '@app/queries/courses/set-course-trainer-status'

enum Action {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

export type Trainer = Pick<CourseTrainerInfoFragment, 'id' | 'type' | 'status'>

const actionToStatus = {
  [Action.ACCEPT]: Course_Invite_Status_Enum.Accepted,
  [Action.DECLINE]: Course_Invite_Status_Enum.Declined,
}

export type AcceptDeclineProps = {
  trainer?: Trainer
  onUpdate: (trainer: Trainer, status: Course_Invite_Status_Enum) => void
}

export const AcceptDeclineCourse: React.FC<
  React.PropsWithChildren<AcceptDeclineProps>
> = ({ trainer, onUpdate }) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'accept-decline-course',
  })

  const fetcher = useFetcher()

  const [action, setAction] = useState<Action>()
  const [saving, setSaving] = useState(false)

  const openModal = useCallback((_action: Action) => {
    return () => setAction(_action)
  }, [])

  const closeModal = useCallback(
    () => !saving && setAction(undefined),
    [saving]
  )

  const onSubmit = useCallback(async () => {
    if (!trainer || !action) return

    setSaving(true)
    const status = actionToStatus[action]
    try {
      await fetcher(SetCourseTrainerStatus, { id: trainer.id, status })
      setSaving(false)
      closeModal()
      onUpdate(trainer, status)
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }, [closeModal, trainer, action, fetcher, onUpdate])

  if (!trainer || trainer?.status === Course_Invite_Status_Enum.Accepted) {
    return null
  }

  if (trainer?.status === Course_Invite_Status_Enum.Declined) {
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
      <Stack direction="row" gap={1}>
        <Button
          size="small"
          color="primary"
          onClick={openModal(Action.ACCEPT)}
          data-testid="AcceptDeclineCourse-acceptBtn"
        >
          {t('accept')}
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={openModal(Action.DECLINE)}
          data-testid="AcceptDeclineCourse-declineBtn"
        >
          {t('decline')}
        </Button>
      </Stack>

      <Dialog
        open={!!action}
        onClose={closeModal}
        title={t([
          `modal_${action}.title-${trainer.type}`,
          `modal_${action}.title`,
        ])}
      >
        <Typography variant="body2">
          {t([`modal_${action}.msg-assist`, `modal_${action}.msg`])}
        </Typography>
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
            {t(`modal_${action}.cancel`)}
          </Button>
          <LoadingButton
            variant="contained"
            onClick={onSubmit}
            loading={saving}
            data-testid="AcceptDeclineCourse-modalSubmit"
          >
            {t([
              `modal_${action}.submit-${trainer.type}`,
              `modal_${action}.submit`,
            ])}
          </LoadingButton>
        </Stack>
      </Dialog>
    </>
  )
}
