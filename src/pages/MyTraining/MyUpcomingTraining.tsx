import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Icon } from '@app/components/Icon'
import { Typography } from '@app/components/Typography'

type MyUpcomingTrainingProps = unknown

export const MyUpcomingTraining: React.FC<MyUpcomingTrainingProps> = () => {
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
          {t('pages.my-training.upcoming-training.title')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div>{t('pages.upcoming-training.course-upcoming')}:</div>
            <div className="py-2 text-2xl">
              Positive Behaviour Training: Level Two
            </div>
            <div className="font-bold">
              {`${t('pages.upcoming-training.course-takes-place-on')} 22/05/22`}
            </div>
            <div>Birchwood Academy, Wrotham, Kent</div>

            <div className="pt-4 w-full grid grid-col-1 gap-2">
              <div>Module 1</div>
              <div>Module 2</div>
              <div>Module 3</div>
              <div>Module 4</div>
              <div>Module 5</div>
              <div>Module 6</div>
              <div>Module 7</div>
            </div>
          </div>
          <div className="pt-16 lg:pt-0 lg:pl-32">
            <div className="flex flex-col gap-4">
              <div>{t('pages.upcoming-training.your-status')}:</div>
              <div className="flex justify-between">
                <span>
                  {t('pages.upcoming-training.registration-complete')}
                </span>
                <Icon name="checkmark" className="text-lime-500" />
              </div>
              <div className="flex justify-between">
                <span>
                  {t('pages.upcoming-training.health-check-complete')}
                </span>
                <Icon name="checkmark" className="text-lime-500" />
              </div>
              <div className="flex justify-between">
                <span>{t('pages.upcoming-training.dbs-check-complete')}</span>
                <Icon name="checkmark" className="text-lime-500" />
              </div>
              <button className="btn tertiary">
                {t('pages.upcoming-training.change-availability')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
