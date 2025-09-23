import { Alert, Link } from '@mui/material'
import { FC, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { useAuth } from '@app/context/auth'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { blendedLearningLicensePrice } from '@app/util'

export const BlendedLearningCostAlert: FC<{
  residingCountry: string
}> = ({ residingCountry }) => {
  const { t } = useTranslation()
  const { isAustraliaCountry } = useWorldCountries()
  const gstWording = isAustraliaCountry(residingCountry) ? ' (plus GST)' : ''

  const {
    acl: { isAustralia },
  } = useAuth()
  const { defaultCurrency, currencyAbbreviations } =
    useCurrencies(residingCountry)

  const alertMessage = useMemo(() => {
    if (isAustralia()) {
      return (
        <Trans
          i18nKey="components.course-form.blended-learning-price-label-anz"
          components={[
            <Link
              underline="always"
              key="contact"
              href={`mailto:${import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS_ANZ}`}
            />,
          ]}
          values={{
            currency: currencyAbbreviations[defaultCurrency],
            price:
              blendedLearningLicensePrice[
                defaultCurrency as keyof typeof blendedLearningLicensePrice
              ],
            gstWording,
            email: import.meta.env.VITE_TT_INFO_EMAIL_ADDRESS_ANZ,
          }}
        />
      )
    }
    return t('components.course-form.blended-learning-price-label', {
      currency: currencyAbbreviations[defaultCurrency],
      price:
        blendedLearningLicensePrice[
          defaultCurrency as keyof typeof blendedLearningLicensePrice
        ],
    })
  }, [isAustralia, t, currencyAbbreviations, defaultCurrency, gstWording])

  return (
    <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
      {alertMessage}
    </Alert>
  )
}
