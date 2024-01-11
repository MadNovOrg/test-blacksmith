import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import React from 'react'

import { CourseGradingDataQuery } from '@app/generated/graphql'
import theme from '@app/theme'

type GradingCourse = NonNullable<CourseGradingDataQuery['course']>

type GradingParticipant = GradingCourse['participants'][0]

export const ParticipantsList: React.FC<{
  participants: GradingParticipant[]
}> = ({ participants }) => {
  return (
    <List
      sx={{
        position: 'relative',
        overflow: 'scroll',
        maxHeight: 400,
        '& ul': { padding: 0 },
        marginBottom: theme.spacing(2),
      }}
    >
      {participants?.map(participant => {
        return participant.attended && !participant.grade ? (
          <ListItem disableGutters key={participant.id}>
            <ListItemAvatar>
              <Avatar src={participant.profile.avatar ?? ''} />
            </ListItemAvatar>
            <ListItemText primary={`${participant.profile.fullName}`} />
          </ListItem>
        ) : null
      })}
    </List>
  )
}
