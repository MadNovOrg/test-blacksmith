import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Box, CircularProgress, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'
import { gql, useMutation } from 'urql'

import { useSnackbar } from '@app/context/snackbar'
import {
  ToggleSelectedParticipantsAttendanceMutation,
  ToggleSelectedParticipantsAttendanceMutationVariables,
} from '@app/generated/graphql'

import { ButtonMenu } from '../ButtonMenu/ButtonMenu'

type Props = {
  courseId: number
  participantIds?: (string | number)[]
  disabled?: boolean
  onSuccess?: () => void
}

export const toggleSelectedParticipantsAttendance = gql`
  mutation ToggleSelectedParticipantsAttendance(
    $courseId: Int!
    $ids: [uuid!]!
    $attended: Boolean!
  ) {
    update_course_participant(
      where: { course_id: { _eq: $courseId }, id: { _in: $ids } }
      _set: { attended: $attended }
    ) {
      affected_rows
    }
  }
`

export const BulkAttendanceButton: React.FC<Props> = ({
  participantIds,
  disabled = false,
  courseId,
  onSuccess = noop,
}) => {
  const { t } = useTranslation()

  const { addSnackbarMessage, removeSnackbarMessage } = useSnackbar()

  const [
    {
      data: toggleSelectedData,
      fetching: toggleSelectedFetching,
      error: toggleSelectedError,
    },
    toggleSelectedParticipants,
  ] = useMutation<
    ToggleSelectedParticipantsAttendanceMutation,
    ToggleSelectedParticipantsAttendanceMutationVariables
  >(toggleSelectedParticipantsAttendance)

  const toggleAttendance = (attending: boolean) => {
    toggleSelectedParticipants({
      courseId,
      attended: attending,
      ids: participantIds,
    })
  }

  const handleMenuClick = (attending: boolean) => {
    toggleAttendance(attending)
  }

  useEffect(() => {
    if (toggleSelectedData?.update_course_participant?.affected_rows) {
      onSuccess()
    }
  }, [toggleSelectedData, onSuccess])

  useEffect(() => {
    if (toggleSelectedError) {
      addSnackbarMessage('bulk-attendance-error', {
        label: t('components.bulk-attendance-button.error'),
      })
    } else {
      removeSnackbarMessage('bulk-attendance-error')
    }
  }, [toggleSelectedError, addSnackbarMessage, removeSnackbarMessage, t])

  return (
    <Box display="flex" alignItems="center">
      {toggleSelectedFetching ? (
        <CircularProgress size={20} sx={{ mr: 2 }} />
      ) : null}
      <ButtonMenu
        label={t('components.bulk-attendance-button.label', {
          count: participantIds?.length ?? 0,
        })}
        buttonProps={{
          disabled: disabled || !participantIds?.length,
          endIcon: <ArrowDropDownIcon />,
        }}
      >
        <MenuItem onClick={() => handleMenuClick(true)}>
          {t('attended')}
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick(false)}>
          {t('not-attended')}
        </MenuItem>
      </ButtonMenu>
    </Box>
  )
}
