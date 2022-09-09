import { Select, SelectChangeEvent, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export type DropdownMenuItem<T extends string> = {
  key: T
  i18nKey: string
}

interface DropdownMenuProps<T extends string> {
  value: DropdownMenuItem<T>
  items: DropdownMenuItem<T>[]
  onChange: (event: SelectChangeEvent<T>) => void
}

export const DropdownMenu = <T extends string>({
  value,
  items,
  onChange,
}: DropdownMenuProps<T>): JSX.Element => {
  const { t } = useTranslation()
  const selected = value || items[0]

  useEffect(() => {
    if (value !== selected) {
      const ev = { target: { value: selected.key } }
      onChange(ev as SelectChangeEvent<T>)
    }
  }, [onChange, value, selected])

  return (
    <Select value={selected.key} onChange={onChange} fullWidth>
      {items.map(i => (
        <MenuItem key={i.key as string} value={i.key}>
          {t(i.i18nKey)}
        </MenuItem>
      ))}
    </Select>
  )
}
