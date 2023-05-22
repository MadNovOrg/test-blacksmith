import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'

export const NoExceptionsDialog: React.FC<
  ComponentProps<typeof Dialog>
> = props => {
  const { t } = useTranslation('pages', {
    keyPrefix: 'create-course.exceptions',
  })

  return (
    <Dialog title={t('no-exceptions-title')} {...props}>
      {t('no-exceptions-message')}
    </Dialog>
  )
}
