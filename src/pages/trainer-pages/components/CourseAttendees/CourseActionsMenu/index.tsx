import MoveDownIcon from '@mui/icons-material/MoveDown'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SendIcon from '@mui/icons-material/Send'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ActionsMenu } from '@app/components/ActionsMenu'
import { useAuth } from '@app/context/auth'
import { Accreditors_Enum } from '@app/generated/graphql'
import { isNotNullish } from '@app/util'

type Props<T> = {
  onReplaceClick: (item: T) => void
  onTransferClick: (item: T) => void
  onRemoveClick: (item: T) => void
  onResendCourseInformationClick: (item: T) => void
  item: T
}

export const CourseActionsMenu = <
  T extends {
    course: { accreditedBy: Accreditors_Enum }
    profile: {
      organizations: {
        organization: {
          id: string
        }
      }[]
    }
  }
>({
  onRemoveClick,
  onReplaceClick,
  onTransferClick,
  onResendCourseInformationClick,
  item,
}: Props<T>) => {
  const { acl } = useAuth()
  const { t } = useTranslation()

  const actions = useMemo(() => {
    const participantOrgIds = item.profile.organizations.map(
      o => o.organization.id
    )
    return [
      acl.canReplaceParticipant(participantOrgIds, item.course.accreditedBy)
        ? {
            label: t('common.replace'),
            icon: <MoveDownIcon color="primary" />,
            onClick: onReplaceClick,
            testId: 'attendee-replace',
          }
        : null,
      acl.canTransferParticipant(participantOrgIds)
        ? {
            label: t('common.transfer'),
            icon: <SwapHorizIcon color="primary" />,
            onClick: onTransferClick,
            testId: 'attendee-transfer',
          }
        : null,
      acl.canRemoveParticipant(participantOrgIds)
        ? {
            label: t('common.remove'),
            icon: <PersonRemoveIcon color="primary" />,
            onClick: onRemoveClick,
            testId: 'attendee-remove',
          }
        : null,
      acl.canSendCourseInformation()
        ? {
            label: t('common.resend-course-information'),
            icon: <SendIcon color="primary" />,
            onClick: onResendCourseInformationClick,
            testId: 'attendee-resend-course-information',
          }
        : null,
    ].filter(isNotNullish)
  }, [
    item.profile.organizations,
    item.course.accreditedBy,
    acl,
    t,
    onReplaceClick,
    onTransferClick,
    onRemoveClick,
    onResendCourseInformationClick,
  ])

  return actions.length ? (
    <ActionsMenu
      item={item}
      label={t('pages.course-participants.manage-attendance')}
      actions={actions}
      testId="manage-attendance"
    />
  ) : null
}
