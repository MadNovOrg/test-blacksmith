import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

import { DetailsItemBox, ItemRow } from '@app/components/DetailsItemRow'
import { useAuth } from '@app/context/auth'
import { useCurrencies } from '@app/hooks/useCurrencies'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'
import { getPricePerLicence } from '@app/util'

type Props = {
  numberOfLicenses: number
  licensesBalance: number
  vat: number
  gst: number
  subtotal: number
  amountDue: number
  allowancePrice: number
  residingCountry?: string
}

export const OrderDetails: React.FC<React.PropsWithChildren<Props>> = ({
  numberOfLicenses,
  licensesBalance,
  vat,
  gst,
  subtotal,
  amountDue,
  allowancePrice,
  residingCountry,
}) => {
  const {
    acl: { isAustralia },
  } = useAuth()
  const { t, _t } = useScopedTranslation(
    'pages.create-course.license-order-details',
  )
  const { defaultCurrency, currencyAbbreviations } =
    useCurrencies(residingCountry)

  const currencyAbbreviation = currencyAbbreviations[defaultCurrency]

  const licensesLeft =
    licensesBalance - numberOfLicenses >= 0
      ? licensesBalance - numberOfLicenses
      : 0

  const taxType = isAustralia() ? _t('common.gst') : _t('common.vat')
  const taxAmount = isAustralia() ? gst : vat

  return (
    <Stack spacing="2px">
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
      {amountDue > 0 ? (
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
          {licensesBalance ? (
            <ItemRow>
              <Typography color={theme.palette.grey[600]}>
                {t('license-allowance', { balance: licensesLeft })}
              </Typography>
              <Typography
                color={theme.palette.grey[600]}
                mb={1}
                data-testid="amount-allowance"
              >
                -
                {_t('common.amount-with-currency', {
                  amount: allowancePrice.toFixed(2),
                  currency: currencyAbbreviation,
                })}
              </Typography>
            </ItemRow>
          ) : null}
          {vat ? (
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
            {t('amound-due', { currency: 'GBP' })}
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
