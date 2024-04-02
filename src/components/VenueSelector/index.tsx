import { Wrapper } from '@googlemaps/react-wrapper'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  List,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
} from '@mui/material'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { uniqueId } from 'lodash'
import React, { useMemo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateEffect } from 'react-use'
import { useQuery } from 'urql'
import { useDebounce } from 'use-debounce'

import { Dialog } from '@app/components/dialogs'
import VenueForm, {
  VenueFormProps,
} from '@app/components/VenueSelector/VenueForm'
import {
  FindVenuesQuery,
  FindVenuesQueryVariables,
} from '@app/generated/graphql'
import { FIND_VENUES } from '@app/queries/venue/find-venues'
import { Venue } from '@app/types'

import {
  UKsCountriesCode,
  UKsCountriesCodes,
  WorldCountriesCodes,
} from '../CountriesSelector/hooks/useWorldCountries'

import { getGoogleMapsSuggestions, getPlaceDetails } from './maps-utils'
import powerByGoogleImg from './powered-by-google.png'
import { extractAdrStreetAddress } from './utils/adr-parser'

import AutocompletePrediction = google.maps.places.AutocompletePrediction
import PlaceResult = google.maps.places.PlaceResult

export type VenueSelectorProps = {
  value?: Venue
  onChange: (value: Venue | undefined) => void
  sx?: SxProps
  textFieldProps?: TextFieldProps
  courseResidingCountry?: WorldCountriesCodes | string
  isBILDcourse: boolean
}
function getOptionLabel(value: AutocompletePrediction | Venue | string) {
  if (typeof value === 'string') {
    return ''
  }

  if ('place_id' in value) {
    return value.description
  }

  const venueAddress = [
    value.name,
    value.addressLineOne,
    value.addressLineTwo,
    value.city,
    value.postCode,
    value.country,
  ]

  return venueAddress.filter(item => item).join(', ')
}

function getAddressPart(placeDetails: PlaceResult, partName: string): string {
  const addressPart = placeDetails.address_components?.find(component =>
    component.types.includes(partName)
  )
  return addressPart?.long_name || ''
}

function getCountry(placeDetails: PlaceResult): string {
  if (placeDetails?.address_components) {
    const countryAddressComponent = placeDetails?.address_components.find(
      address => address.types.includes('country')
    )
    return countryAddressComponent?.long_name ?? ''
  }
  return ''
}

function getCountryCode(placeDetails: PlaceResult): string {
  if (placeDetails.address_components) {
    const countryAddressComponent = placeDetails?.address_components.find(
      address => address.types.includes('country')
    )
    return countryAddressComponent?.short_name ?? ''
  }
  return ''
}

export const VenueSelector: React.FC<
  React.PropsWithChildren<VenueSelectorProps>
