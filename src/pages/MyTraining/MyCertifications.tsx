import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Icon } from '@app/components/Icon'
import { Typography } from '@app/components/Typography'

import { CertificationDetails } from '@app/pages/components/CertificationDetails'

type MyCertificationsProps = unknown

export const MyCertifications: React.FC<MyCertificationsProps> = () => {
  const { t } = useTranslation()

  const certification = {
    title: 'Positive Behaviour Training: Level One',
    passDate: new Date(2020, 4, 17),
    expirationDate: new Date(2023, 4, 17),
    modules: Array.from({ length: 10 }, (_, i) => ({
      module: {
        name: `Positive Behaviour Theory Module ${i}`,
      },
    })),
  }

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
          {t('pages.my-training.common.my-certification-and-credentials')}
        </div>

        <CertificationDetails certification={certification} />
      </div>
    </div>
  )
}
