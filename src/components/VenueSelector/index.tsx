import { Wrapper } from '@googlemaps/react-wrapper'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
} from '@mui/material'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { debounce } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog } from '@app/components/Dialog'
import VenueForm, {
  VenueFormProps,
} from '@app/components/VenueSelector/VenueForm'
import { useFetcher } from '@app/hooks/use-fetcher'
import {
  ParamsType as FindVenuesParams,
  QUERY as FindVenuesQuery,
  ResponseType as FindVenuesResponse,
} from '@app/queries/venue/find-venues'
import { Venue } from '@app/types'

import { getGoogleMapsSuggestions, getPlaceDetails } from './maps-utils'
import powerByGoogleImg from './powered-by-google.png'

import AutocompletePrediction = google.maps.places.AutocompletePrediction
import PlaceResult = google.maps.places.PlaceResult

export type VenueSelectorProps = {
  value?: Venue
  onChange: (value: Venue | undefined) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
}

function getOptionLabel(value: AutocompletePrediction | Venue) {
  if ('place_id' in value) {
    return value.description
  }
  return `${value.name}, ${value.city}`
}

function getAddressPart(placeDetails: PlaceResult, partName: string): string {
  const addressPart = placeDetails.address_components?.find(component =>
    component.types.includes(partName)
  )
  return addressPart?.long_name || ''
}

const VenueSelector: React.FC<VenueSelectorProps> = function ({
  value,
  onChange,
  sx,
  textFieldProps,
  ...props
}) {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<(AutocompletePrediction | Venue)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [showNewVenueModal, setShowNewVenueModal] = useState(false)
  const [venue, setVenue] = useState<VenueFormProps['data']>()
  const [query, setQuery] = useState(value?.name ?? '')

  const handleError = (err: string) => {
    setError(err)
    setLoading(false)
    setOpen(false)
  }

  const debouncedQuery = useMemo(() => {
    return debounce(async query => {
      setError(undefined)
      try {
        const googleResponse = await getGoogleMapsSuggestions(query)
        const hasuraResponse = await fetcher<
          FindVenuesResponse,
          FindVenuesParams
        >(FindVenuesQuery, { query: `%${query}%` })
        setLoading(false)
        if (googleResponse) {
          const suggestions = googleResponse.predictions.filter(
            prediction =>
              !hasuraResponse.venues.some(
                venue => venue.googlePlacesId === prediction?.place_id
              )
          )
          setOptions([...hasuraResponse.venues, ...suggestions])
        } else {
          setOptions([...hasuraResponse.venues])
          handleError(t('components.venue-selector.google-maps-api-error'))
        }
      } catch (e: unknown) {
        handleError((e as Error).message)
      }
    }, 1000)
  }, [fetcher, t])

  const onInputChange = useCallback(
    async (event: React.SyntheticEvent, value: string, reason: string) => {
      setOptions([])
      if (reason === 'input' && value && value.length > 2) {
        setLoading(true)
        debouncedQuery(value)
      }
    },
    [debouncedQuery]
  )

  const handleSelection = useCallback(
    async (
      event: React.SyntheticEvent,
      value: AutocompletePrediction | Venue | null
    ) => {
      if (value && 'place_id' in value) {
        const placeDetails = await getPlaceDetails(value.place_id)
        setVenue({
          name: placeDetails.name || '',
          addressLineOne: placeDetails.formatted_address || '',
          city: getAddressPart(placeDetails, 'administrative_area_level_2'),
          postCode: getAddressPart(placeDetails, 'postal_code'),
          geoCoordinates: placeDetails.geometry?.location
            ? `(${placeDetails.geometry.location.lat()}, ${placeDetails.geometry.location.lng()})`
            : '',
          googlePlacesId: placeDetails.place_id,
        })
        setShowNewVenueModal(true)
      } else {
        onChange(value ?? undefined)
      }
    },
    [onChange]
  )

  const onDialogClose = () => {
    setShowNewVenueModal(false)
    setQuery('')
    setOpen(false)
    setVenue(undefined)
  }

  const noOptionsText =
    query?.length < 3 ? (
      t('components.venue-selector.min-chars-label')
    ) : (
      <Grid container gap={2} alignItems="center">
        <Typography display="inline" variant="body1">
          {t('components.venue-selector.no-results')}
        </Typography>
        <Button variant="text" onClick={() => setShowNewVenueModal(true)}>
          {t('components.venue-selector.add-new-venue')}
        </Button>
      </Grid>
    )

  return (
    <>
      <Wrapper
        apiKey={`${import.meta.env.VITE_GMAPS_KEY}`}
        libraries={['places']}
      >
        <Autocomplete
          sx={sx}
          open={open}
          openOnFocus={true}
          clearOnBlur={true}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false)
            setLoading(false)
            setQuery('')
            debouncedQuery.cancel()
          }}
          onInputChange={onInputChange}
          onChange={handleSelection}
          isOptionEqualToValue={() => true}
          options={options}
          loading={loading}
          groupBy={(value: AutocompletePrediction | Venue) =>
            'place_id' in value
              ? t('components.venue-selector.suggestions')
              : t('components.venue-selector.venues')
          }
          noOptionsText={noOptionsText}
          getOptionLabel={getOptionLabel}
          value={value ?? null}
          renderGroup={params => (
            <li key={params.key}>
              <Grid container justifyContent="space-between" px={2} py={1}>
                <Typography display="inline" variant="body2">
                  {params.group}
                </Typography>
                {params.group === t('components.venue-selector.suggestions') ? (
                  <Box display="inline-flex" right={0}>
                    <img
                      src={powerByGoogleImg}
                      alt="powered by Google"
                      height="17"
                    />
                  </Box>
                ) : null}
              </Grid>
              <List sx={{ px: 2 }}>{params.children}</List>
            </li>
          )}
          renderInput={params => (
            <TextField
              {...textFieldProps}
              {...params}
              placeholder={t('components.venue-selector.placeholder')}
              helperText={error}
              error={Boolean(error)}
              onChange={event => setQuery(event.target.value)}
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
          renderOption={(props, option, { inputValue }) => {
            const label = getOptionLabel(option)
            const matches = match(label, inputValue, {
              insideWords: true,
              findAllOccurrences: true,
            })
            const parts = parse(label, matches)
            return (
              <li {...props}>
                <Grid container justifyContent="space-between">
                  <Box display="inline">
                    {parts.map((part, index) => (
                      <Typography
                        key={index}
                        display="inline"
                        variant="body1"
                        fontWeight={part.highlight ? 600 : 400}
                      >
                        {part.text}
                      </Typography>
                    ))}
                  </Box>
                  {'place_id' in option ? (
                    <Typography
                      display="inline"
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: theme.colors.navy['500'],
                      }}
                    >
                      {t('components.venue-selector.modal.submit')}
                    </Typography>
                  ) : null}
                </Grid>
              </li>
            )
          }}
          {...props}
        />
      </Wrapper>
      <Dialog
        open={showNewVenueModal}
        onClose={onDialogClose}
        title={t('components.venue-selector.modal.title')}
        maxWidth={800}
      >
        <VenueForm
          data={venue}
          onSubmit={venue => {
            onDialogClose()
            onChange(venue)
          }}
          onCancel={onDialogClose}
        />
      </Dialog>
    </>
  )
}

export default VenueSelector
