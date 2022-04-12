import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  AutocompleteRenderInputParams,
  AutocompleteRenderGetTagProps,
  Chip,
  AutocompleteRenderOptionState,
  Typography,
} from '@mui/material'
import React, { HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMountedState } from 'react-use'
import { useDebouncedCallback } from 'use-debounce'

import { Avatar } from '@app/components/Avatar'
import { SearchTrainerAvailability } from '@app/types'
import { noop } from '@app/util'

import { SearchTrainer, SearchTrainersSchedule } from './types'
import { useQueryTrainers } from './useQueryTrainers'

type Props = {
  courseSchedule: SearchTrainersSchedule
  placeholder?: string
  max?: number
  maxReachedPlaceholder?: string
  autoFocus?: boolean
  value?: SearchTrainer[]
  onChange?: (ev: { target: { value: SearchTrainer[] } }) => void
  matchesFilter?: (matches: SearchTrainer[]) => SearchTrainer[]
}

const T_PREFIX = 'components.searchTrainers'

export function SearchTrainers({
  courseSchedule,
  placeholder,
  max = Infinity,
  maxReachedPlaceholder,
  autoFocus = false,
  value = undefined,
  onChange = noop,
  matchesFilter = t => t,
}: Props) {
  const { t } = useTranslation()
  const isMounted = useMountedState()
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [matches, setMatches] = useState<SearchTrainer[]>([])
  const [_selected, setSelected] = useState<SearchTrainer[]>([])
  const { search } = useQueryTrainers({ schedule: courseSchedule })

  const isControlled = value != null
  const selected = isControlled ? value : _selected

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const maxReached = selected.length === max

    const maxPlaceholder =
      maxReachedPlaceholder ?? t(`${T_PREFIX}.maxReachedPlaceholder`)
    const emptyPlaceholder = placeholder ?? t(`${T_PREFIX}.placeholder`)

    return renderTextField({
      params,
      loading,
      placeholder: maxReached ? maxPlaceholder : emptyPlaceholder,
      hidden: maxReached,
      showSearchIcon: selected.length === 0,
      autoFocus,
    })
  }

  const searchTrainers = useDebouncedCallback(async (query: string) => {
    const { trainers } = await search(query)
    if (!isMounted()) return
    setMatches(matchesFilter(trainers))
    setLoading(false)
  }, 500)

  const onInputChange = useCallback(
    (ev: React.SyntheticEvent, value: string) => {
      setInputValue(value)

      if (value.trim().length >= 3) {
        setLoading(true)
        return searchTrainers(value)
      }

      setMatches([])
      setLoading(false)
    },
    [searchTrainers]
  )

  const onSelected = useCallback(
    (ev: React.SyntheticEvent, updated: SearchTrainer[]) => {
      const newSelection = updated.length <= max ? updated : selected
      if (!isControlled) setSelected(newSelection)
      onChange({ target: { value: newSelection } })
    },
    [isControlled, max, onChange, selected]
  )

  const noOptionsText = useMemo(() => {
    if (loading) return t('components.searchTrainers.loading')
    if (inputValue.trim().length >= 3)
      return t('components.searchTrainers.noResults')
    return ''
  }, [t, loading, inputValue])

  return (
    <Autocomplete
      value={selected}
      multiple={true}
      open={noOptionsText.length > 0}
      loading={loading}
      noOptionsText={noOptionsText}
      renderInput={renderInput}
      renderTags={renderSelected}
      renderOption={renderOption}
      options={matches}
      filterSelectedOptions={true}
      getOptionLabel={t => t.fullName ?? ''}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      onChange={onSelected}
      onInputChange={onInputChange}
      inputValue={inputValue}
      popupIcon={null}
      clearIcon={null}
      sx={{
        backgroundColor: '#fff',
        '.MuiAutocomplete-inputRoot': {
          padding: '5px 8px !important', // important needed to override mui styles
        },
      }}
    />
  )
}

function renderTextField({
  params,
  loading,
  placeholder,
  hidden,
  showSearchIcon,
  autoFocus,
}: {
  params: AutocompleteRenderInputParams
  loading: boolean
  placeholder?: string
  hidden: boolean
  showSearchIcon: boolean
  autoFocus: boolean
}) {
  return (
    <TextField
      {...params}
      variant="outlined"
      autoFocus={autoFocus}
      placeholder={placeholder}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            {showSearchIcon ? (
              <SearchIcon
                sx={{ color: 'grey.500' }}
                data-testid="SearchTrainers-input-icon"
              />
            ) : null}
            {params.InputProps.startAdornment /* renders the selected items */}
          </>
        ),
        endAdornment: (
          <CircularProgress
            size={20}
            variant={loading ? 'indeterminate' : 'determinate'}
          />
        ),
      }}
      inputProps={{
        ...params.inputProps,
        disabled: hidden,
        tabIndex: hidden ? -1 : 0,
        style: { fontSize: hidden ? '.8em' : 'inherit' },
        'data-testid': 'SearchTrainers-input',
      }}
    />
  )
}

function renderOption(
  props: HTMLAttributes<HTMLLIElement>,
  option: SearchTrainer,
  _state: AutocompleteRenderOptionState
) {
  return (
    <Box
      {...props}
      component="li"
      sx={{ display: 'flex', gap: 2 }}
      data-testid="SearchTrainers-option"
    >
      <Avatar size={32} src={option.avatar} name={option.fullName} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1">{option.fullName}</Typography>
        <Typography variant="body2">Principal</Typography>
      </Box>
      <TrainerAvailabilityStatus availability={option.availability} />
    </Box>
  )
}

function renderSelected(
  selected: SearchTrainer[],
  getTagProps: AutocompleteRenderGetTagProps
) {
  return selected.map((s, index) => (
    <Chip
      {...getTagProps({ index })}
      avatar={<Avatar src={s.avatar} name={s.fullName} />}
      key={s.id}
      label={s.fullName}
      disabled={false}
      data-testid="SearchTrainers-selected"
    />
  ))
}

function TrainerAvailabilityStatus({
  availability,
}: {
  availability?: SearchTrainerAvailability
}) {
  const { t } = useTranslation()

  const colors = {
    [SearchTrainerAvailability.AVAILABLE]: 'success',
    [SearchTrainerAvailability.PENDING]: 'warning',
    [SearchTrainerAvailability.EXPIRED]: 'error',
    [SearchTrainerAvailability.UNAVAILABLE]: 'default',
  } as const

  return availability ? (
    <Chip
      variant="filled"
      color={colors[availability]}
      label={t(`common.trainer-availability.${availability}`)}
    />
  ) : null
}
