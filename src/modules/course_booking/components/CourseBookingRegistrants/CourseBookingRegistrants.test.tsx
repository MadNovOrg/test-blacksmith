import { render, waitFor } from '@testing-library/react'
import { useTranslation } from 'react-i18next'

import { CountriesSelectorProps } from '@app/components/CountriesSelector'
import useWorldCountries from '@app/components/CountriesSelector/hooks/useWorldCountries'
import { ICountryDropdownProps } from '@app/components/CountryDropdown'
import { UserSelectorProps } from '@app/components/UserSelector/UserSelector'
import { useAuth } from '@app/context/auth'
import {
  Accreditors_Enum,
  Course_Delivery_Type_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
} from '@app/generated/graphql'

import { fireEvent, renderHook, screen } from '@test/index'

import { useBooking } from '../BookingContext'
import { FormInputs } from '../CourseBookingDetails/utils'

import { CourseBookingRegistrants } from './CourseBookingRegistrants'

vi.mock('@app/context/auth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../BookingContext', () => ({
  useBooking: vi.fn(),
}))

vi.mock('@app/components/CountriesSelector/hooks/useWorldCountries')

vi.mock('@app/components/UserSelector', () => ({
  UserSelector: ({
    onChange,
    onEmailChange,
  }: Pick<UserSelectorProps, 'onChange' | 'onEmailChange'>) => (
    <input
      data-testid="user-selector"
      onChange={e => {
        if (e.target.value.includes('@')) {
          onEmailChange(e.target.value)
        } else {
          onChange({
            id: 'mock-id',
            email: e.target.value,
            familyName: 'User',
            givenName: 'Mock',
          })
        }
      }}
    />
  ),
}))

vi.mock('@app/components/CountriesSelector', () => ({
  __esModule: true,
  default: ({
    index,
    onChange,
    value,
  }: Pick<CountriesSelectorProps, 'onChange' | 'index' | 'value'>) => (
    <select
      data-testid={`countries-selector${
        index !== undefined ? `-${index}` : ''
      }`}
      value={value || ''}
      onChange={e => onChange(e, e.target.value)}
    >
      <option value="US">United States</option>
      <option value="GB">United Kingdom</option>
    </select>
  ),
}))

vi.mock('@app/components/CountryDropdown', () => ({
  CountryDropdown: ({
    register,
  }: Pick<ICountryDropdownProps, 'register' | 'error'>) => (
    <select data-testid="country-dropdown" {...register}>
      <option value="US">United States</option>
    </select>
  ),
}))

describe('CourseBookingRegistrants', () => {
  const mockRegister = vi.fn()
  const mockSetValue = vi.fn()
  const mockTrigger = vi.fn()
  const mockGetLabel = vi.fn(code =>
    code === 'GB' ? 'United Kingdom' : 'United States',
  )
  const mockUseAuth = vi.mocked(useAuth)
  const mockUseBooking = vi.mocked(useBooking)
  const mockUseWorldCountries = vi.mocked(useWorldCountries)

  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks()

    // Setup default mocks
    mockUseAuth.mockReturnValue({
      acl: {
        isAdmin: vi.fn().mockReturnValue(false),
        isOrgAdmin: vi.fn().mockReturnValue(false),
      },
    } as unknown as ReturnType<typeof useAuth>)

    mockUseBooking.mockReturnValue({
      course: {
        accreditedBy: Accreditors_Enum.Icm,
        type: Course_Type_Enum.Open,
        deliveryType: Course_Delivery_Type_Enum.Virtual,
        level: Course_Level_Enum.Level_1,
        residingCountry: 'GB-ENG',
      },
      booking: {
        participants: [{ email: 'participant1@test.com' }],
      },
    } as unknown as ReturnType<typeof useBooking>)

    mockUseWorldCountries.mockReturnValue({
      getLabel: mockGetLabel,
      isUKCountry: vi.fn().mockReturnValue(true),
    } as unknown as ReturnType<typeof useWorldCountries>)

    mockRegister.mockImplementation(name => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    }))
  })

  it('renders participant fields', () => {
    render(
      <CourseBookingRegistrants
        errors={{}}
        register={mockRegister}
        setValue={mockSetValue}
        trigger={mockTrigger}
        values={
          {
            orgId: 'org1',
            participants: [
              {
                email: '',
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: '',
                residingCountry: '',
                residingCountryCode: null,
                hasResidingCountry: false,
              },
            ],
          } as unknown as FormInputs
        }
      />,
    )

    expect(screen.getByTestId('user-selector')).toBeInTheDocument()
    expect(screen.getByText(t('first-name'))).toBeInTheDocument()
    expect(screen.getByText(t('surname'))).toBeInTheDocument()
    expect(screen.getByTestId('countries-selector-0')).toBeInTheDocument()
  })

  it('shows address fields when required', () => {
    render(
      <CourseBookingRegistrants
        errors={{}}
        register={mockRegister}
        setValue={mockSetValue}
        trigger={mockTrigger}
        values={
          {
            orgId: 'org1',
            participants: [
              {
                email: '',
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: '',
                residingCountry: '',
                residingCountryCode: null,
                hasResidingCountry: false,
              },
            ],
          } as unknown as FormInputs
        }
      />,
    )

    expect(screen.getByText(t('common.postal-address'))).toBeInTheDocument()
    expect(screen.getByText(t('line1'))).toBeInTheDocument()
    expect(screen.getByText(t('city'))).toBeInTheDocument()
  })

  it('handles user selection', async () => {
    render(
      <CourseBookingRegistrants
        errors={{}}
        register={mockRegister}
        setValue={mockSetValue}
        trigger={mockTrigger}
        values={
          {
            orgId: 'org1',
            participants: [
              {
                email: '',
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: '',
                residingCountry: '',
                residingCountryCode: null,
                hasResidingCountry: false,
              },
            ],
          } as unknown as FormInputs
        }
      />,
    )

    const userSelector = screen.getByTestId('user-selector')
    fireEvent.change(userSelector, { target: { value: 'selected@user.com' } })

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith(
        'participants.0',
        expect.objectContaining({
          email: 'selected@user.com',
        }),
      )
    })
  })

  it('handles manual email entry', async () => {
    render(
      <CourseBookingRegistrants
        errors={{}}
        register={mockRegister}
        setValue={mockSetValue}
        trigger={mockTrigger}
        values={
          {
            orgId: 'org1',
            participants: [
              {
                email: '',
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: '',
                residingCountry: '',
                residingCountryCode: null,
                hasResidingCountry: false,
              },
            ],
          } as unknown as FormInputs
        }
      />,
    )

    const userSelector = screen.getByTestId('user-selector')
    fireEvent.change(userSelector, { target: { value: 'manual@entry.com' } })

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith(
        'participants.0',
        expect.objectContaining({
          email: 'manual@entry.com',
          hasResidingCountry: false,
        }),
      )
    })
  })

  it('handles country change', async () => {
    render(
      <CourseBookingRegistrants
        errors={{}}
        register={mockRegister}
        setValue={mockSetValue}
        trigger={mockTrigger}
        values={
          {
            orgId: 'org1',
            participants: [
              {
                email: '',
                firstName: '',
                lastName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: '',
                residingCountry: '',
                residingCountryCode: null,
                hasResidingCountry: false,
              },
            ],
          } as unknown as FormInputs
        }
      />,
    )

    const countrySelector = screen.getByTestId('countries-selector-0')
    fireEvent.change(countrySelector, { target: { value: 'GB' } })

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith(
        'participants.0.residingCountryCode',
        'GB',
        { shouldValidate: true },
      )
    })
  })
})
