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
} from '@app/generated/graphql'

type Participant = Pick<Course_Participant, 'id' | 'attended'>

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

  const hasAttended =
    previousAttendance !== participant.attended
      ? participant.attended
      : data?.update_course_participant_by_pk?.attended ?? participant.attended

  const chipConfig: { label: string; color: 'success' | 'error' | 'gray' } =
    typeof hasAttended === 'undefined' || hasAttended === null
      ? {
          label: t('components.attendance-toggle.indeterminate'),
          color: 'gray',
        }
      : hasAttended
      ? {
          label: t('components.attendance-toggle.attended'),
          color: 'success',
        }
      : {
          label: t('components.attendance-toggle.not-attended'),
          color: 'error',
        }

  const chipDisabled = disabled || fetching

  useEffect(() => {
    if (error) {
      addSnackbarMessage('attendance-toggle-error', {
        label: 'There was an error saving attendance.',
      })
    } else {
      removeSnackbarMessage('attendance-toggle-error')
    }
  }, [error, addSnackbarMessage, removeSnackbarMessage])

  return (
    <Box display="flex" alignItems="center">
      <Chip
        {...chipConfig}
        variant="filled"
        onClick={() =>
          toggleAttendance({
            participantId: participant.id,
            attended: !hasAttended,
          })
        }
        disabled={chipDisabled}
      />
      {fetching ? <CircularProgress size={15} sx={{ ml: 1 }} /> : null}
    </Box>
  )
}
