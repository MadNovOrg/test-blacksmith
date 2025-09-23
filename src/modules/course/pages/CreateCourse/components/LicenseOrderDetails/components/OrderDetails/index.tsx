import { Box, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'

import { DetailsItemBox, ItemRow } from '@app/components/DetailsItemRow'
import { useAuth } from '@app/context/auth'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { ResourcePacksOptions } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/types'
import { getResourcePacksTypeOptionLabels } from '@app/modules/course/components/CourseForm/components/ResourcePacksTypeSection/utils'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import theme from '@app/theme'
import { ValidCourseInput } from '@app/types'
import { getPricePerLicence, getResourcePackPrice } from '@app/util'

import {
  calculateGo1LicenseCost,
  calculateResourcePackCost,
} from '../../../../utils'

type Props = {
  courseData: Pick<
    ValidCourseInput,
    | 'blendedLearning'
    | 'courseLevel'
    | 'resourcePacksType'
    | 'type'
    | 'deliveryType'
    | 'reaccreditation'
    | 'organization'
    | 'priceCurrency'
  >
  go1LicensesCost?: ReturnType<typeof calculateGo1LicenseCost>
  numberOfLicenses: number
  numberOfResourcePacks?: number
  residingCountry?: string
  resourcePacksCost?: ReturnType<typeof calculateResourcePackCost>
}

export const OrderDetails: React.FC<React.PropsWithChildren<Props>> = ({
  courseData,
  go1LicensesCost,
  numberOfLicenses,
  numberOfResourcePacks,
  residingCountry,
  resourcePacksCost,
}) => {
  const {
    acl: { isAustralia, isUK },
  } = useAuth()
  const { t, _t } = useScopedTranslation(
    'pages.create-course.license-order-details',
  )

  const { data: resourcePacksPricing } = useResourcePackPricing({
    course_type: courseData.type,
    course_level: courseData.courseLevel,
    course_delivery_type: courseData.deliveryType,
    reaccreditation: courseData.reaccreditation,
    organisation_id: courseData.organization?.id,
    resourcePacksOptions: courseData?.resourcePacksType as ResourcePacksOptions,
  })

  const rpCost = getResourcePackPrice(
    resourcePacksPricing?.resource_packs_pricing[0],
    courseData.priceCurrency,
  )

  const resourcePacksTypeOptions = useMemo(
    () => getResourcePacksTypeOptionLabels(_t),
    [_t],
  )

  const { anzAvailableCurrencies, defaultCurrency, currencyAbbreviations } =
    useCurrencies(residingCountry)

  const currencyAbbreviation = currencyAbbreviations[defaultCurrency]

  const taxType = isAustralia() ? _t('common.gst') : _t('common.vat')

  const subtotal = useMemo(() => {
    return (go1LicensesCost?.subtotal ?? 0) + (resourcePacksCost?.subtotal ?? 0)
  }, [go1LicensesCost?.subtotal, resourcePacksCost?.subtotal])

  const allowance = useMemo(() => {
    return (
      (go1LicensesCost?.allowancePrice ?? 0) +
      (resourcePacksCost?.allowancePrice ?? 0)
    )
  }, [go1LicensesCost?.allowancePrice, resourcePacksCost?.allowancePrice])

  const taxAmount = useMemo(() => {
    if (isUK()) return go1LicensesCost?.vat ?? 0

    return (go1LicensesCost?.gst ?? 0) + (resourcePacksCost?.gst ?? 0)
  }, [go1LicensesCost?.gst, go1LicensesCost?.vat, isUK, resourcePacksCost?.gst])

  const amountDue = useMemo(
    () =>
      (go1LicensesCost?.amountDue ?? 0) + (resourcePacksCost?.amountDue ?? 0),
    [go1LicensesCost?.amountDue, resourcePacksCost?.amountDue],
  )

  return (
    <Stack spacing="2px">
      {courseData?.blendedLearning ? (
        <DetailsItemBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">{t('order-title')}</Typography>
            {amountDue > 0 ? (
              <Typography color={theme.palette.grey[600]} mt={1}>
                {t('price-per-attendee', {
                  price: _t('common.amount-with-currency', {
                    amount: getPricePerLicence({
                      isAustralia: isAustralia(),
                      residingCountry,
                    }),
                    currency: currencyAbbreviation,
                  }),
                })}
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2">{t('quantity')}</Typography>
            <Typography>{numberOfLicenses}</Typography>
          </Box>
        </DetailsItemBox>
      ) : null}

      {resourcePacksCost ? (
        <DetailsItemBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">
              Resources pack -{' '}
              {
                resourcePacksTypeOptions[
                  courseData?.resourcePacksType as ResourcePacksOptions
                ]
              }
            </Typography>
            {resourcePacksCost.amountDue > 0 ? (
              <Typography color={theme.palette.grey[600]} mt={1}>
                {t('price-per-attendee', {
                  price: _t('common.amount-with-currency', {
                    amount: rpCost,
                    currency: currencyAbbreviation,
                  }),
                })}
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2">{t('quantity')}</Typography>
            <Typography>{numberOfResourcePacks}</Typography>
          </Box>
        </DetailsItemBox>
      ) : null}

      {subtotal - allowance > 0 ? (
        <DetailsItemBox>
          <ItemRow>
            <Typography color={theme.palette.grey[600]} mb={1}>
              {t('subtotal')}
            </Typography>
            <Typography
              color={theme.palette.grey[600]}
              data-testid="amount-subtotal"
              mb={1}
            >
              {_t('common.amount-with-currency', {
                amount: subtotal.toFixed(2),
                currency: currencyAbbreviation,
              })}
            </Typography>
          </ItemRow>
          {(go1LicensesCost?.allowancePrice ?? 0) > 0 &&
          (go1LicensesCost?.allowancePrice ?? 0) !==
            (go1LicensesCost?.subtotal ?? 0) ? (
            <ItemRow>
              <Typography color={theme.palette.grey[600]}>
                {t('license-allowance', { balance: 0 })}
              </Typography>
              <Typography
                color={theme.palette.grey[600]}
                mb={1}
                data-testid="amount-allowance"
              >
                -
                {_t('common.amount-with-currency', {
                  amount: go1LicensesCost?.allowancePrice.toFixed(2),
                  currency: currencyAbbreviation,
                })}
              </Typography>
            </ItemRow>
          ) : null}
          {resourcePacksCost &&
          resourcePacksCost.allowancePrice > 0 &&
          resourcePacksCost.allowancePrice !== resourcePacksCost.subtotal ? (
            <ItemRow>
              <Typography color={theme.palette.grey[600]}>
                {t('resource-pack-allowance', { balance: 0 })}
              </Typography>
              <Typography
                color={theme.palette.grey[600]}
                mb={1}
                data-testid="amount-allowance"
              >
                -
                {_t('common.amount-with-currency', {
                  amount: resourcePacksCost.allowancePrice.toFixed(2),
                  currency: currencyAbbreviation,
                })}
              </Typography>
            </ItemRow>
          ) : null}
          {taxAmount ? (
            <ItemRow>
              <Typography color={theme.palette.grey[600]} mt={1}>
                {taxType}
              </Typography>

              <Typography
                color={theme.palette.grey[600]}
                data-testid="amount-vat"
                mt={1}
              >
                {_t('common.amount-with-currency', {
                  amount: taxAmount.toFixed(2),
                  currency: currencyAbbreviation,
                })}
              </Typography>
            </ItemRow>
          ) : null}
        </DetailsItemBox>
      ) : null}
      <DetailsItemBox>
        <ItemRow>
          <Typography variant="h6">
            {t('amount-due', {
              currency: isAustralia()
                ? anzAvailableCurrencies[
                    defaultCurrency as keyof typeof anzAvailableCurrencies
                  ]
                : 'GBP',
            })}
          </Typography>
          <Typography variant="h6" data-testid="amount-due">
            {_t('common.amount-with-currency', {
              amount: amountDue.toFixed(2),
              currency: currencyAbbreviation,
            })}
          </Typography>
        </ItemRow>
      </DetailsItemBox>
    </Stack>
  )
}
