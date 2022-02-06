import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Typography } from '@app/components/Typography'

import { DashboardCard } from '@app/pages/TrainerBase/components/TrainerDashboard/components/DashboardCard'

type MyTrainingDashboardProps = unknown

export const MyTrainingDashboard: React.FC<MyTrainingDashboardProps> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        {t('pages.my-training.dashboard.title')}
      </Typography>
      <Typography variant="body2">&nbsp;</Typography>
      <div className="flex">
        <DashboardCard
          title={t('pages.my-training.dashboard.my-upcoming-training')}
          icon="calender"
          onClick={() => navigate('upcoming-training')}
        >
          <p className="font-bold text-white text-sm">
            {t('pages.my-training.dashboard.next-course')}
          </p>
          <p className="font-light text-white text-2xl mb-4">
            3rd-4th May 2022
          </p>
          <p className="font-light text-white text-sm">
            Birchwood Academy, Wrotham, Kent
            <br />
            Positive Behaviour Training: Level Two
            <br />
            14 Attendees
          </p>
        </DashboardCard>

        <DashboardCard
          title={t('pages.my-training.common.my-certification-and-credentials')}
          icon="school"
          onClick={() => navigate('certifications')}
        >
          <p className="font-bold text-white text-sm">
            {t('pages.my-training.dashboard.latest-certification')}
          </p>
          <p className="font-light text-white text-2xl mb-4">Level One</p>
          <p className="font-light text-white text-sm">
            Passed on 17/05/20
            <br />
            Six theory modules
            <br />
            Two physical modules
          </p>
        </DashboardCard>
      </div>
      <div className="flex">
        <DashboardCard
          title={t('pages.my-training.dashboard.my-resources')}
          icon="books"
          onClick={() => navigate('resources')}
        >
          <p className="font-bold text-white text-sm">
            {t('pages.my-training.dashboard.latest-available')}
          </p>
          <p className="font-light text-white text-2xl mb-4">
            Level One Resource Kit
          </p>
          <p className="font-light text-white text-sm">
            Latest government guidance
            <br />
            How-to videos
            <br />
            Useful contacts
          </p>
        </DashboardCard>

        <DashboardCard
          title={t('pages.my-training.dashboard.my-membership')}
          icon="lightbulb"
          onClick={() => navigate('membership')}
        >
          <p className="font-bold text-white text-sm">
            {t('pages.my-training.dashboard.membership-status')}
          </p>
          <p className="font-light text-white text-2xl mb-4">
            Premium Subscriber
          </p>
          <p className="font-light text-white text-sm">
            Annual subscription
            <br />
            Renewal on 21/07/22
          </p>
        </DashboardCard>
      </div>
    </div>
  )
}
