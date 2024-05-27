import { render, renderHook, within } from '@testing-library/react'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { UKsCodes } from '@app/components/CountriesSelector/hooks/useWorldCountries'
import {
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { screen, chance, userEvent } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { ReplaceParticipantDialog } from './ReplaceParticipantDialog'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe('page: ReplaceParticipantDialog.', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  useFeatureFlagEnabledMock.mockResolvedValue(true)

  it('do not display postal address fields for Level 1 F2F course', () => {
    const client = {
      executeQuery: vi.fn(() => never),
    } as unknown as Client

    const course = buildCourse({
      overrides: {
        deliveryType: Course_Delivery_Type_Enum.F2F,
        level: Course_Level_Enum.Level_1,
        residingCountry: UKsCodes.GB_ENG,
        type: Course_Type_Enum.Open,
      },
    })

    const participant = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog course={course} participant={participant} />
      </Provider>
    )

    expect(
      screen.getByLabelText(t('components.user-selector.placeholder'), {
        exact: false,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        t('components.replace-participant.first-name-placeholder'),
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        t('components.replace-participant.surname-placeholder'),
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('line1'), { exact: false })
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(t('line2'))).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('city'), { exact: false })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(
        t('components.venue-selector.modal.fields.postCode'),
        { exact: false }
      )
    ).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('country'), { exact: false })
    ).not.toBeInTheDocument()
  })

  it('display postal address fields for UK Level 1 Virtual course', () => {
    const client = {
      executeQuery: vi.fn(() => never),
    } as unknown as Client

    const course = buildCourse({
      overrides: {
        deliveryType: Course_Delivery_Type_Enum.Virtual,
        level: Course_Level_Enum.Level_1,
        residingCountry: UKsCodes.GB_ENG,
        type: Course_Type_Enum.Open,
      },
    })

    const participant = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog course={course} participant={participant} />
      </Provider>
    )

    expect(
      screen.getByLabelText(t('components.user-selector.placeholder'), {
        exact: false,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        t('components.replace-participant.first-name-placeholder'),
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        t('components.replace-participant.surname-placeholder'),
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(t('line1'), { exact: false })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(t('line2'))).toBeInTheDocument()

    expect(
      screen.getByLabelText(t('city'), { exact: false })
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(
        t('components.venue-selector.modal.fields.postCode'),
        { exact: false }
      )
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(t('country'), { exact: false })
    ).toBeInTheDocument()
  })

  it('do not display postal address fields for non UK Level 1 Virtual course', () => {
    const client = {
      executeQuery: vi.fn(() => never),
    } as unknown as Client

    const course = buildCourse({
      overrides: {
        deliveryType: Course_Delivery_Type_Enum.Virtual,
        level: Course_Level_Enum.Level_1,
        residingCountry: 'AG',
        type: Course_Type_Enum.Open,
      },
    })

    const participant = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog course={course} participant={participant} />
      </Provider>
    )

    expect(
      screen.getByLabelText(t('components.user-selector.placeholder'), {
        exact: false,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        t('components.replace-participant.first-name-placeholder'),
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText(
        t('components.replace-participant.surname-placeholder'),
        {
          exact: false,
        }
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('line1'), { exact: false })
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(t('line2'))).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('city'), { exact: false })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(
        t('components.venue-selector.modal.fields.postCode'),
        { exact: false }
      )
    ).not.toBeInTheDocument()

    expect(
      screen.queryByLabelText(t('country'), { exact: false })
    ).not.toBeInTheDocument()
  })

  it('enable replace attendee button for Level 1 F2F course', async () => {
    const client = {
      executeQuery: vi.fn(() => never),
    } as unknown as Client

    const course = buildCourse({
      overrides: {
        deliveryType: Course_Delivery_Type_Enum.F2F,
        level: Course_Level_Enum.Level_1,
        residingCountry: UKsCodes.GB_ENG,
        type: Course_Type_Enum.Open,
      },
    })

    const participant = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog course={course} participant={participant} />
      </Provider>
    )

    const userSelector = screen.getByLabelText(
      t('components.user-selector.placeholder'),
      {
        exact: false,
      }
    )
    await userEvent.type(userSelector, chance.email())

    const firstName = screen.getByPlaceholderText(
      t('components.replace-participant.first-name-placeholder'),
      {
        exact: false,
      }
    )
    await userEvent.type(firstName, chance.name())

    const surname = screen.getByPlaceholderText(
      t('components.replace-participant.surname-placeholder'),
      {
        exact: false,
      }
    )
    await userEvent.type(surname, chance.name())

    const replaceBtn = screen.getByTestId('replace-submit')
    expect(replaceBtn).toBeEnabled()
  })

  it('enable replace attendee button for Level 1 Virtual course', async () => {
    const client = {
      executeQuery: vi.fn(() => never),
    } as unknown as Client

    const course = buildCourse({
      overrides: {
        deliveryType: Course_Delivery_Type_Enum.Virtual,
        level: Course_Level_Enum.Level_1,
        residingCountry: UKsCodes.GB_ENG,
        type: Course_Type_Enum.Open,
      },
    })

    const participant = {
      id: chance.guid(),
      fullName: chance.name(),
    }

    render(
      <Provider value={client}>
        <ReplaceParticipantDialog course={course} participant={participant} />
      </Provider>
    )

    const userSelector = screen.getByLabelText(
      t('components.user-selector.placeholder'),
      {
        exact: false,
      }
    )
    await userEvent.type(userSelector, chance.email())

    const firstName = screen.getByPlaceholderText(
      t('components.replace-participant.first-name-placeholder'),
      {
        exact: false,
      }
    )
    await userEvent.type(firstName, chance.name())

    const surname = screen.getByPlaceholderText(
      t('components.replace-participant.surname-placeholder'),
      {
        exact: false,
      }
    )
    await userEvent.type(surname, chance.name())

    const replaceBtn = screen.getByTestId('replace-submit')
    expect(replaceBtn).toBeDisabled()

    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete'
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input'
    )
    expect(textField).toBeInTheDocument()
    await userEvent.type(textField, 'England')

    const countryInUK = screen.getByTestId('country-GB-ENG')
    expect(countryInUK).toBeInTheDocument()
    await userEvent.click(countryInUK)

    const line1 = screen.getByLabelText(t('line1'), { exact: false })
    expect(line1).toBeInTheDocument()
    await userEvent.type(line1, 'Line 1')

    const line2 = screen.getByLabelText(t('line2'))
    expect(line2).toBeInTheDocument()

    const city = screen.getByLabelText(t('city'), { exact: false })
    expect(city).toBeInTheDocument()
    await userEvent.type(city, 'City')

    const postCode = screen.getByLabelText(
      t('components.venue-selector.modal.fields.postCode'),
      { exact: false }
    )
    expect(postCode).toBeInTheDocument()
    await userEvent.type(postCode, 'WC2N 5DU')

    expect(replaceBtn).toBeEnabled()
  })
})
