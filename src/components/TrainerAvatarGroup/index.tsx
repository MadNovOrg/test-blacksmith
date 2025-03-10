import CloseIcon from '@mui/icons-material/Close'
import {
  AvatarGroup,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Link,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Trainer,
  Course_Trainer_Type_Enum,
  Profile,
} from '@app/generated/graphql'
import { CourseTrainerType } from '@app/types'

import { Avatar } from '../../modules/profile/components/Avatar'

export type TrainerAvatar = Pick<Course_Trainer, 'id' | 'status' | 'type'> & {
  profile: Pick<Profile, 'fullName' | 'avatar' | 'archived' | 'id'>
}
type Props = {
  trainers?: TrainerAvatar[]
}

type ProfileAvatarProp = {
  trainer: TrainerAvatar
  index: number
}

const trainerTypeLabelMap: Record<CourseTrainerType, string> = {
  [Course_Trainer_Type_Enum.Assistant]: 'assist-trainer',
  [Course_Trainer_Type_Enum.Leader]: 'lead-trainer',
  [Course_Trainer_Type_Enum.Moderator]: 'moderator',
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

const ProfileAvatar: React.FC<React.PropsWithChildren<ProfileAvatarProp>> = ({
  trainer,
  index,
}) => {
  return (
    <Avatar
      src={trainer.profile.archived ? undefined : trainer.profile.avatar ?? ''}
      name={
        trainer.profile.archived ? undefined : trainer.profile.fullName ?? ''
      }
      size={32}
      sx={{
        ...(trainer.profile.archived ? { bgcolor: 'grey' } : {}),
        opacity:
          trainer.status !== Course_Invite_Status_Enum.Accepted ? '0.5' : '1',
      }}
      data-testid={`trainer-avatar-${trainer.id}`}
      data-index={index}
    >
      {trainer.profile.archived ? <CloseIcon /> : null}
    </Avatar>
  )
}

function sortTrainers(a: TrainerAvatar, b: TrainerAvatar): number {
  const order = {
    [Course_Trainer_Type_Enum.Leader]: 1,
    [Course_Trainer_Type_Enum.Assistant]: 2,
    [Course_Trainer_Type_Enum.Moderator]: 3,
  }
  return order[a.type] - order[b.type]
}

export const TrainerAvatarGroup: React.FC<React.PropsWithChildren<Props>> = ({
  trainers,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()

  function trainerAvatar(trainer: TrainerAvatar, index: number) {
    const name = trainer.profile.archived
      ? t('common.archived-profile')
      : trainer.profile.fullName
    return (
      <LightTooltip
        key={trainer.id}
        title={`${t(
          `components.trainer-avatar-group.${
            trainerTypeLabelMap[trainer.type]
          }`,
        )}: ${name}`}
        placement="top"
      >
        {acl.canViewProfiles() ? (
          <Link
            href={`/profile/${trainer.profile.id}`}
            underline="none"
            ml={-1}
          >
            <ProfileAvatar trainer={trainer} index={index} />
          </Link>
        ) : (
          <ProfileAvatar trainer={trainer} index={index} />
        )}
      </LightTooltip>
    )
  }

  if (!trainers?.length) {
    return null
  }

  const sortedTrainers = trainers.slice().sort(sortTrainers)

  return (
    <AvatarGroup
      // max={2}
      sx={{
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          justifyContent: 'center',
        },
      }}
    >
      {sortedTrainers.map(trainerAvatar)}
    </AvatarGroup>
  )
}
