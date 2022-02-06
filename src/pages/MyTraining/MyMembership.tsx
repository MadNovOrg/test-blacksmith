import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Icon } from '@app/components/Icon'
import { Typography } from '@app/components/Typography'

type MyMembershipProps = unknown

export const MyMembership: React.FC<MyMembershipProps> = () => {
  const { t } = useTranslation()

  return (
    <div className="flex">
      <div className="w-48 p-8 hidden sm:flex sm:flex-col">
        <div className="flex mb-8">
          <NavLink to=".." className="flex flex-row">
            <Icon name="arrow-left" />
            <Typography className="ml-2">{t('common.back')}</Typography>
          </NavLink>
        </div>
      </div>

      <div className="p-8">
        <div className="pb-8 font-light text-2xl sm:text-4xl">
          {t('pages.my-training.membership.title')}
        </div>
      </div>
    </div>
  )
}
