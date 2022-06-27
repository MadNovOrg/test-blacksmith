import {
  Avatar,
  AvatarGroup,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseTrainer, CourseTrainerType, InviteStatus } from '@app/types'
import { getInitialsFromName, stringToColor } from '@app/util'

type Props = {
  trainers?: CourseTrainer[]
}

const trainerTypeLabelMap: Record<CourseTrainerType, string> = {
  [CourseTrainerType.ASSISTANT]: 'assist-trainer',
  [CourseTrainerType.LEADER]: 'lead-trainer',
  [CourseTrainerType.MODERATOR]: '',
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.grey[100],
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 11,
  },
}))

export const TrainerAvatarGroup: React.FC<Props> = ({ trainers }) => {
  const { t } = useTranslation()

  if (!trainers?.length) {
    return null
  }

  return (
    <AvatarGroup sx={{ justifyContent: 'center' }}>
      {trainers.map(trainer => (
        <LightTooltip
          key={trainer.id}
          title={`${t(
            `components.trainer-avatar-group.${
              trainerTypeLabelMap[trainer.type]
            }`
          )}: ${trainer.profile.fullName}`}
          placement="top"
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              opacity: trainer.status !== InviteStatus.ACCEPTED ? '0.5' : '1',
              bgcolor: stringToColor(trainer.profile.fullName),
            }}
          >
            {getInitialsFromName(trainer.profile.fullName)}
          </Avatar>
        </LightTooltip>
      ))}
    </AvatarGroup>
  )
}
