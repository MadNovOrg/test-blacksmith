import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  InputAdornment,
  TextField,
} from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Course_Level_Enum } from '@app/generated/graphql'

import { CLOSED_COURSE_LEVELS } from '../../utils'

type Props = {
  value: Course_Level_Enum[]
  onChange: (ev: { target: { value: Course_Level_Enum[] } }) => void
}

export const SelectLevels: React.FC<React.PropsWithChildren<Props>> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const { acl } = useAuth()
  const isUKRegion = acl.isUK()
  const placeholder = value.length
    ? ''
    : t('components.selectLevels.placeholder')

  const levels = Object.values(Course_Level_Enum).filter(
    level => !CLOSED_COURSE_LEVELS.includes(level),
  )

  const filteredLevels = useMemo(() => {
    if (isUKRegion) {
      return levels.filter(l => l !== Course_Level_Enum.FoundationTrainer)
    }
    return levels
  }, [isUKRegion, levels])
  const sortedLevels = [...filteredLevels].sort((a, b) => a.localeCompare(b))

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
      options={sortedLevels}
      onChange={onSelected}
      disableClearable={true}
      renderInput={renderInput}
      data-testid="SelectLevels"
      getOptionLabel={option => t(`course-levels.${option}`) || option}
    />
  )
}
