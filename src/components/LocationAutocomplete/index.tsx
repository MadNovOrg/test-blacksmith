import React, { useCallback, useMemo, useState } from 'react'
import {
  Autocomplete,
  CircularProgress,
  SxProps,
  TextField,
} from '@mui/material'
import { Wrapper } from '@googlemaps/react-wrapper'
import { TextFieldProps } from '@mui/material/TextField/TextField'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash-es'

export type LocationAutocompleteProps = {
  label: string
  value: string
  onChange: (value: string | null) => void
  textFieldProps?: TextFieldProps
  sx?: SxProps
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = function ({
  label,
  value,
  onChange,
  textFieldProps,
  sx,
  ...props
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(value)
  const [error, setError] = useState<string>()

  const handleError = (err: string) => {
    console.log(err)
    setError(err)
    setLoading(false)
    setOpen(false)
  }

  const debouncedQuery = useMemo(() => {
    return debounce(async query => {
      setError(undefined)
      try {
        const response =
          await new google.maps.places.AutocompleteService().getPlacePredictions(
            {
              input: query,
            }
          )
        setLoading(false)
        if (response) {
          const predictions = response.predictions.map(
            prediction => prediction.description
          )
          setOptions([query, ...predictions])
        } else {
          handleError(
            t('components.location-autocomplete.google-maps-api-error')
          )
        }
      } catch (e: unknown) {
        handleError((e as Error).message)
      }
    }, 1000)
  }, [t])

  const onInputChange = useCallback(
    async (event: React.SyntheticEvent, value: string, reason: string) => {
      setOptions([])
      setQuery(value)
      if (reason === 'input' && value && value.length > 2) {
        setLoading(true)
        debouncedQuery(value)
      }
    },
    [debouncedQuery]
  )

  return (
    <Wrapper
      apiKey={`${import.meta.env.VITE_GMAPS_KEY}`}
      libraries={['places']}
    >
      <Autocomplete
        sx={sx}
        open={open}
        openOnFocus={true}
        clearOnBlur={false}
        onOpen={() => setOpen(true)}
        onClose={(_, reason) => {
          if (reason === 'blur') {
            onChange(query)
          }
          setOpen(false)
          setLoading(false)
          debouncedQuery.cancel()
        }}
        onInputChange={onInputChange}
        onChange={(_, value) => onChange(value)}
        isOptionEqualToValue={() => true}
        options={options}
        loading={loading}
        noOptionsText={t('components.location-autocomplete.min-chars-label')}
        renderInput={params => (
          <TextField
            {...params}
            {...textFieldProps}
            value={query}
            label={label}
            helperText={error}
            error={Boolean(error)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        {...props}
      />
    </Wrapper>
  )
}

export default LocationAutocomplete
