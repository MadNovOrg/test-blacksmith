import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Box, CircularProgress, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'
import { gql, useMutation } from 'urql'

import { ButtonMenu } from '@app/components/ButtonMenu/ButtonMenu'
import { ConfirmDialog } from '@app/components/dialogs'
import { useSnackbar } from '@app/context/snackbar'
import {
  ToggleAllParticipantsAttendanceMutation,
  ToggleAllParticipantsAttendanceMutationVariables,
  ToggleSelectedParticipantsAttendanceMutation,
  ToggleSelectedParticipantsAttendanceMutationVariables,
} from '@app/generated/graphql'

type Props = {
  courseId: number
  participantIds?: (string | number)[]
  disabled?: boolean
  onSuccess?: () => void
}

export const toggleAllParticipantsAttendance = gql`
  mutation ToggleAllParticipantsAttendance(
    $courseId: Int!
    $attended: Boolean!
  ) {
    update_course_participant(
      where: { course_id: { _eq: $courseId } }
      _set: { attended: $attended }
    ) {
      affected_rows
    }
  }
`

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
  const [togglingAllParticipants, setTogglingAllParticipants] = useState<
    'attended' | 'did-not-attend' | undefined
  >()

  const { addSnackbarMessage, removeSnackbarMessage } = useSnackbar()

  const [
    { data: toggleAllData, fetching: toggleAllFetching, error: toggleAllError },
    toggleAllParticipants,
  ] = useMutation<
    ToggleAllParticipantsAttendanceMutation,
    ToggleAllParticipantsAttendanceMutationVariables
  >(toggleAllParticipantsAttendance)

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
    if (togglingAllParticipants) {
      toggleAllParticipants({
        courseId,
        attended: togglingAllParticipants === 'attended',
      })
    } else {
      toggleSelectedParticipants({
        courseId,
        attended: attending,
        ids: participantIds,
      })
    }
  }

  const handleMenuClick = (attending: boolean) => {
    if (!participantIds?.length) {
      setTogglingAllParticipants(attending ? 'attended' : 'did-not-attend')
    } else {
      toggleAttendance(attending)
    }
  }

  const fetching = toggleAllFetching || toggleSelectedFetching
  const hasError = toggleAllError || toggleSelectedError

  useEffect(() => {
    if (
      (toggleAllData?.update_course_participant?.affected_rows &&
        toggleAllData?.update_course_participant?.affected_rows > 0) ||
      (toggleSelectedData?.update_course_participant?.affected_rows &&
        toggleSelectedData?.update_course_participant?.affected_rows > 0)
    ) {
      setTogglingAllParticipants(undefined)
      onSuccess()
    }
  }, [toggleAllData, toggleSelectedData, onSuccess])

  useEffect(() => {
    if (hasError) {
      addSnackbarMessage('bulk-attendance-error', {
        label: t('components.bulk-attendance-button.error'),
      })

      setTogglingAllParticipants(undefined)
    } else {
      removeSnackbarMessage('bulk-attendance-error')
    }
  }, [hasError, addSnackbarMessage, removeSnackbarMessage, t])

  return (
    <Box display="flex" alignItems="center">
      {fetching ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
      <ButtonMenu
        label={t('components.bulk-attendance-button.label', {
          count: participantIds?.length ?? 0,
        })}
        buttonProps={{ disabled, endIcon: <ArrowDropDownIcon /> }}
      >
        <MenuItem onClick={() => handleMenuClick(true)}>
          {t('attended')}
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick(false)}>
          {t('not-attended')}
        </MenuItem>
      </ButtonMenu>

      <ConfirmDialog
        open={Boolean(togglingAllParticipants)}
        title={t('components.bulk-attendance-button.modal-title')}
        message={t('components.bulk-attendance-button.modal-description')}
        onCancel={() => setTogglingAllParticipants(undefined)}
        onOk={() => {
          toggleAttendance(togglingAllParticipants === 'attended')
        }}
      />
    </Box>
  )
}
