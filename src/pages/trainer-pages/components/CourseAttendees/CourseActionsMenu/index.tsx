import MoveDownIcon from '@mui/icons-material/MoveDown'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { ActionsMenu } from '@app/components/ActionsMenu'
import { useAuth } from '@app/context/auth'
import { isNotNullish } from '@app/util'

type Props<T> = {
  onReplaceClick: (item: T) => void
  onTransferClick: (item: T) => void
  onRemoveClick: (item: T) => void
  item: T
}

export const CourseActionsMenu = <T,>({
  onRemoveClick,
  onReplaceClick,
  onTransferClick,
  item,
}: Props<T>) => {
  const { acl } = useAuth()
  const { t } = useTranslation()

  const actions = useMemo(() => {
    return [
      acl.canReplaceParticipant()
        ? {
            label: t('common.replace'),
            icon: <MoveDownIcon color="primary" />,
            onClick: onReplaceClick,
          }
        : null,
      acl.canTransferParticipant()
        ? {
            label: t('common.transfer'),
            icon: <SwapHorizIcon color="primary" />,
            onClick: onTransferClick,
          }
        : null,
      acl.canRemoveParticipant()
        ? {
            label: t('common.remove'),
            icon: <PersonRemoveIcon color="primary" />,
            onClick: onRemoveClick,
          }
        : null,
    ].filter(isNotNullish)
  }, [acl, t, onReplaceClick, onTransferClick, onRemoveClick])

  return actions.length ? (
    <ActionsMenu
      item={item}
      label={t('pages.course-participants.manage-attendance')}
      actions={actions}
      data-testid="manage-attendance"
    />
  ) : null
}
