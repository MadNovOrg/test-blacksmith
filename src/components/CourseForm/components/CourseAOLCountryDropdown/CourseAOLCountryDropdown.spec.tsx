import { CourseAOLCountryDropdown } from '@app/components/CourseForm/components/CourseAOLCountryDropdown/index'

import { getAOLCountries } from '../../helpers'

describe(CourseAOLCountryDropdown.name, () => {
  const countries = getAOLCountries()

  it('list of valid countries is up to date', () => {
    expect(countries).toEqual(['England', 'Scotland', 'Wales'])
  })
})
