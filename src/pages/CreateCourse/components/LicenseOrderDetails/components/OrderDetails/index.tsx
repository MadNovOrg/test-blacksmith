import { Box, Stack, styled, Typography } from '@mui/material'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'

const PRICE_PER_LICENSE = 25

type Props = {
  numberOfLicenses: number
  licenseBalance: number
}

const DetailsItemBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(2),
}))

const ItemRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

export const OrderDetails: React.FC<Props> = ({
  numberOfLicenses,
  licenseBalance,
}) => {
  const { t, _t } = useScopedTranslation(
    'pages.create-course.license-order-details'
  )

  const fullPrice = numberOfLicenses * PRICE_PER_LICENSE
  const licensesLeft =
    licenseBalance - numberOfLicenses > 0
      ? licenseBalance - numberOfLicenses
      : 0

  const licenseAllowancePrice =
    numberOfLicenses > licenseBalance
      ? licenseBalance * PRICE_PER_LICENSE
      : numberOfLicenses * PRICE_PER_LICENSE

  const vat = (fullPrice - licenseAllowancePrice) * 0.2
  const amountDue = fullPrice - licenseAllowancePrice + vat

  return (
    <Stack spacing="2px">
      <DetailsItemBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h6" mb={1}>
            {t('order-title')}
          </Typography>
          <Typography color={theme.palette.grey[600]}>
            {t('price-per-attendee', {
              price: _t('common.currency', { amount: PRICE_PER_LICENSE }),
            })}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2">{t('quantity')}</Typography>
          <Typography>{numberOfLicenses}</Typography>
        </Box>
      </DetailsItemBox>
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
            {_t('common.currency', { amount: fullPrice })}
          </Typography>
        </ItemRow>
        {licenseBalance ? (
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
              {_t('common.currency', {
                amount: licenseAllowancePrice,
              })}
            </Typography>
          </ItemRow>
        ) : null}
        {vat ? (
          <ItemRow>
            <Typography color={theme.palette.grey[600]} mt={1}>
              {t('vat')}
            </Typography>

            <Typography
              color={theme.palette.grey[600]}
              data-testid="amount-vat"
              mt={1}
            >
              {_t('common.currency', { amount: vat })}
            </Typography>
          </ItemRow>
        ) : null}
      </DetailsItemBox>
      <DetailsItemBox>
        <ItemRow>
          <Typography variant="h6">
            {t('amound-due', { currency: 'GBP' })}
          </Typography>
          <Typography variant="h6" data-testid="amount-due">
            {_t('common.currency', { amount: amountDue })}
          </Typography>
        </ItemRow>
      </DetailsItemBox>
    </Stack>
  )
}
