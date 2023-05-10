/**
 * The function extracts the street address from the adr_address
 * field returned by Google Place Details service.
 *
 * See documentation here: https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult.adr_address
 * @param adr an address in ADR format
 * @returns the street address or an empty string
 */

export function extractAdrStreetAddress(adr?: string) {
  if (adr) {
    const regExpr = /<(.*?) .*?class="street-address".*?>(.*?)<\/.*?\1.*?>/i
    const match = regExpr.exec(adr)

    if (match) {
      return match[2] || ''
    }
  }
  return ''
}
