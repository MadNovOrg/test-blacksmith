import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  InputAdornment,
  TextField,
} from '@mui/material'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Course_Level_Enum } from '@app/generated/graphql'

type Props = {
  value: Course_Level_Enum[]
  onChange: (ev: { target: { value: Course_Level_Enum[] } }) => void
}

export const SelectLevels: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const placeholder = value.length
    ? ''
    : t('components.selectLevels.placeholder')

  const isBSEnabled = !!useFeatureFlagEnabled('level-one-bs')

  const levels = isBSEnabled
    ? Object.values(Course_Level_Enum)
    : Object.values(Course_Level_Enum).filter(
        level => level !== Course_Level_Enum.Level_1Bs,
      )

  const onSelected = (
    ev: React.SyntheticEvent,
    selected: Course_Level_Enum[],
  ) => {
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
      options={levels.sort((a, b) => a.localeCompare(b))}
      onChange={onSelected}
      disableClearable={true}
      renderInput={renderInput}
      data-testid="SelectLevels"
      getOptionLabel={option => t(`course-levels.${option}`) || option}
    />
  )
}
