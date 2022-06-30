import {
  AvatarGroup,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseTrainer, CourseTrainerType, InviteStatus } from '@app/types'

import { Avatar } from '../Avatar'

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

function sortTrainers(a: CourseTrainer, b: CourseTrainer): 1 | -1 | 0 {
  return a.type === CourseTrainerType.LEADER
    ? -1
    : b.type === CourseTrainerType.LEADER
    ? 1
    : 0
}

export const TrainerAvatarGroup: React.FC<Props> = ({ trainers }) => {
  const { t } = useTranslation()

  if (!trainers?.length) {
    return null
  }

  const sortedTrainers = trainers.slice().sort(sortTrainers)

  return (
    <AvatarGroup sx={{ justifyContent: 'center' }}>
      {sortedTrainers.map((trainer, index) => (
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
            name={trainer.profile.fullName}
            size={32}
            sx={{
              opacity: trainer.status !== InviteStatus.ACCEPTED ? '0.5' : '1',
            }}
            data-testid={`trainer-avatar-${trainer.id}`}
            data-index={index}
          />
        </LightTooltip>
      ))}
    </AvatarGroup>
  )
}
