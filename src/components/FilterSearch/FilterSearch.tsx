import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputProps, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'

import { noop } from '@app/util'

type Props = {
  value?: string
  onChange?: (value: string) => void
  debounce?: number
  placeholder?: string
  InputProps?: InputProps
  fullWidth?: boolean
}

export const FilterSearch: React.FC<Props> = ({
  value = '',
  onChange = noop,
  debounce = 300,
  InputProps,
  fullWidth,
  ...rest
}) => {
  const { t } = useTranslation()

  const [_value, setValue] = useState(value)
  useEffect(() => setValue(value), [value])

  const _onChange = useDebouncedCallback(onChange, debounce)
  useEffect(() => {
    if (value !== _value) _onChange(_value)
  }, [_value, _onChange, value])

  const handleChange = useCallback(ev => setValue(ev.target.value), [])
  const handleClear = useCallback(() => setValue(''), [])

  return (
    <TextField
      type="text"
      placeholder={t('common.search')}
      value={_value}
      variant="filled"
      onChange={handleChange}
      inputProps={{ 'data-testid': 'FilterSearch-Input' }}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: 'grey.500', mr: 0.5 }} />,
        endAdornment: (
          <IconButton
            size="small"
            onClick={handleClear}
            disabled={!value}
            sx={{ opacity: !value ? 0 : 1 }}
            data-testid="FilterSearch-Clear"
          >
            <ClearIcon sx={{ fontSize: '1em' }} />
          </IconButton>
        ),
        ...InputProps,
      }}
      {...rest}
    />
  )
}
