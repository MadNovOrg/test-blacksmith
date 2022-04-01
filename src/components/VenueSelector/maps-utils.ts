import AutocompleteResponse = google.maps.places.AutocompleteResponse
import PlaceResult = google.maps.places.PlaceResult

export const getGoogleMapsSuggestions = async (
  query: string
): Promise<AutocompleteResponse> => {
  return new google.maps.places.AutocompleteService().getPlacePredictions({
    input: query,
    types: ['establishment'],
  })
}

export const getPlaceDetails = async (
  placeId: string
): Promise<PlaceResult> => {
  return new Promise((resolve, reject) => {
    new google.maps.places.PlacesService(
      document.createElement('div')
    ).getDetails({ placeId }, (result, status) => {
      if (result) {
        resolve(result)
      } else {
        reject(status)
      }
    })
  })
}
