import { Chip, CircularProgress, Box } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'react-use'
import { gql, useMutation } from 'urql'

import { useSnackbar } from '@app/context/snackbar'
import {
  Course_Participant,
  ToggleAttendanceMutation,
  ToggleAttendanceMutationVariables,
  ToggleEvaluationMutation,
  ToggleEvaluationMutationVariables,
} from '@app/generated/graphql'

type Participant = Pick<
  Course_Participant,
  'id' | 'attended' | 'course_id' | 'profile_id'
>

type Props = {
  participant: Participant
  disabled?: boolean
}

export const toggleAttendanceMutation = gql`
  mutation ToggleAttendance($participantId: uuid!, $attended: Boolean!) {
    update_course_participant_by_pk(
      pk_columns: { id: $participantId }
      _set: { attended: $attended }
    ) {
      attended
    }
  }
`

export const toggleEvaluationStatus = gql`
  mutation ToggleEvaluation($participantId: uuid!, $courseId: Int) {
    delete_course_evaluation_answers(
      where: {
        _and: [
          { courseId: { _eq: $courseId } }
          { profileId: { _eq: $participantId } }
        ]
      }
    ) {
      affected_rows
    }
  }
`

export const AttendingToggle: React.FC<Props> = ({
  participant,
  disabled = false,
}) => {
  const { t } = useTranslation()
  const { addSnackbarMessage, removeSnackbarMessage } = useSnackbar()
  const previousAttendance = usePrevious(participant.attended)

  const [{ data, fetching, error }, toggleAttendance] = useMutation<
    ToggleAttendanceMutation,
    ToggleAttendanceMutationVariables
  >(toggleAttendanceMutation)

  const [, toggleEvaluation] = useMutation<
    ToggleEvaluationMutation,
    ToggleEvaluationMutationVariables
  >(toggleEvaluationStatus)

  const hasAttended =
    previousAttendance !== participant.attended
      ? participant.attended
      : data?.update_course_participant_by_pk?.attended ?? participant.attended

  const chipConfig: { label: string; color: 'success' | 'error' | 'gray' } =
    typeof hasAttended === 'undefined' || hasAttended === null
      ? {
          label: t('indeterminate'),
          color: 'gray',
        }
      : hasAttended
      ? {
          label: t('attended'),
          color: 'success',
        }
      : {
          label: t('not-attended'),
          color: 'error',
        }

  const chipDisabled = disabled || fetching

  useEffect(() => {
    if (error) {
      addSnackbarMessage('attendance-toggle-error', {
        label: t('components.attendance-toggle.error'),
      })
    } else {
      removeSnackbarMessage('attendance-toggle-error')
    }
  }, [error, addSnackbarMessage, removeSnackbarMessage, t])

  return (
    <Box display="flex" alignItems="center">
      <Chip
        {...chipConfig}
        variant="filled"
        onClick={() => {
          try {
            toggleAttendance({
              participantId: participant.id,
              attended: !hasAttended,
            })
            if (participant.attended) {
              toggleEvaluation({
                participantId: participant.profile_id,
                courseId: participant.course_id,
              })
            }
          } catch (err) {
            addSnackbarMessage('attendance-toggle-error', {
              label: t('components.attendance-toggle.error'),
            })
          }
        }}
        disabled={chipDisabled}
      />
      {fetching ? <CircularProgress size={15} sx={{ ml: 1 }} /> : null}
    </Box>
  )
}
