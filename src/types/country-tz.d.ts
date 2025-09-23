declare module 'country-tz' {
  export function getTimeZonesByCode(countryCode: string): string[]
  export function getZones(): {
    [key: string]: {
      comments: string
      countries: string[]
      lat: number
      long: number
      name: string
    }
  }
}
