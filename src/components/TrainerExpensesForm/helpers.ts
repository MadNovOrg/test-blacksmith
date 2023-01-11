import { FieldErrors } from 'react-hook-form'

import { DropdownMenuItem } from '@app/components/DropdownMenu'
import { ExpensesInput, NonNullish, TransportMethod } from '@app/types'

type ExpensesErrors = FieldErrors<ExpensesInput>

export function transportMethodToDropdownItem(
  tm: TransportMethod
): DropdownMenuItem<TransportMethod> {
  return {
    key: tm,
    i18nKey: `pages.create-course.trainer-expenses.${tm}`,
  }
}

function isTransportError(
  error: NonNullish<ExpensesErrors['transport']>[0],
  field: string
): field is
  | 'accommodationCost'
  | 'flightDays'
  | 'accommodationNights'
  | 'accommodationCost' {
  return Boolean(error && field in error)
}

function isMiscellaneousError(
  error: NonNullish<ExpensesErrors['miscellaneous']>[0],
  field: string
): field is 'name' | 'value' {
  return Boolean(error && field in error)
}

export function getError(
  errors: ExpensesErrors,
  idx: number,
  field: string
): string | null | undefined {
  let message: string | null | undefined = null

  if (!errors) {
    return message
  }

  const transportError = errors.transport && errors.transport[idx]
  const miscellaneousError = errors.miscellaneous && errors.miscellaneous[idx]

  if (transportError && isTransportError(transportError, field)) {
    message = transportError[field]?.message
  } else if (
    miscellaneousError &&
    isMiscellaneousError(miscellaneousError, field)
  ) {
    message = miscellaneousError[field]?.message
  }

  return message
}
