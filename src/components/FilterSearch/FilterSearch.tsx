import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputProps, TextField } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'

import { noop } from '@app/util'

type Props = {
  value?: string
  onChange?: (value: string) => void
  debounce?: number
  placeholder?: string
  InputProps?: InputProps
  fullWidth?: boolean
}

export const FilterSearch: React.FC<React.PropsWithChildren<Props>> = ({
  value = '',
  onChange = noop,
  debounce = 300,
  InputProps,
  fullWidth,
  ...rest
}) => {
  const { t } = useTranslation()

  const [_value, setValue] = useQueryParam('q', withDefault(StringParam, value))
  useEffect(() => setValue(value), [value, setValue])

  const _onChange = useDebouncedCallback(onChange, debounce)
  useEffect(() => {
    if (value !== _value) _onChange(_value)
  }, [_value, _onChange, value])

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setValue(ev.target.value),
    [setValue]
  )
  const handleClear = useCallback(() => setValue(''), [setValue])

  return (
    <TextField
      type="text"
      placeholder={t('common.search')}
      value={_value}
      variant="standard"
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
