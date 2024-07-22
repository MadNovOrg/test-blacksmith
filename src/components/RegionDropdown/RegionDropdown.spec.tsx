import { noop } from 'ts-essentials'

import { render, screen, userEvent, waitFor } from '@test/index'

import { getAOLCountries, getAOLRegions } from './utils'

import { RegionDropdown } from './index'

const getOption = (region: string) => {
  return screen.getByTestId(`course-aol-region-option-${region}`)
}

const countries = getAOLCountries()

describe(RegionDropdown.name, () => {
  beforeAll(() => {
    countries.forEach(async (country: string) => {
      render(
        <RegionDropdown
          value=""
          onChange={noop}
          usesAOL={true}
          country={country}
        />,
      )
    })
  })

  it('renders correctly for each country', async () => {
    countries.forEach(async (country: string) => {
      const regions = getAOLRegions(country)

      await userEvent.click(
        screen.getByTestId(`course-aol-region-select-${country}`),
      )

      await waitFor(() => {
        expect(screen.queryAllByTestId('course-aol-region-option').length).toBe(
          regions.length + 1,
        )
      })

      regions.forEach((region: string) =>
        expect(getOption(region)).toBeInTheDocument(),
      )
    })
  })
})
