import { TextField, TextFieldProps } from '@mui/material'
import React, { WheelEvent } from 'react'

export type NumericTextFieldProps = Omit<TextFieldProps, 'type' | 'onWheel'>

export const NumericTextField = React.forwardRef<
  HTMLDivElement,
  NumericTextFieldProps
>((props, ref) => {
  const numberInputOnWheelPreventChange = (
    event: WheelEvent<HTMLDivElement>,
  ) => {
    // Prevent the input value change
    const target = event.target as HTMLElement
    target.blur()

    // Prevent the page/container scrolling
    event.stopPropagation()
  }

  return (
    <TextField
      type="number"
      onWheel={numberInputOnWheelPreventChange}
      ref={ref}
      {...props}
    />
  )
})

NumericTextField.displayName = 'NumericTextField'
