import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type MyResourcesProps = unknown

export const MyResources: React.FC<MyResourcesProps> = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
          {t('pages.my-training.resources.title')}
        </div>
      </div>
    </div>
  )
}
