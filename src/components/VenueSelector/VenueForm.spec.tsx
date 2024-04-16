import { useFeatureFlagEnabled } from 'posthog-js/react'

import { Course_Type_Enum } from '@app/generated/graphql'
import { RoleName, Venue } from '@app/types'

import { chance, render } from '@test/index'

import VenueForm, { VenueFormProps } from './VenueForm'

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

const onSubmit = vi.fn()
const onCancel = vi.fn()

const venueDetails = {
  addressLineOne: chance.address(),
  city: chance.city(),
  country: 'England',
  countryCode: 'GB',
  name: chance.name(),
  postCode: chance.postcode(),
}

const setup = (
  overrides: Partial<VenueFormProps> = {},
  data?: Omit<Venue, 'id'>
) =>
  render(
    <VenueForm
      data={data}
      onSubmit={onSubmit}
      onCancel={onCancel}
      courseResidingCountry="GB-ENG"
      isBILDcourse={false}
      courseType={'CLOSED' as Course_Type_Enum}
      {...overrides}
    />,
    {
      auth: { activeRole: RoleName.TRAINER },
    }
  )

describe('component: VenueForm', () => {
  it('should mark pre-completed fields as disabled', () => {
    const data: VenueFormProps['data'] = {
      name: 'Test Venue',
      addressLineOne: '', // can be empty from GMaps
      city: 'Birmingham',
      postCode: 'B1 1AA',
    }

    const { getByLabelText } = setup({ data }, venueDetails)

    expect(getByLabelText(/name/i)).toBeDisabled()
    expect(getByLabelText(/city/i)).toBeDisabled()
    expect(getByLabelText(/postcode/i)).toBeDisabled()
    expect(getByLabelText(/address line 1/i)).not.toBeDisabled()
    expect(getByLabelText(/address line 2/i)).not.toBeDisabled()
  })

  it.each([
    {
      code: 'GB-ENG',
      country: 'England',
    },
    {
      code: 'RO',
      country: 'Romania',
    },
  ])(
    'should make the venue country pre-selected with the course country $country and the field disabled when international flag is enabled',
    ({ code, country }) => {
      useFeatureFlagEnabledMock.mockReturnValue(true)
      Object.assign(venueDetails, {
        country,
        countryCode: code,
      })
      const { getByLabelText } = setup(
        {
          courseResidingCountry: code,
        },
        venueDetails
      )

      expect(getByLabelText(/country/i)).toHaveValue(country)
      expect(getByLabelText(/country/i)).toBeDisabled()
    }
  )

  it('should make the venue country pre-selected with England and the field editable when international flag is disabled', () => {
    useFeatureFlagEnabledMock.mockReturnValue(true)

    Object.assign(venueDetails, {
      country: 'England',
      countryCode: 'GB-ENG',
    })

    const { getByLabelText } = render(
      <VenueForm
        data={venueDetails}
        onSubmit={onSubmit}
        onCancel={onCancel}
        courseResidingCountry="GB-ENG"
        isBILDcourse={false}
        courseType={Course_Type_Enum.Closed}
      />,
      {
        auth: { activeRole: RoleName.TRAINER },
      }
    )

    expect(getByLabelText(/country/i)).toHaveValue('England')
    expect(getByLabelText(/country/i)).toBeDisabled()
  })

  it('should make the venue country pre-selected with England and the field editable for BILD course', () => {
    const { getByLabelText } = render(
      <VenueForm
        data={undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
        courseResidingCountry="GB-ENG"
        courseType={Course_Type_Enum.Closed}
        isBILDcourse={true}
      />,
      {
        auth: { activeRole: RoleName.TRAINER },
      }
    )

    expect(getByLabelText(/country/i)).toHaveValue('England')
    expect(getByLabelText(/country/i)).not.toBeDisabled()
  })

  it('should make the venue country pre-selected with England and the field editable for INDIRECT course', () => {
    const { getByLabelText } = render(
      <VenueForm
        data={undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
        courseResidingCountry="GB-ENG"
        courseType={Course_Type_Enum.Indirect}
        isBILDcourse={false}
      />,
      {
        auth: { activeRole: RoleName.TRAINER },
      }
    )

    expect(getByLabelText(/country/i)).toHaveValue('England')
    expect(getByLabelText(/country/i)).not.toBeDisabled()
  })

  it('should use the term "Postcode" for UK and "Zip code" for other countries', () => {
    const { getByLabelText } = setup({
      courseResidingCountry: 'GB-ENG',
    })

    expect(getByLabelText(/postcode/i)).toBeInTheDocument()

    Object.assign(venueDetails, {
      code: 'RO',
      country: 'Romania',
    })
    const { getByLabelText: getByLabelTextRo } = setup({
      courseResidingCountry: 'RO',
    })

    expect(getByLabelTextRo(/zip code/i)).toBeInTheDocument()
  })
})
