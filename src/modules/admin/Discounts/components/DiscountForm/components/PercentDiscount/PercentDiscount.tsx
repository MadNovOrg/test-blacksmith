import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  FormHelperText,
  Typography,
} from '@mui/material'
import { t } from 'i18next'
import React, { FC, MutableRefObject } from 'react'
import { FormState, UseFormRegister } from 'react-hook-form'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'

import { AMOUNT_PRESETS, FormInputs } from '../../helpers'

type Props = {
  amountPreset: string
  amountRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  register: UseFormRegister<FormInputs>
  formState: FormState<FormInputs>
  amountRef: MutableRefObject<HTMLInputElement | undefined>
  discountType: Promo_Code_Type_Enum
  disabled?: boolean
}

export const PercentDiscount: FC<Props> = ({
  amountPreset,
  amountRadioChange,
  disabled,
  register,
  formState,
  amountRef,
  discountType,
}) => {
  if (discountType !== Promo_Code_Type_Enum.Percent) return
  return (
    <>
      <Box display="flex" alignItems="center">
        <TextField
          select
          hiddenLabel
          variant="filled"
          value={amountPreset}
          onChange={amountRadioChange}
          sx={{ minWidth: 130 }}
          data-testid="percent-shortcuts"
          disabled={disabled}
        >
          <MenuItem
            value={AMOUNT_PRESETS.FIVE}
            data-testid={`percent-shortcut-${AMOUNT_PRESETS.FIVE}`}
          >
            5%
          </MenuItem>
          <MenuItem
            value={AMOUNT_PRESETS.TEN}
            data-testid={`percent-shortcut-${AMOUNT_PRESETS.TEN}`}
          >
            10%
          </MenuItem>
          <MenuItem
            value={AMOUNT_PRESETS.FIFTEEN}
            data-testid={`percent-shortcut-${AMOUNT_PRESETS.FIFTEEN}`}
          >
            15%
          </MenuItem>
          <MenuItem
            value={AMOUNT_PRESETS.OTHER}
            data-testid={`percent-shortcut-${AMOUNT_PRESETS.OTHER}`}
          >
            {t('other')}
          </MenuItem>
        </TextField>

        <TextField
          inputRef={input => (amountRef.current = input)}
          hiddenLabel
          placeholder="Amount"
          variant="filled"
          inputProps={{
            inputMode: 'numeric',
            style: { textAlign: 'right' },
            'data-testid': 'fld-amount-percent',
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register('amount')}
          error={!!formState.errors.amount}
          sx={{
            ml: 2,
            maxWidth: 70,
            opacity: amountPreset === AMOUNT_PRESETS.OTHER ? 1 : 0,
          }}
          disabled={disabled}
        />

        <FormHelperText error sx={{ ml: 2 }}>
          {formState.errors.amount?.message ?? ' '}
        </FormHelperText>
      </Box>
      <Typography variant="body2" mt={1}>
        {t('pages.promoCodes.fld-amount-percent-hint')}
      </Typography>
    </>
  )
}
