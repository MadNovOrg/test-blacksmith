import React from 'react'
import { noop } from 'ts-essentials'

import { render, screen, userEvent } from '@test/index'

import { getAOLCountries, getAOLRegions } from '../../helpers'

import { CourseAOLRegionDropdown } from './index'

const getOption = (region: string) => {
  return screen.getByTestId(`course-aol-region-option-${region}`)
}

const countries = getAOLCountries()

describe('component: CourseAOLRegionDropdown', () => {
  it('renders correctly for each country', () => {
    countries.forEach((country: string) => {
      const regions = getAOLRegions(country)

      render(
        <CourseAOLRegionDropdown
          value=""
          onChange={noop}
          usesAOL={true}
          aolCountry={country}
        />
      )

      userEvent.click(screen.getByRole('button'))

      expect(screen.queryAllByRole('option').length).toBe(regions.length + 1)

      regions.forEach((region: string) =>
        expect(getOption(region)).toBeInTheDocument()
      )
    })
  })
})
