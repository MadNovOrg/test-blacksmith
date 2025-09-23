import React, { createContext, useContext, useState } from 'react'

import { CourseParticipant } from '@app/types'

interface ManageParticipantActionsContextValue {
  attendeeToReplace: CourseParticipant | undefined
  setAttendeeToReplace: React.Dispatch<
    React.SetStateAction<CourseParticipant | undefined>
  >
  attendeeToCancel: CourseParticipant | undefined
  setAttendeeToCancel: React.Dispatch<
    React.SetStateAction<CourseParticipant | undefined>
  >
  attendeeToResendInfo: CourseParticipant | undefined
  setAttendeeToResendInfo: React.Dispatch<
    React.SetStateAction<CourseParticipant | undefined>
  >
}

const ManageParticipantActionsContext =
  createContext<ManageParticipantActionsContextValue | null>(null)

export const ManageParticipantActionsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [attendeeToReplace, setAttendeeToReplace] = useState<
    CourseParticipant | undefined
  >()
  const [attendeeToCancel, setAttendeeToCancel] = useState<
    CourseParticipant | undefined
  >()
  const [attendeeToResendInfo, setAttendeeToResendInfo] = useState<
    CourseParticipant | undefined
  >()

  const value = React.useMemo(
    () => ({
      attendeeToReplace,
      setAttendeeToReplace,
      attendeeToCancel,
      setAttendeeToCancel,
      attendeeToResendInfo,
      setAttendeeToResendInfo,
    }),
    [attendeeToReplace, attendeeToCancel, attendeeToResendInfo],
  )

  return (
    <ManageParticipantActionsContext.Provider value={value}>
      {children}
    </ManageParticipantActionsContext.Provider>
  )
}

export const useManageParticipantActions = () => {
  const context = useContext(ManageParticipantActionsContext)
  if (!context) {
    throw new Error(
      'useManageParticipantActions must be used within ManageParticipantActionsProvider',
    )
  }
  return context
}
