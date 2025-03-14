import { useTranslation } from 'react-i18next'

import { cleanup, render, renderHook, screen, waitFor } from '@test/index'

import {
  EditProfileInputs,
  ratherNotSayText,
} from '../../pages/EditProfile/utils'
import { DisabilitiesRadioValues } from '../../utils'

import { DisabilitiesSection } from './DisabilitiesSection'

describe(DisabilitiesSection.name, () => {
  afterEach(cleanup)
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  it('should render the DisabilitiesSection component', () => {
    render(
      <DisabilitiesSection
        setValue={vi.fn()}
        profileDisabilities=""
        values={{} as EditProfileInputs}
      />,
    )
    expect(screen.getByText(t('disabilities-question'))).toBeInTheDocument()
  })
  it.each([
    Object.values(DisabilitiesRadioValues).filter(
      v => v !== DisabilitiesRadioValues.YES,
    ),
  ])(
    `should NOT render a text field if disabilities radio is set to %s`,
    async disabilityRadioValue => {
      render(
        <DisabilitiesSection
          setValue={vi.fn()}
          profileDisabilities=""
          values={{} as EditProfileInputs}
        />,
      )

      const disabilitiesTestId = `disabilities-${disabilityRadioValue
        .toLowerCase()
        .replaceAll('_', '-')}`

      const radio = screen.getByTestId(disabilitiesTestId)
      radio.click()
      waitFor(() => {
        expect(
          screen.getByText(t('disabilities-text-label')),
        ).toBeInTheDocument()
      })
    },
  )
  it(`should render a text field if disabilities radio is set to ${DisabilitiesRadioValues.YES} `, async () => {
    render(
      <DisabilitiesSection
        setValue={vi.fn()}
        profileDisabilities=""
        values={{} as EditProfileInputs}
      />,
    )

    const radio = screen.getByTestId('disabilities-yes')
    radio.click()
    waitFor(() => {
      expect(screen.getByText(t('disabilities-text-label'))).toBeInTheDocument()
    })
  })
  it('updates value when radio button is clicked', async () => {
    const setValue = vi.fn()
    render(
      <DisabilitiesSection
        setValue={setValue}
        profileDisabilities=""
        values={{} as EditProfileInputs}
      />,
    )

    const radio = screen.getByTestId('disabilities-yes')

    radio.click()

    waitFor(() => {
      expect(setValue).toHaveBeenCalledTimes(2)
      expect(setValue).toHaveBeenCalledWith(
        'disabilitiesRadioValue',
        DisabilitiesRadioValues.YES,
      )
      expect(setValue).toHaveBeenCalledWith('disabilities', '')
    })
  })
  it('sets value to rather not say when radio button is clicked', async () => {
    const setValue = vi.fn()
    render(
      <DisabilitiesSection
        setValue={setValue}
        profileDisabilities=""
        values={{} as EditProfileInputs}
      />,
    )

    const radio = screen.getByTestId('disabilities-rather-not-say')

    radio.click()

    waitFor(() => {
      expect(setValue).toHaveBeenCalledTimes(2)
      expect(setValue).toHaveBeenCalledWith(
        'disabilitiesRadioValue',
        DisabilitiesRadioValues.RATHER_NOT_SAY,
      )
      expect(setValue).toHaveBeenCalledWith('disabilities', ratherNotSayText)
    })
  })
})
