import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import React, { HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'

import { Avatar } from '@app/components/Avatar'
import { useAuth } from '@app/context/auth'
import {
  BildStrategy,
  Course_Level_Enum,
  CourseLevel,
  Course_Type_Enum,
  CourseTrainerType,
  SearchTrainer,
  SearchTrainerAvailability,
  Course_Trainer_Type_Enum,
} from '@app/generated/graphql'
import { noop } from '@app/util'

import { SearchTrainersSchedule } from './helpers'
import { useQueryTrainers } from './useQueryTrainers'

type Props = Readonly<{
  trainerType: CourseTrainerType | Course_Trainer_Type_Enum
  courseLevel: Course_Level_Enum | CourseLevel
  courseSchedule: SearchTrainersSchedule
  bildStrategies?: BildStrategy[]
  courseType: Course_Type_Enum
  placeholder?: string
  max?: number
  maxReachedPlaceholder?: string
  autoFocus?: boolean
  value?: SearchTrainer[]
  onChange?: (ev: { target: { value: SearchTrainer[] } }) => void
  matchesFilter?: (matches: SearchTrainer[]) => SearchTrainer[]
  disabled?: boolean
  useAOL?: boolean
}>

export function SearchTrainers({
  trainerType,
  courseLevel,
  courseSchedule,
  bildStrategies,
  courseType,
  placeholder,
  max = Infinity,
  maxReachedPlaceholder,
  autoFocus = false,
  value = undefined,
  onChange = noop,
  matchesFilter = t => t,
  disabled = false,
  useAOL,
}: Props) {
  const { acl } = useAuth()
  const { t } = useTranslation()
  const [selected, setSelected] = useState<SearchTrainer[]>([])
  const [query, setQuery] = useState<string>('')
  const [debouncedQuery] = useDebounce(query, 300)

  const [{ data: trainers, fetching: loading }] = useQueryTrainers({
    trainerType: trainerType as CourseTrainerType,
    courseLevel,
    schedule: courseSchedule,
    bildStrategies,
    courseType,
    query: debouncedQuery,
    useAOL,
  })

  const isControlled = value != null
  const isSelected = isControlled ? value : selected

  const renderInput = (params: AutocompleteRenderInputParams) => {
    const maxReached = isSelected.length === max

    const maxPlaceholder =
      maxReachedPlaceholder ??
      t(`components.searchTrainers.maxReachedPlaceholder`)
    const emptyPlaceholder =
      placeholder ?? t(`components.searchTrainers.placeholder`)

    return renderTextField({
      params,
      loading,
      placeholder: maxReached ? maxPlaceholder : emptyPlaceholder,
      hidden: maxReached,
      showSearchIcon: isSelected.length === 0,
      autoFocus,
      disabled,
      setQuery,
    })
  }

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    option: SearchTrainer,
    _state: AutocompleteRenderOptionState,
  ) => {
    const trainerRoles = option.trainer_role_types
      ?.map(obj => t(`trainer-role-types.${obj.trainer_role_type?.name}`))
      .join(', ')
    return (
      <Box
        {...props}
        component="li"
        sx={{ display: 'flex', gap: 2 }}
        data-testid="SearchTrainers-option"
        key={option.id}
      >
        <Avatar size={32} src={option.avatar ?? ''} name={option.fullName} />
        <Box>
          <Typography variant="body1">{option.fullName}</Typography>
          {courseType === Course_Type_Enum.Indirect &&
          !acl.isInternalUser() ? null : (
            <Typography variant="body2">{trainerRoles}</Typography>
          )}
        </Box>

        {courseType === Course_Type_Enum.Indirect &&
        !acl.isInternalUser() ? null : (
          <Typography sx={{ flex: 1 }} variant="body2">
            {option.email}
          </Typography>
        )}

        {courseType === Course_Type_Enum.Indirect &&
        !acl.isInternalUser() ? null : (
          <TrainerAvailabilityStatus
            availability={option.availability ?? undefined}
          />
        )}
      </Box>
    )
  }

  const options = useMemo(() => {
    return matchesFilter(trainers?.trainers?.filter(Boolean) ?? [])
  }, [matchesFilter, trainers?.trainers])

  const onSelected = useCallback(
    (_: React.SyntheticEvent, updated: SearchTrainer[]) => {
      const newSelection = updated.length <= max ? updated : isSelected
      if (!isControlled) setSelected(newSelection)
      onChange({ target: { value: newSelection } })
      setQuery('')
    },
    [isControlled, max, onChange, isSelected],
  )

  const noOptionsText = useMemo(() => {
    if (loading) return t('components.searchTrainers.loading')
    if (query.trim().length >= 3)
      return t('components.searchTrainers.noResults')
    return ''
  }, [loading, t, query])

  const filterOptions = (options: SearchTrainer[]) => {
    const words = query
      .split(' ')
      .filter(Boolean)
      .map(w => w.toLowerCase().trim())

    return options.filter(option => {
      const concatenatedNames = option.fullName
        .replace(/\s/g, '')
        .toLowerCase()
        .concat(
          option.translatedFamilyName
            ? option.translatedFamilyName.replace(/\s/g, '').toLowerCase()
            : '',
        )
        .concat(
          option.translatedGivenName
            ? option.translatedGivenName.replace(/\s/g, '').toLowerCase()
            : '',
        )

      return (
        option.email?.toLowerCase().includes(query.toLowerCase()) ||
        words.every(word => concatenatedNames.includes(word))
      )
    })
  }

  return (
    <Autocomplete
      value={isSelected}
      multiple={true}
      open={noOptionsText.length > 0}
      loading={(query && !debouncedQuery) || loading}
      noOptionsText={noOptionsText}
      renderInput={renderInput}
      renderTags={renderSelected}
      renderOption={renderOption}
      options={options}
      filterSelectedOptions={true}
      filterOptions={filterOptions}
      getOptionLabel={t => t.fullName ?? ''}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      onChange={onSelected}
      inputValue={query}
      popupIcon={null}
      clearIcon={null}
      sx={{
        backgroundColor: '#fff',
        '.MuiAutocomplete-inputRoot': {
          padding: '5px 8px !important', // important needed to override mui styles
        },
      }}
      disabled={disabled}
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
  disabled,
  setQuery,
}: {
  params: AutocompleteRenderInputParams
  loading: boolean
  placeholder?: string
  hidden: boolean
  showSearchIcon: boolean
  autoFocus: boolean
  disabled: boolean
  setQuery: (value: string) => void
}) {
  return (
    <TextField
      {...params}
      variant="outlined"
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={e => setQuery(e.target.value)}
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
        disabled: hidden || disabled,
        tabIndex: hidden ? -1 : 0,
        style: { fontSize: hidden ? '.8em' : 'inherit' },
        'data-testid': 'SearchTrainers-input',
      }}
    />
  )
}

function renderSelected(
  selected: SearchTrainer[],
  getTagProps: AutocompleteRenderGetTagProps,
) {
  return selected.map((s, index) => (
    <Chip
      {...getTagProps({ index })}
      avatar={<Avatar src={s.avatar ?? ''} name={s.fullName} />}
      key={s.id}
      label={s.fullName}
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
    [SearchTrainerAvailability.Available]: 'success',
    [SearchTrainerAvailability.Pending]: 'warning',
    [SearchTrainerAvailability.Expired]: 'error',
    [SearchTrainerAvailability.Unavailable]: 'default',
  } as const

  return availability ? (
    <Chip
      variant="filled"
      color={colors[availability]}
      label={t(`common.trainer-availability.${availability}`)}
    />
  ) : null
}
