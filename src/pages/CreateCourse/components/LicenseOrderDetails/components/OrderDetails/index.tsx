import { Box, Stack, styled, Typography } from '@mui/material'
import React from 'react'

import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import theme from '@app/theme'

const PRICE_PER_LICENSE = 25

type Props = {
  numberOfLicenses: number
  licensesBalance: number
  vat: number
  subtotal: number
  amountDue: number
  allowancePrice: number
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
  licensesBalance,
  vat,
  subtotal,
  amountDue,
  allowancePrice,
}) => {
  const { t, _t } = useScopedTranslation(
    'pages.create-course.license-order-details'
  )

  const licensesLeft =
    licensesBalance - numberOfLicenses >= 0
      ? licensesBalance - numberOfLicenses
      : 0

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
                price: _t('common.currency', { amount: PRICE_PER_LICENSE }),
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
              {_t('common.currency', { amount: subtotal })}
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
                {_t('common.currency', {
                  amount: allowancePrice,
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
      ) : null}
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
