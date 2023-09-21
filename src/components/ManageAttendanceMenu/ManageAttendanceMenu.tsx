import MoveDownIcon from '@mui/icons-material/MoveDown'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SendIcon from '@mui/icons-material/Send'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ActionsMenu, Action } from '@app/components/ActionsMenu'
import { useAuth } from '@app/context/auth'
import { Course, CourseParticipant, Profile } from '@app/types'
import { getParticipantOrgIds } from '@app/util'

enum CourseAction {
  Cancel,
  Replace,
  Transfer,
  SendInformation,
}

type ManageAttendanceMenuProps<T> = {
  onCancelClick?: (item: T) => void
  onReplaceClick?: (item: T) => void
  onTransferClick?: (item: T) => void
  onResendInformationClick?: (item: T) => void
  courseParticipant: T
  course: Course
}

export const ManageAttendanceMenu = <
  T extends Pick<CourseParticipant, 'course' | 'profile'> & {
    course: Pick<Course, 'accreditedBy'>
    profile: Pick<Profile, 'organizations'>
  }
>({
  onCancelClick,
  onReplaceClick,
  onTransferClick,
  onResendInformationClick,
  courseParticipant,
  course,
}: ManageAttendanceMenuProps<T>) => {
  const { acl } = useAuth()
  const { t } = useTranslation()

  const participantOrgIds: string[] = getParticipantOrgIds(courseParticipant)

  const actions: Record<CourseAction, Action<T>> = useMemo(
    () => ({
      [CourseAction.Cancel]: {
        label: t('common.cancel'),
        icon: <PersonRemoveIcon color="primary" />,
        onClick: onCancelClick,
        testId: 'attendee-cancel',
      },
      [CourseAction.Replace]: {
        label: t('common.replace'),
        icon: <MoveDownIcon color="primary" />,
        onClick: onReplaceClick,
        testId: 'attendee-replace',
      },
      [CourseAction.Transfer]: {
        label: t('common.transfer'),
        icon: <SwapHorizIcon color="primary" />,
        onClick: onTransferClick,
        testId: 'attendee-transfer',
      },
      [CourseAction.SendInformation]: {
        label: t('common.resend-course-information'),
        icon: <SendIcon color="primary" />,
        onClick: onResendInformationClick,
        testId: 'attendee-resend-course-information',
      },
    }),
    [
      onCancelClick,
      onReplaceClick,
      onResendInformationClick,
      onTransferClick,
      t,
    ]
  )

  const actionPermissions: Record<CourseAction, boolean> = useMemo(
    () => ({
      [CourseAction.Replace]: acl.canReplaceParticipant(
        participantOrgIds,
        course
      ),
      [CourseAction.Transfer]: acl.canTransferParticipant(
        participantOrgIds,
        course
      ),
      [CourseAction.Cancel]: acl.canCancelParticipant(
        participantOrgIds,
        course
      ),
      [CourseAction.SendInformation]: acl.canSendCourseInformation(
        participantOrgIds,
        course
      ),
    }),
    [acl, course, participantOrgIds]
  )

  const allowedActions = useMemo(() => {
    return Object.entries(actions)
      .map(([key, action]) =>
        // TODO RMX | Types
        actionPermissions[key as unknown as CourseAction] ? action : null
      )
      .filter(Boolean)
  }, [actionPermissions, actions])

  return allowedActions.length ? (
    <ActionsMenu
      item={courseParticipant}
      label={t('pages.course-participants.manage-attendance')}
      actions={allowedActions}
      testId="manage-attendance"
    />
  ) : null
}
