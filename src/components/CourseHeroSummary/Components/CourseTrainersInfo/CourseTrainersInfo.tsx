import CircleIcon from '@mui/icons-material/Circle'
import {
  Box,
  Button,
  Link,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'urql'

import { useAuth } from '@app/context/auth'
import {
  Course_Invite_Status_Enum,
  Course_Trainer,
  Course_Trainer_Type_Enum,
  Course_Type_Enum,
  ReInviteTrainerMutation,
  ReInviteTrainerMutationVariables,
} from '@app/generated/graphql'
import { RE_INVITE_COURSE_TRAINER_MUTATION } from '@app/modules/course/queries/re-invite-course-trainer'
import { CourseTrainer } from '@app/types'
import {
  getCourseAssistants,
  getCourseLeadTrainer,
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
  courseId?: number
  courseTrainer: Course_Trainer
  enableLinks: boolean | undefined
  canReInviteTrainer?: boolean
}

const ListItemWrapper: React.FC<
  React.PropsWithChildren<ListItemWrapperProps>
> = ({ courseId, canReInviteTrainer, courseTrainer, enableLinks }) => {
  const [reInvited, setReInvited] = useState<boolean>(false)
  const { course_id, profile, type } = courseTrainer

  const navigate = useNavigate()

  const [{ data, fetching }, reInviteTrainer] = useMutation<
    ReInviteTrainerMutation,
    ReInviteTrainerMutationVariables
  >(RE_INVITE_COURSE_TRAINER_MUTATION)

  useEffect(() => {
    if (data?.deleteCourseTrainer?.id && data?.insertCourseTrainer?.id)
      setReInvited(true)
  }, [data])

  const reInvite = useCallback(async () => {
    await reInviteTrainer({
      courseTrainerToDelete: courseTrainer.id,
      courseTrainer: {
        course_id,
        profile_id: profile.id,
        status: Course_Invite_Status_Enum.Pending,
        type,
      },
    })
  }, [courseTrainer.id, course_id, profile.id, reInviteTrainer, type])

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
    if (reInvited) return STATUS_COLORS.pending_orange

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
  }, [courseTrainer.status, reInvited])

  const handleNavigateToProfile = () => {
    navigate(`/profile/${courseTrainer.profile.id}`, {
      replace: false,
      state: { courseId },
    })
  }

  return (
    <Box display="flex" alignItems="center">
      {enableLinks ? (
        <button
          style={{ all: 'unset' }}
          onClick={handleNavigateToProfile}
          data-testid="link-to-profile"
        >
          <Link>
            <ListItemTranslated
              i18nKey={i18nKey}
              fullName={courseTrainer.profile.fullName || ''}
            />
          </Link>
        </button>
      ) : (
        <ListItemTranslated
          i18nKey={i18nKey}
          fullName={courseTrainer.profile.fullName || ''}
        />
      )}
      <Tooltip
        title={
          reInvited ? Course_Invite_Status_Enum.Pending : courseTrainer.status
        }
      >
        <CircleIcon
          sx={{
            color: statusColor,
            height: 18,
            width: 18,
          }}
        />
      </Tooltip>
      {courseTrainer.status === Course_Invite_Status_Enum.Declined &&
      canReInviteTrainer &&
      !reInvited ? (
        <Button
          disabled={fetching}
          variant="text"
          color="primary"
          onClick={reInvite}
        >
          <Trans i18nKey={'pages.course-participants.resend-trainer-invite'} />
        </Button>
      ) : null}
    </Box>
  )
}

interface Props {
  canReInviteTrainer?: boolean
  courseType?: Course_Type_Enum
  courseId?: number
  trainers: CourseTrainer[] | undefined
}

const MAX_ASSISTANT_TO_SHOW = 2

export const CourseTrainersInfo: React.FC<React.PropsWithChildren<Props>> = ({
  canReInviteTrainer,
  courseType,
  courseId,
  trainers,
}) => {
  const { profile, acl } = useAuth()
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)

  const courseLeadTrainer = useMemo(
    () => getCourseLeadTrainer(trainers ?? []),
    [trainers],
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
    [trainers],
  )

  const canEnableLinks = (trainer: Course_Trainer) => {
    if (acl.isTrainer()) {
      return (
        acl.canViewProfiles() &&
        trainer.status === Course_Invite_Status_Enum.Accepted
      )
    }

    if (acl.isBookingContact() && courseType === Course_Type_Enum.Open)
      return false

    return acl.canViewProfiles()
  }

  return (
    <>
      {courseLeadTrainer && (
        <ListItemText>
          {courseLeadTrainer.profile.id === profile?.id ? (
            t('pages.course-participants.trainer')
          ) : (
            <ListItemWrapper
              courseId={courseId}
              canReInviteTrainer={canReInviteTrainer}
              courseTrainer={courseLeadTrainer}
              enableLinks={canEnableLinks(courseLeadTrainer)}
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
                courseId={courseId}
                canReInviteTrainer={canReInviteTrainer}
                courseTrainer={assistant}
                enableLinks={canEnableLinks(assistant)}
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
              courseId={courseId}
              canReInviteTrainer={canReInviteTrainer}
              courseTrainer={courseModerator}
              enableLinks={canEnableLinks(courseModerator)}
            />
          )}
        </ListItemText>
      )}
    </>
  )
}
