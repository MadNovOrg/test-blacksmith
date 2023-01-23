import {
  AvatarGroup,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Course_Invite_Status_Enum,
  Course_Trainer,
  Course_Trainer_Type_Enum,
  Profile,
} from '@app/generated/graphql'
import { CourseTrainerType } from '@app/types'

import { Avatar } from '../Avatar'

export type TrainerAvatar = Pick<Course_Trainer, 'id' | 'status' | 'type'> & {
  profile: Pick<Profile, 'fullName' | 'avatar'>
}
type Props = {
  trainers?: TrainerAvatar[]
}

const trainerTypeLabelMap: Record<CourseTrainerType, string> = {
  [Course_Trainer_Type_Enum.Assistant]: 'assist-trainer',
  [Course_Trainer_Type_Enum.Leader]: 'lead-trainer',
  [Course_Trainer_Type_Enum.Moderator]: '',
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

function sortTrainers(a: TrainerAvatar, b: TrainerAvatar): 1 | -1 | 0 {
  return a.type === Course_Trainer_Type_Enum.Leader
    ? -1
    : b.type === Course_Trainer_Type_Enum.Leader
    ? 1
    : 0
}

export const TrainerAvatarGroup: React.FC<Props> = ({ trainers }) => {
  const { t } = useTranslation()

  function trainerAvatar(trainer: TrainerAvatar, index: number) {
    return (
      <LightTooltip
        key={trainer.id}
        title={`${t(
          `components.trainer-avatar-group.${trainerTypeLabelMap[trainer.type]}`
        )}: ${trainer.profile.fullName}`}
        placement="top"
      >
        <Avatar
          src={trainer.profile.avatar ?? ''}
          name={trainer.profile.fullName ?? ''}
          size={32}
          sx={{
            opacity:
              trainer.status !== Course_Invite_Status_Enum.Accepted
                ? '0.5'
                : '1',
          }}
          data-testid={`trainer-avatar-${trainer.id}`}
          data-index={index}
        />
      </LightTooltip>
    )
  }

  if (!trainers?.length) {
    return null
  }

  const sortedTrainers = trainers.slice().sort(sortTrainers)

  return (
    <AvatarGroup sx={{ justifyContent: 'center' }}>
      {sortedTrainers.map(trainerAvatar)}
    </AvatarGroup>
  )
}
