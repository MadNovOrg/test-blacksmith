import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CanApplyPromoCodeQuery,
  CanApplyPromoCodeQueryVariables,
  PromoCodeOutput,
} from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { QUERY as CAN_APPLY_PROMO_CODE } from '@app/queries/promo-codes/can-apply-promo-code'

import type { Discounts } from '../BookingContext'

type Props = {
  codes: string[]
  discounts: Discounts
  courseId: number
  onAdd: (_: PromoCodeOutput) => void
  onRemove: (_: string) => void
}

export const PromoCode: React.FC<Props> = ({
  codes,
  discounts,
  courseId,
  onAdd,
  onRemove,
}) => {
  const { t } = useTranslation()
  const [adding, setAdding] = useState(false)
  const [value, setValue] = useState('')
  const [applyError, setApplyError] = useState('')
  const fetcher = useFetcher()

  const onChange = useCallback(
    e => {
      setValue(e.target.value)

      if (applyError !== '') {
        setApplyError('')
      }
    },
    [applyError]
  )

  const handleCancel = () => {
    setAdding(false)
  }

  const handleApply = useCallback(async () => {
    try {
      const {
        canApplyPromoCode: { result },
      } = await fetcher<
        CanApplyPromoCodeQuery,
        CanApplyPromoCodeQueryVariables
      >(CAN_APPLY_PROMO_CODE, { input: { code: value.trim(), courseId } })

      if (!result) {
        throw new Error('Code cannot be applied')
      }

      if (!codes.find(c => c === result.code)) {
        onAdd(result)
      }
      setValue('')
      setAdding(false)
    } catch (err) {
      console.error(err)
      setApplyError(t('invalid-promo-code'))
    }
  }, [codes, courseId, fetcher, onAdd, t, value])

  return (
    <Stack>
      <Box>
        {codes.map(c => (
          <Box
            key={c}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                color="grey.700"
                textTransform="uppercase"
              >
                {t('code')}: {c}
              </Typography>
              <LoadingButton
                loading={false}
                variant="text"
                color="primary"
                size="small"
                sx={{ ml: 2 }}
                onClick={() => onRemove(c)}
              >
                {t('remove')}
              </LoadingButton>
            </Box>
            <Typography variant="body1" color="grey.700">
              - {t('currency', { amount: discounts[c]?.amountCurrency ?? 0 })}
            </Typography>
          </Box>
        ))}
      </Box>

      {adding && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box pr={2} flex={1}>
            <TextField
              autoFocus
              variant="filled"
              label={t('enter-promo-code')}
              placeholder={t('promo-code')}
              fullWidth
              sx={{ bgcolor: 'grey.100' }}
              onChange={onChange}
              value={value}
              error={applyError !== ''}
            />
            {applyError !== '' ? (
              <FormHelperText>{applyError}</FormHelperText>
            ) : null}
          </Box>
          {value.trim().length ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleApply}
            >
              {t('apply')}
            </Button>
          ) : (
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={handleCancel}
            >
              {t('cancel')}
            </Button>
          )}
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" mr={-1} mt={2}>
        <Button
          size="small"
          variant="text"
          color="primary"
          sx={{ fontWeight: '600' }}
          onClick={() => setAdding(true)}
        >
          {t('pages.book-course.apply-promo')}
        </Button>
      </Box>
    </Stack>
  )
}
