import { useFeatureFlagEnabled } from 'posthog-js/react'

import { RoleName } from '@app/types'

import { render } from '@test/index'

import VenueForm, { VenueFormProps } from './VenueForm'

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

const onSubmit = vi.fn()
const onCancel = vi.fn()

const setup = (overrides: Partial<VenueFormProps> = {}) =>
  render(
    <VenueForm
      data={undefined}
      onSubmit={onSubmit}
      onCancel={onCancel}
      courseResidingCountry="GB-ENG"
      isBILDcourse={false}
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

    const { getByLabelText } = setup({ data })

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
      const { getByLabelText } = setup({
        courseResidingCountry: code,
      })

      expect(getByLabelText(/country/i)).toHaveValue(country)
      expect(getByLabelText(/country/i)).toBeDisabled()
    }
  )

  it('should make the venue country pre-selected with England and the field editable when international flag is disabled', () => {
    useFeatureFlagEnabledMock.mockReturnValue(true)
    const { getByLabelText } = render(
      <VenueForm
        data={undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
        courseResidingCountry="GB-ENG"
        isBILDcourse={false}
      />,
      {
        auth: { activeRole: RoleName.TRAINER },
      }
    )

    expect(getByLabelText(/country/i)).toHaveValue('England')
    expect(getByLabelText(/country/i)).toBeDisabled()
  })

  it('should make the venue country pre-selected with England and the field editable for BILD course', () => {
    useFeatureFlagEnabledMock.mockReturnValue(true)
    const { getByLabelText } = render(
      <VenueForm
        data={undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
        courseResidingCountry="GB-ENG"
        isBILDcourse={true}
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

    const { getByLabelText: getByLabelTextRo } = setup({
      courseResidingCountry: 'RO',
    })

    expect(getByLabelTextRo(/zip code/i)).toBeInTheDocument()
  })
})
