import aolRegions from '@app/modules/course/components/CourseForm/UK/aolRegions'

export function getAOLCountries() {
  return Object.keys(aolRegions)
}

export function getAOLRegions(country: string | null): string[] {
  const validCountries = getAOLCountries()

  if (!country || !validCountries.includes(country)) {
    return []
  }

  return aolRegions[country as keyof typeof aolRegions]
}
