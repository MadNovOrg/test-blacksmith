import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  InputAdornment,
  TextField,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseLevel } from '@app/types'

type Props = {
  value: CourseLevel[]
  onChange: (ev: { target: { value: CourseLevel[] } }) => void
}

export const SelectLevels: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const placeholder = value.length
    ? ''
    : t('components.selectLevels.placeholder')

  const levels = Object.values(CourseLevel)

  const onSelected = (ev: React.SyntheticEvent, selected: CourseLevel[]) => {
    onChange({ target: { value: selected } })
  }

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const startAdornment = (
      <>
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
        {params.InputProps.startAdornment /* renders the selected items */}
      </>
    )

    return (
      <TextField
        {...params}
        variant="filled"
        hiddenLabel
        placeholder={placeholder}
        InputProps={{ ...params.InputProps, startAdornment }}
        sx={{ '.MuiFilledInput-root': { padding: 1 } }}
      />
    )
  }

  return (
    <Autocomplete
      multiple={true}
      value={value}
      options={levels}
      onChange={onSelected}
      disableClearable={true}
      renderInput={renderInput}
      data-testid="SelectLevels"
    />
  )
}
