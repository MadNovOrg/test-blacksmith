import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import { Button } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type MyUpcomingTrainingProps = unknown

export const MyUpcomingTraining: React.FC<MyUpcomingTrainingProps> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex">
      <div className="w-48 p-8 hidden sm:flex sm:flex-col">
        <div className="flex mb-8">
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
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
                <CheckIcon />
              </div>
              <div className="flex justify-between">
                <span>
                  {t('pages.upcoming-training.health-check-complete')}
                </span>
                <CheckIcon />
              </div>
              <div className="flex justify-between">
                <span>{t('pages.upcoming-training.dbs-check-complete')}</span>
                <CheckIcon />
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
