import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, vi, beforeEach, expect } from 'vitest'

import { Dialog } from '../dialogs'

import {
  OrganisationAdminNominationSplashScreen,
  isNotTargetPage,
} from './OrganisationAdminNominationSplashScreen'

const mockUseProfileHook = vi.fn()
vi.mock(
  '@app/hooks/useProfileOrgAdminNominationSplashScreen/useProfileOrgAdminNominationSplashScreen',
  () => ({
    useProfileOrgAdminNominationSplashScreen: () => mockUseProfileHook(),
  }),
)

const mockUseLocation = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  }
})

vi.mock('../dialogs/Dialog', () => ({
  Dialog: ({ children, open, slots }: ComponentProps<typeof Dialog>) =>
    open ? (
      <div data-testid="dialog">
        {slots?.Title && <slots.Title />}
        {children}
      </div>
    ) : null,
}))

i18n.init({
  lng: 'en',
  resources: { en: { translation: {} } },
})

const theme = createTheme()
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </ThemeProvider>
  </BrowserRouter>
)

describe('isNotTargetPage', () => {
  it('returns true for excluded pages', () => {
    ;['login', 'registration', 'accept-invite'].forEach(path => {
      expect(isNotTargetPage(`/${path}`)).toBe(true)
    })
  })

  it('returns false for dashboard', () => {
    expect(isNotTargetPage('/dashboard')).toBe(false)
  })
})

describe('OrganisationAdminNominationSplashScreen', () => {
  const insertFn = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ pathname: '/dashboard' })
    mockUseProfileHook.mockReturnValue({
      isOrgAdminNominationSplashScreenEnabled: true,
      insertSubmissionOfOrgAdminNominationSplashScreen: insertFn,
    })
  })

  it('renders dialog when enabled and on valid page', () => {
    render(
      <TestWrapper>
        <OrganisationAdminNominationSplashScreen />
      </TestWrapper>,
    )
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(
        'components.organisation-admin-nomination-splash-screen.title',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'components.organisation-admin-nomination-splash-screen.body',
      ),
    ).toBeInTheDocument()
  })

  it('returns null when not enabled', () => {
    mockUseProfileHook.mockReturnValue({
      isOrgAdminNominationSplashScreenEnabled: false,
      insertSubmissionOfOrgAdminNominationSplashScreen: insertFn,
    })
    const { container } = render(
      <TestWrapper>
        <OrganisationAdminNominationSplashScreen />
      </TestWrapper>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null on excluded page', () => {
    mockUseLocation.mockReturnValue({ pathname: '/login' })
    const { container } = render(
      <TestWrapper>
        <OrganisationAdminNominationSplashScreen />
      </TestWrapper>,
    )
    expect(container.firstChild).toBeNull()
  })
})