> = function ({
  value,
  onChange,
  sx,
  textFieldProps,
  courseResidingCountry,
  isBILDcourse,
  ...props
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const ukCountries = Object.values(UKsCountriesCodes) as string[]

  const [open, setOpen] = useState(false)
  const [showNewVenueModal, setShowNewVenueModal] = useState(false)
  const [venue, setVenue] = useState<VenueFormProps['data']>()
  const [query, setQuery] = useState(value?.name ?? '')
  const [debouncedQuery] = useDebounce(query, 300)
  const [googleSuggestions, setGoogleSuggestions] =
    useState<google.maps.places.AutocompleteResponse>()

  const [{ data, error, fetching: loading }] = useQuery<
    FindVenuesQuery,
    FindVenuesQueryVariables
  >({
    query: FIND_VENUES,
    variables: {
      query: `%${debouncedQuery}%`,
      country: [
        ...(courseResidingCountry
          ? [courseResidingCountry ?? '']
          : // for Indirect courses, we need to retun all results based on UK countries since there's no residing country yet
            [...Object.keys(UKsCountriesCodes)]),
      ],
    },
    pause: !debouncedQuery,
    requestPolicy: 'cache-and-network',
  })

  useUpdateEffect(() => {
    const suggestions = async () => {
      const googleResponse = await getGoogleMapsSuggestions(
        debouncedQuery,
        courseResidingCountry as WorldCountriesCodes
      )
      if (googleResponse) setGoogleSuggestions(googleResponse)
    }
    if (debouncedQuery) suggestions()
  }, [courseResidingCountry, debouncedQuery])

  const options = useMemo(() => {
    if (googleSuggestions) {
      const suggestions = googleSuggestions.predictions.filter(
        prediction =>
          !(data?.venues ?? []).some(
            venue => venue.googlePlacesId === prediction?.place_id
          )
      )
      return [...(data?.venues ?? []), ...suggestions]
    } else {
      return [...(data?.venues ?? [])]
    }
  }, [data?.venues, googleSuggestions]) as (AutocompletePrediction | Venue)[]

  const handleSelection = useCallback(
    async (value: AutocompletePrediction | Venue | null) => {
      if (value && 'place_id' in value) {
        const placeDetails = await getPlaceDetails(value.place_id)
        setVenue({
          name: placeDetails.name || '',
          addressLineOne: extractAdrStreetAddress(placeDetails.adr_address),
          city: getAddressPart(placeDetails, 'administrative_area_level_2'),
          postCode: getAddressPart(placeDetails, 'postal_code'),
          country: getCountry(placeDetails),
          geoCoordinates: placeDetails.geometry?.location
            ? `(${placeDetails.geometry.location.lat()}, ${placeDetails.geometry.location.lng()})`
            : '',
          googlePlacesId: placeDetails.place_id,
          countryCode: ukCountries.includes(
            UKsCountriesCodes[courseResidingCountry as UKsCountriesCode]
          )
            ? courseResidingCountry
            : getCountryCode(placeDetails),
        })
        setShowNewVenueModal(true)
      } else {
        onChange(value ?? undefined)
      }
    },
    [courseResidingCountry, onChange, ukCountries]
  )

  const onDialogClose = () => {
    setShowNewVenueModal(false)
    setQuery('')
    setOpen(false)
    setVenue(undefined)
  }

  useUpdateEffect(() => {
    setGoogleSuggestions({ predictions: [] })
    setQuery('')
  }, [courseResidingCountry])

  return (
    <>
      <Wrapper
        apiKey={`${import.meta.env.VITE_GMAPS_KEY}`}
        libraries={['places', 'visualization']}
      >
        <Autocomplete
          freeSolo={query?.length > 3 ? false : true}
          sx={sx}
          open={open && Boolean(debouncedQuery && query)}
          openOnFocus={true}
          clearOnBlur={true}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false)
            setQuery('')
          }}
          onChange={(_, option) => {
            handleSelection(option as Venue | AutocompletePrediction)
            setQuery('')
          }}
          isOptionEqualToValue={() => true}
          options={options ?? []}
          loading={(query && !debouncedQuery) || loading}
          groupBy={(value: AutocompletePrediction | Venue) =>
            'place_id' in value
              ? t('components.venue-selector.suggestions')
              : t('components.venue-selector.venues')
          }
          onInputChange={() => (query.length < 1 ? setOpen(false) : null)}
          getOptionLabel={getOptionLabel}
          value={value ?? null}
          renderGroup={params => (
            <li key={uniqueId()}>
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
            <Grid>
              <TextField
                {...textFieldProps}
                {...params}
                label={t('components.venue-selector.title')}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={t('components.venue-selector.placeholder')}
                helperText={
                  error || textFieldProps?.error
                    ? t('components.course-form.venue-required')
                    : ''
                }
                error={Boolean(error || textFieldProps?.error)}
                onChange={event => setQuery(event.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <InputAdornment position="end">
                          <Button
                            variant="text"
                            onClick={() => setShowNewVenueModal(true)}
                          >
                            {t('components.venue-selector.add-new-venue')}
                          </Button>
                        </InputAdornment>
                      )}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                data-testid="venue-selector"
              />
            </Grid>
          )}
          renderOption={(props, option, { inputValue }) => {
            const label = getOptionLabel(option)
            const matches = match(label, inputValue, {
              insideWords: true,
              findAllOccurrences: true,
            })
            const parts = parse(label, matches)
            return (
              <li {...props} key={uniqueId()}>
                <Grid container justifyContent="space-between">
                  <Box display="inline">
                    {parts.map(part => (
                      <Typography
                        key={uniqueId()}
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
        slots={{
          Title: () => <>{t('components.venue-selector.modal.title')}</>,
        }}
        maxWidth={800}
      >
        <VenueForm
          data={venue}
          onSubmit={venue => {
            onDialogClose()
            onChange(venue)
          }}
          courseResidingCountry={courseResidingCountry}
          isBILDcourse={isBILDcourse}
          onCancel={onDialogClose}
        />
      </Dialog>
    </>
  )
}
