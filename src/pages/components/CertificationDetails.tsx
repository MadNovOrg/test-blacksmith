import CheckIcon from '@mui/icons-material/Check'
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import { format, formatDistanceToNow } from 'date-fns'
import QRCode from 'qrcode.react'
import React from 'react'
import { useTranslation } from 'react-i18next'

type CertificationDetailsProps = {
  // TODO replace mock with proper model when it's ready
  certification: {
    title: string
    passDate: Date
    expirationDate: Date
    modules: { module: { name: string } }[]
  }
}

export const CertificationDetails: React.FC<CertificationDetailsProps> = ({
  certification,
}) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <div>{t('components.certification-details.certification-passed')}:</div>
        <div className="py-2 text-2xl">{certification.title}</div>
        <div>
          <span className="font-bold">
            {t('components.certification-details.course-passed-on')}{' '}
            {format(certification.passDate, 'dd/MM/yyyy')}
          </span>{' '}
          - {formatDistanceToNow(certification.expirationDate)}{' '}
          {t('components.certification-details.remaining')}
        </div>

        <div className="pt-4">
          {certification.modules.map(courseModule => (
            <div
              key={courseModule.module.name}
              className="py-4 w-full border-b border-grey flex place-content-between"
            >
              <span>{courseModule.module.name}</span>
              <CheckIcon />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-16 lg:pt-0 lg:pl-32">
        <div>{t('components.certification-details.digital-certificate')}:</div>
        <div className="py-8">
          <QRCode value="https://www.teamteach.co.uk/" size={256} />
        </div>
        <div className="mt-4">
          <div>{t('components.certification-details.dbs-certificate')}:</div>
          <div className="flex">
            <PdfIcon />
            <span>
              {t('components.certification-details.view-or-download-here')}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div>{t('components.certification-details.feedback')}:</div>
          <div className="flex">
            <PdfIcon />
            <span>
              {t('components.certification-details.view-or-download-here')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
