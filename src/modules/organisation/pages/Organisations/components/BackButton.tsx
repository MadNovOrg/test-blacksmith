import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { BackButton } from '@app/components/BackButton'

type LocationState = {
  backTo?: string
}

export const OrganisationsBackButton = () => {
  const location = useLocation()
  const locationState = location.state as LocationState

  const { t } = useTranslation()

  const to = locationState?.backTo || '/organisations/all'
  const label = locationState?.backTo?.includes('admin')

  return (
    <BackButton
      label={
        label
          ? t('pages.admin.back-to-settings')
          : t('pages.admin.organizations.back-to-all-organisations')
      }
      to={to}
    />
  )
}
