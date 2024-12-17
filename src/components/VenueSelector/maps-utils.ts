import { WorldCountriesCodes } from '../CountriesSelector/hooks/useWorldCountries'

import AutocompleteResponse = google.maps.places.AutocompleteResponse
import PlaceResult = google.maps.places.PlaceResult

export const getGoogleMapsSuggestions = async (
  query: string,
  isBildCourse: boolean,
  residingCountry?: WorldCountriesCodes,
): Promise<AutocompleteResponse | null> => {
  // Google API does not support country GB-ENG type codes and I'm slicing and using the first part of the country code

  const UKcountryCode = 'GB'

  if (!window?.google) return null

  const residingCountryFormat = residingCountry?.includes('-')
    ? residingCountry.split('-')[0]
    : residingCountry ?? 'gb'

  return new google.maps.places.AutocompleteService().getPlacePredictions({
    input: query,
    types: ['establishment'],
    componentRestrictions: {
      country: isBildCourse ? UKcountryCode : residingCountryFormat,
    },
  })
}

export const getPlaceDetails = async (
  placeId: string,
): Promise<PlaceResult> => {
  return new Promise((resolve, reject) => {
    new google.maps.places.PlacesService(
      document.createElement('div'),
    ).getDetails({ placeId }, (result, status) => {
      if (result) {
        resolve(result)
      } else {
        reject(new Error(status))
      }
    })
  })
}
