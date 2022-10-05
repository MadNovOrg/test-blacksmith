import { LinearProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'

import { useAuth } from '@app/context/auth'

export type ParticipantsCountProps = {
  participating: number
  capacity?: number
  waitlist?: number
}

export const ParticipantsCount: React.FC<ParticipantsCountProps> = ({
  participating,
  waitlist,
  capacity,
}) => {
  const { acl } = useAuth()
  const showWaitlist = acl.canSeeWaitingLists() && waitlist

  return (
    <>
      <Typography mb={1}>
        <Typography component="span">{participating}</Typography>
        {capacity ? (
          <Typography component="span" variant="body2">
            {showWaitlist ? `+${waitlist}` : ''}/{capacity}
          </Typography>
        ) : null}
      </Typography>
      {capacity ? (
        <LinearProgress
          variant="determinate"
          value={(participating / capacity) * 100}
          className={showWaitlist ? 'dotted' : ''}
        />
      ) : null}
    </>
  )
}
