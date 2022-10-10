import React from 'react'

import { TransferParticipantProvider } from './components/TransferParticipantProvider'
import { TransferParticipant } from './TransferParticipant'

export const TransferParticipantPage: React.FC = () => (
  <TransferParticipantProvider>
    <TransferParticipant />
  </TransferParticipantProvider>
)
