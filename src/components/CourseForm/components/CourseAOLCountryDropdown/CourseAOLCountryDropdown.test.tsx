import React from 'react'
import { noop } from 'ts-essentials'

import { render, screen, userEvent } from '@test/index'

import { getAOLCountries } from '../../helpers'

import { CourseAOLCountryDropdown } from './index'

const getOption = (country: string) => {
  return screen.getByTestId(`course-aol-country-option-${country}`)
}

const countries = getAOLCountries()

describe('component: CourseAOLCountryDropdown', () => {
  it('list of valid countries is up to date', () => {
    expect(countries).toEqual(['England', 'Scotland', 'Wales'])
  })

  it('renders correctly', async () => {
    render(<CourseAOLCountryDropdown value="" onChange={noop} usesAOL={true} />)

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    countries.forEach((country: string) =>
      expect(getOption(country)).toBeInTheDocument()
    )
  })
})
