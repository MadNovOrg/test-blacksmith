import React from 'react'
import { noop } from 'ts-essentials'

import { render, screen, userEvent, waitFor } from '@test/index'

import { getAOLCountries, getAOLRegions } from '../../helpers'

import { CourseAOLRegionDropdown } from './index'

const getOption = (region: string) => {
  return screen.getByTestId(`course-aol-region-option-${region}`)
}

const countries = getAOLCountries()

describe('component: CourseAOLRegionDropdown', () => {
  beforeAll(() => {
    countries.forEach(async (country: string) => {
      render(
        <CourseAOLRegionDropdown
          value=""
          onChange={noop}
          usesAOL={true}
          aolCountry={country}
        />
      )
    })
  })

  it('renders correctly for each country', async () => {
    await countries.forEach(async (country: string) => {
      const regions = getAOLRegions(country)

      userEvent.click(screen.getByTestId(`course-aol-region-select-${country}`))

      await waitFor(() => {
        expect(screen.queryAllByTestId('course-aol-region-option').length).toBe(
          regions.length + 1
        )
      })

      regions.forEach((region: string) =>
        expect(getOption(region)).toBeInTheDocument()
      )
    })
  })
})
