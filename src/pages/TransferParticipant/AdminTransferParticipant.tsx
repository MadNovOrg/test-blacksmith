import React from 'react'
import { useParams } from 'react-router-dom'

import { TransferParticipantProvider } from './components/TransferParticipantProvider'
import { TransferParticipant } from './TransferParticipant'

export const AdminTransferParticipantPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { id, participantId } = useParams() as {
    id: string
    participantId: string
  }

  return (
    <TransferParticipantProvider
      courseId={Number(id)}
      participantId={participantId}
    >
      <TransferParticipant />
    </TransferParticipantProvider>
  )
}
