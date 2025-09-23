import { Box, TextField, FormHelperText } from '@mui/material'
import { FC, MutableRefObject } from 'react'
import { FormState, UseFormRegister } from 'react-hook-form'

import { Promo_Code_Type_Enum } from '@app/generated/graphql'

import { FormInputs } from '../../helpers'
type Props = {
  disabled?: boolean
  amountInputRef: MutableRefObject<HTMLInputElement | undefined>
  register: UseFormRegister<FormInputs>
  formState: FormState<FormInputs>
  discountType: Promo_Code_Type_Enum
}
export const FreePlacesDiscount: FC<Props> = ({
  amountInputRef,
  register,
  formState,
  disabled,
  discountType,
}) => {
  if (discountType !== Promo_Code_Type_Enum.FreePlaces) return
  return (
    <Box display="flex" alignItems="center">
      <TextField
        inputRef={input => (amountInputRef.current = input)}
        hiddenLabel
        placeholder="Free places"
        variant="filled"
        inputProps={{
          inputMode: 'numeric',
          'data-testid': 'fld-amount-freeplaces',
        }}
        {...register('amount')}
        error={!!formState.errors.amount}
        sx={{ maxWidth: 130 }}
        disabled={disabled}
      />
      <FormHelperText error sx={{ ml: 2 }}>
        {formState.errors.amount?.message ?? ' '}
      </FormHelperText>
    </Box>
  )
}
