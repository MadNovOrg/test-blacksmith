export type Point = {
  lat: number
  lng: number
}

export const parsePoint = (str: string): Point | null => {
  const parts = str
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(s => s.trim())
  if (parts.length === 2 && parts[0] && parts[1]) {
    const lat = parseFloat(parts[0])
    const lng = parseFloat(parts[1])
    return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null
  }
  return null
}

/**
 * geoDistance
 *
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 * @returns {number} Number in Kilometers
 */
export const geoDistance = (
  coordsA: string,
  coordsB: string
): number | null => {
  if (!coordsA || !coordsB) return null
  const pointA = parsePoint(coordsA)
  const pointB = parsePoint(coordsB)
  if (!pointA || !pointB) return null

  const radLatA = (Math.PI * pointA.lat) / 180
  const radLatB = (Math.PI * pointB.lat) / 180
  const theta = pointA.lng - pointB.lng
  const radTheta = (Math.PI * theta) / 180
  let dist =
    Math.sin(radLatA) * Math.sin(radLatB) +
    Math.cos(radLatA) * Math.cos(radLatB) * Math.cos(radTheta)
  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515 * 1.609344
  return dist
}
