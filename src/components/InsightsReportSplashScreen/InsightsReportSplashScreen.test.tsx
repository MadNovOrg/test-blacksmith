import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { ComponentProps } from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Dialog } from '../dialogs'

import {
  InsightsReportSplashScreen,
  isNotTargetPage,
} from './InsightsReportSplashScreen'

const mockUseProfileInsightsReportSplashScreen = vi.fn()
vi.mock(
  '@app/hooks/useProfileInsightsReportSplashScreen/useProfileInsightsReportSplashScreen',
  () => ({
    useProfileInsightsReportSplashScreen: () =>
      mockUseProfileInsightsReportSplashScreen(),
  }),
)

vi.mock('@app/components/dialogs', () => ({
  Dialog: ({ children, open, slots }: ComponentProps<typeof Dialog>) =>
    open ? (
      <div data-testid="dialog">
        {slots?.Title && <slots.Title />}
        {children}
      </div>
    ) : null,
}))

const mockUseLocation = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  }
})

i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'components.insights-report-splash-screen.one-managed-org-title':
          'One Organization Title',
        'components.insights-report-splash-screen.multiple-managed-orgs-title':
          'Multiple Organizations Title',
        'components.insights-report-splash-screen.one-managed-org-body':
          'One organization body text',
        'components.insights-report-splash-screen.multiple-managed-orgs-body':
          'Multiple organizations body text',
        'components.insights-report-splash-screen.one-managed-org-subtitle':
          'One organization subtitle',
        'components.insights-report-splash-screen.multiple-managed-orgs-subtitle':
          'Multiple organizations subtitle',
      },
    },
  },
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
  describe('single path segments', () => {
    it('should return true for excluded single paths', () => {
      const excludedPaths = [
        'accept-invite',
        'accept-org-invite',
        'auto-login',
        'invitation',
        'login',
        'onboarding',
        'org-invitation',
        'registration',
        'verify',
      ]

      excludedPaths.forEach(path => {
        expect(isNotTargetPage(`/${path}`)).toBe(true)
        expect(isNotTargetPage(`/${path}/`)).toBe(true) // with trailing slash
        expect(isNotTargetPage(path)).toBe(true) // without leading slash
      })
    })

    it('should return true for organisations path', () => {
      expect(isNotTargetPage('/organisations')).toBe(true)
      expect(isNotTargetPage('/organisations/')).toBe(true)
      expect(isNotTargetPage('organisations')).toBe(true)
    })

    it('should return false for other single paths', () => {
      expect(isNotTargetPage('/dashboard')).toBe(false)
      expect(isNotTargetPage('/profile')).toBe(false)
      expect(isNotTargetPage('/settings')).toBe(false)
    })
  })

  describe('organisations with UUID paths', () => {
    it('should return true for valid organisations/UUID paths', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'A1B2C3D4-E5F6-7890-ABCD-EF1234567890', // uppercase
        '12345678-1234-1234-1234-123456789abc', // mixed case
      ]

      validUUIDs.forEach(uuid => {
        expect(isNotTargetPage(`/organisations/${uuid}`)).toBe(true)
        expect(isNotTargetPage(`/organisations/${uuid}/`)).toBe(true)
        expect(isNotTargetPage(`organisations/${uuid}`)).toBe(true)
      })
    })

    it('should return false for invalid organisations UUID paths', () => {
      const invalidUUIDs = [
        'organisations/invalid-uuid',
        'organisations/123',
        'organisations/550e8400-e29b-41d4-a716', // too short
        'organisations/550e8400-e29b-41d4-a716-446655440000-extra', // too long
        'organisations/550e8400-e29b-41d4-a716-44665544000g', // invalid character
      ]

      invalidUUIDs.forEach(path => {
        expect(isNotTargetPage(`/${path}`)).toBe(false)
      })
    })
  })

  describe('other path patterns', () => {
    it('should return false for paths with more than 2 segments', () => {
      expect(isNotTargetPage('/organisations/uuid/extra')).toBe(false)
      expect(isNotTargetPage('/some/other/path')).toBe(false)
    })

    it('should return false for empty or root paths', () => {
      expect(isNotTargetPage('')).toBe(false)
      expect(isNotTargetPage('/')).toBe(false)
    })
  })
})

describe('InsightsReportSplashScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ pathname: '/dashboard' })
  })

  describe('rendering conditions', () => {
    it('should return null when no managed organizations', () => {
      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: [],
      })

      const { container } = render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      expect(container.firstChild).toBeNull()
    })

    it('should return null when on excluded page and pathname ends with orgId', () => {
      const mockOrgs = [
        { orgId: '550e8400-e29b-41d4-a716-446655440000', name: 'Org 1' },
      ]

      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: mockOrgs,
      })

      mockUseLocation.mockReturnValue({
        pathname: 'organisations/550e8400-e29b-41d4-a716-446655440000',
      })

      const { container } = render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render when conditions are met', () => {
      const mockOrgs = [
        {
          orgId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Organization 1',
        },
      ]

      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: mockOrgs,
      })

      render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })
  })

  describe('single organization rendering', () => {
    it('should display correct content for single organization', () => {
      const mockOrgs = [
        {
          orgId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Organization',
        },
      ]

      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: mockOrgs,
      })

      render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      expect(screen.getByText('One Organization Title')).toBeInTheDocument()
      expect(screen.getByText('One organization body text')).toBeInTheDocument()
      expect(screen.getByText('One organization subtitle')).toBeInTheDocument()
      expect(screen.getByText('Test Organization')).toBeInTheDocument()
    })

    it('should create correct link for single organization', () => {
      const mockOrgs = [
        {
          orgId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Organization',
        },
      ]

      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: mockOrgs,
      })

      render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      const link = screen.getByRole('link', { name: 'Test Organization' })
      expect(link).toHaveAttribute(
        'href',
        '/organisations/550e8400-e29b-41d4-a716-446655440000',
      )
    })
  })

  describe('multiple organizations rendering', () => {
    it('should display correct content for multiple organizations', () => {
      const mockOrgs = [
        {
          orgId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Organization 1',
        },
        {
          orgId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Organization 2',
        },
      ]

      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: mockOrgs,
      })

      render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      expect(
        screen.getByText('Multiple Organizations Title'),
      ).toBeInTheDocument()
      expect(
        screen.getByText('Multiple organizations body text'),
      ).toBeInTheDocument()
      expect(
        screen.getByText('Multiple organizations subtitle'),
      ).toBeInTheDocument()
      expect(screen.getByText('Organization 1')).toBeInTheDocument()
      expect(screen.getByText('Organization 2')).toBeInTheDocument()
    })

    it('should create correct links for multiple organizations', () => {
      const mockOrgs = [
        {
          orgId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Organization 1',
        },
        {
          orgId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Organization 2',
        },
      ]

      mockUseProfileInsightsReportSplashScreen.mockReturnValue({
        managedOrgsWithDashboardUrls: mockOrgs,
      })

      render(
        <TestWrapper>
          <InsightsReportSplashScreen />
        </TestWrapper>,
      )

      const link1 = screen.getByRole('link', { name: 'Organization 1' })
      const link2 = screen.getByRole('link', { name: 'Organization 2' })

      expect(link1).toHaveAttribute(
        'href',
        '/organisations/550e8400-e29b-41d4-a716-446655440000',
      )
      expect(link2).toHaveAttribute(
        'href',
        '/organisations/f47ac10b-58cc-4372-a567-0e02b2c3d479',
      )
    })
  })
})
