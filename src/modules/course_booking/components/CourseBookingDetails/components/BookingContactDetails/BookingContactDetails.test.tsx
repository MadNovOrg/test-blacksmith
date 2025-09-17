import { useTranslation } from 'react-i18next'
import { MockedFunction } from 'vitest'

import { useAuth } from '@app/context/auth'
import { AuthContextType } from '@app/context/auth/types'

import { _render, renderHook, waitFor } from '@test/index'
import { chance, screen } from '@test/index'

import { FormInputs } from '../../utils'

import { BookingContactDetails } from './BookingContactDetails'

vi.mock('@app/context/auth')

const mockUseAuth = useAuth as MockedFunction<typeof useAuth>

describe('BookingContactDetails', () => {
  const mockProfile = {
    countryCode: 'GB-ENG',
    email: chance.email(),
    familyName: chance.last(),
    givenName: chance.first(),
  }

  mockUseAuth.mockReturnValue({
    acl: {
      canInviteAttendees: vi.fn().mockReturnValue(false),
      isAustralia: vi.fn().mockReturnValue(false),
    },
    profile: mockProfile,
  } as unknown as AuthContextType)

  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  const mockErrors = {}
  const mockRegister = vi.fn()
  const mockSetValue = vi.fn()
  const mockValues = {
    bookingContact: {
      email: '',
      firstName: '',
      lastName: '',
      residingCountry: null,
      residingCountryCode: '',
    },
    orgId: chance.guid(),
  } as FormInputs

  it('renders correctly', () => {
    _render(
      <BookingContactDetails
        errors={mockErrors}
        register={mockRegister}
        setValue={mockSetValue}
        values={mockValues}
      />,
    )

    expect(
      screen.getByText(t('components.course-form.booking-contact')),
    ).toBeInTheDocument()
    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument()
    expect(
      screen.getByLabelText(t('first-name'), { exact: false }),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(t('surname'), { exact: false }),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(t('residing-country'), { exact: false }),
    ).toBeInTheDocument()
  })

  it('pre-fills form with user profile data when not internal user booking', async () => {
    _render(
      <BookingContactDetails
        register={mockRegister}
        errors={mockErrors}
        setValue={mockSetValue}
        values={mockValues}
      />,
    )

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('bookingContact', {
        email: mockProfile.email,
        firstName: mockProfile.givenName,
        lastName: mockProfile.familyName,
        residingCountry: 'England',
        residingCountryCode: mockProfile.countryCode,
      })
    })
  })

  it('does not pre-fill form when user is internal booking', () => {
    mockUseAuth.mockReturnValue({
      acl: {
        canInviteAttendees: vi.fn().mockReturnValue(true),
        isAustralia: vi.fn().mockReturnValue(false),
      },
      profile: mockProfile,
    } as unknown as AuthContextType)

    _render(
      <BookingContactDetails
        register={mockRegister}
        errors={mockErrors}
        setValue={mockSetValue}
        values={mockValues}
      />,
    )

    expect(mockSetValue).not.toHaveBeenCalled()
  })
})
