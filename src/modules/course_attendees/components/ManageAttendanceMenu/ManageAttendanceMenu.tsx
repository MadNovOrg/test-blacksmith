import MoveDownIcon from '@mui/icons-material/MoveDown'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SendIcon from '@mui/icons-material/Send'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { matches } from 'lodash'
import { cond, constant, stubTrue } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ActionsMenu, Action } from '@app/components/ActionsMenu'
import { useAuth } from '@app/context/auth'
import { Course_Type_Enum } from '@app/generated/graphql'
import { Course, CourseParticipant, Profile } from '@app/types'
import { courseEnded, getParticipantOrgIds } from '@app/util'

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
  T extends Pick<CourseParticipant, 'attended' | 'course' | 'profile'> & {
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

  const actionPermissions = useMemo(
    () =>
      cond([
        [
          matches({
            courseType: Course_Type_Enum.Closed,
            action: CourseAction.Cancel,
          }),
          constant(acl.canCancelParticipantCLOSED(participantOrgIds, course)),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Closed,
            action: CourseAction.SendInformation,
          }),
          constant(acl.canCancelParticipantCLOSED(participantOrgIds, course)),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Indirect,
            action: CourseAction.Cancel,
          }),
          constant(acl.canCancelParticipantINDIRECT(participantOrgIds, course)),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Indirect,
            action: CourseAction.SendInformation,
          }),
          constant(acl.canCancelParticipantINDIRECT(participantOrgIds, course)),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Open,
            action: CourseAction.Cancel,
          }),
          constant(acl.canCancelParticipant(participantOrgIds, course)),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Open,
            action: CourseAction.Replace,
          }),
          constant(
            (acl.canReplaceParticipant(participantOrgIds, course) &&
              !courseEnded(course)) ||
              (courseEnded(course) &&
                !courseParticipant.attended &&
                acl.canReplaceParticipantAfterCourseEnded())
          ),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Open,
            action: CourseAction.SendInformation,
          }),
          constant(
            acl.canSendCourseInformation(participantOrgIds, course) &&
              !courseEnded(course)
          ),
        ],
        [
          matches({
            courseType: Course_Type_Enum.Open,
            action: CourseAction.Transfer,
          }),
          constant(acl.canTransferParticipant(participantOrgIds, course)),
        ],
        [stubTrue, constant(false)],
      ]),
    [acl, course, courseParticipant.attended, participantOrgIds]
  )

  const allowedActions = useMemo(() => {
    return Object.entries(actions)
      .map(([key, action]) =>
        // TODO RMX | Types
        {
          return actionPermissions({
            courseType: course.type,
            action: Number(key),
          })
            ? action
            : null
        }
      )
      .filter(Boolean)
  }, [actionPermissions, actions, course.type])

  return allowedActions.length ? (
    <ActionsMenu
      item={courseParticipant}
      label={t('pages.course-participants.manage-attendance')}
      actions={allowedActions}
      testId="manage-attendance"
    />
  ) : null
}
