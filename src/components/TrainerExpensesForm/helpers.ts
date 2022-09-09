import { FieldErrors } from 'react-hook-form'

import { DropdownMenuItem } from '@app/components/DropdownMenu'
import { TransportMethod } from '@app/types'

export function transportMethodToDropdownItem(
  tm: TransportMethod
): DropdownMenuItem<TransportMethod> {
  return {
    key: tm,
    i18nKey: `pages.create-course.trainer-expenses.${tm}`,
  }
}

export function getError(
  errors: FieldErrors,
  idx: number,
  field: string
): string | null {
  let message: string | null = null

  if (!errors) {
    return message
  }

  if (
    errors.transport &&
    errors.transport[idx] &&
    errors.transport[idx][field]
  ) {
    message = errors.transport[idx][field].message
  } else if (
    errors.miscellaneous &&
    errors.miscellaneous[idx] &&
    errors.miscellaneous[idx][field]
  ) {
    message = errors.miscellaneous[idx][field].message
  } else if (errors[field]) {
    message = errors[field].message
  }

  return message
}
