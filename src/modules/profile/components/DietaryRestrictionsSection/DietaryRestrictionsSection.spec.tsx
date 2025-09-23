import { useTranslation } from 'react-i18next'

import { cleanup, _render, renderHook, screen, waitFor } from '@test/index'

import { EditProfileInputs } from '../../pages/EditProfile/utils'
import { DietaryRestrictionRadioValues } from '../../utils'

import { DietaryRestrictionsSection } from './DietaryRestrictionsSection'

describe(DietaryRestrictionsSection.name, () => {
  afterEach(cleanup)
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('should _render the DietaryRestrictionsSection component', () => {
    _render(
      <DietaryRestrictionsSection
        setValue={vi.fn()}
        profileDietaryRestrictions=""
        values={{} as EditProfileInputs}
      />,
    )
    expect(
      screen.getByText(t('dietary-restrictions-question')),
    ).toBeInTheDocument()
  })
  it(`should _render a text field if disabilities radio is set to ${DietaryRestrictionRadioValues.YES} `, async () => {
    _render(
      <DietaryRestrictionsSection
        setValue={vi.fn()}
        profileDietaryRestrictions=""
        values={{} as EditProfileInputs}
      />,
    )

    const radio = screen.getByTestId('dietary-restrictions-yes')
    radio.click()
    waitFor(() => {
      expect(
        screen.getByText(t('dietary-restrictions-text-label')),
      ).toBeInTheDocument()
    })
  })
  it.each([
    Object.values(DietaryRestrictionRadioValues).filter(
      v => v !== DietaryRestrictionRadioValues.YES,
    ),
  ])(
    `should _render the available radio options for dietary restrictions`,
    async disabilityRadioValue => {
      _render(
        <DietaryRestrictionsSection
          setValue={vi.fn()}
          profileDietaryRestrictions=""
          values={{} as EditProfileInputs}
        />,
      )

      const dietaryRestrictionsTestId = `disabilities-${disabilityRadioValue
        .toLowerCase()
        .replaceAll('_', '-')}`

      waitFor(() => {
        expect(
          screen.getByTestId(dietaryRestrictionsTestId),
        ).toBeInTheDocument()
      })
    },
  )
  it('updates value when radio button is clicked', async () => {
    const setValue = vi.fn()
    _render(
      <DietaryRestrictionsSection
        setValue={setValue}
        profileDietaryRestrictions=""
        values={{} as EditProfileInputs}
      />,
    )

    const radio = screen.getByTestId('dietary-restrictions-yes')

    radio.click()

    waitFor(() => {
      expect(setValue).toHaveBeenCalledTimes(2)
      expect(setValue).toHaveBeenCalledWith(
        'dietaryRestrictionRadioValue',
        DietaryRestrictionRadioValues.YES,
      )
      expect(setValue).toHaveBeenCalledWith('dietaryRestrictions', '')
    })
  })
})
