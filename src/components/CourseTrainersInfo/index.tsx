import {
  Box,
  Button,
  Link,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import React, { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import {
  Course_Trainer,
  Course_Trainer_Type_Enum,
  Course_Invite_Status_Enum,
} from '@app/generated/graphql'
import { CourseTrainer } from '@app/types'
import {
  getCourseLeadTrainer,
  getCourseAssistants,
  getCourseModerator,
} from '@app/util'
import { STATUS_COLORS } from './statusColorConsts'

interface ItemProps {
  i18nKey: string
  fullName: string
}

const ListItemTranslated: React.FC<React.PropsWithChildren<ItemProps>> = ({
  i18nKey,
  fullName,
}) => {
  return (
    <Typography>
      <Trans i18nKey={i18nKey} values={{ trainer: fullName }} />
    </Typography>
  )
}

interface ListItemWrapperProps {
  courseTrainer: Course_Trainer
  enableLinks: boolean | undefined
}

const ListItemWrapper: React.FC<
  React.PropsWithChildren<ListItemWrapperProps>
> = ({ courseTrainer, enableLinks }) => {
  const i18nKey = useMemo(() => {
    switch (courseTrainer.type) {
      case Course_Trainer_Type_Enum.Leader:
        return 'pages.course-participants.trained-by'
      case Course_Trainer_Type_Enum.Assistant:
        return 'pages.course-participants.assisted-by'
      case Course_Trainer_Type_Enum.Moderator:
        return 'pages.course-participants.moderated-by'
      default:
        return 'pages.course-participants.trained-by'
    }
  }, [courseTrainer])

  const statusColor = useMemo(() => {
    switch (courseTrainer.status) {
      case Course_Invite_Status_Enum.Accepted:
        return STATUS_COLORS.accepted_green
      case Course_Invite_Status_Enum.Pending:
        return STATUS_COLORS.pending_orange
      case Course_Invite_Status_Enum.Declined:
        return STATUS_COLORS.declined_red
      default:
        return STATUS_COLORS.default
    }
  }, [courseTrainer])

  return (
    <>
      <Box display="flex">
        {enableLinks ? (
          <Link href={`/profile/${courseTrainer.profile.id}`}>
            <ListItemTranslated
              i18nKey={i18nKey}
              fullName={courseTrainer.profile.fullName || ''}
            />
          </Link>
        ) : (
          <ListItemTranslated
            i18nKey={i18nKey}
            fullName={courseTrainer.profile.fullName || ''}
          />
        )}
        <Tooltip title={courseTrainer.status}>
          <CircleIcon sx={{ color: statusColor, height: 18, width: 18 }} />
        </Tooltip>
      </Box>
    </>
  )
}

interface Props {
  trainers: CourseTrainer[] | undefined
}

const MAX_ASSISTANT_TO_SHOW = 2

export const CourseTrainersInfo: React.FC<React.PropsWithChildren<Props>> = ({
  trainers,
}) => {
  const { profile, acl } = useAuth()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)

  const courseLeadTrainer = useMemo(
    () => getCourseLeadTrainer(trainers ?? []),
    [trainers]
  )

  const [courseAssistants, numberOfAssistants] = useMemo(() => {
    const assistants = getCourseAssistants(trainers ?? [])
    const filteredAssistants = showMore
      ? assistants
      : assistants.slice(0, MAX_ASSISTANT_TO_SHOW)
    return [filteredAssistants, assistants.length]
  }, [showMore, trainers])

  const courseModerator = useMemo(
    () => getCourseModerator(trainers ?? []),
    [trainers]
  )

  return (
    <>
      {courseLeadTrainer && (
        <ListItemText>
          {courseLeadTrainer.profile.id === profile?.id ? (
            t('pages.course-participants.trainer')
          ) : (
            <ListItemWrapper
              enableLinks={acl.canViewProfiles()}
              courseTrainer={courseLeadTrainer}
            />
          )}
        </ListItemText>
      )}
      <>
        {courseAssistants.map(assistant => (
          <ListItemText key={assistant.id}>
            {assistant.profile.id === profile?.id ? (
              t('pages.course-participants.assistant')
            ) : (
              <ListItemWrapper
                enableLinks={acl.canViewProfiles()}
                courseTrainer={assistant}
              />
            )}
          </ListItemText>
        ))}
        {numberOfAssistants > MAX_ASSISTANT_TO_SHOW ? (
          <Button
            variant="text"
            size="small"
            onClick={() => setShowMore(!showMore)}
            sx={{ paddingLeft: 0 }}
          >
            {showMore
              ? t('pages.course-participants.show-less')
              : t('pages.course-participants.show-more')}
          </Button>
        ) : null}
      </>
      {courseModerator && (
        <ListItemText>
          {courseModerator.profile.id === profile?.id ? (
            t('pages.course-participants.moderator')
          ) : (
            <ListItemWrapper
              enableLinks={acl.canViewProfiles()}
              courseTrainer={courseModerator}
            />
          )}
        </ListItemText>
      )}
    </>
  )
}
