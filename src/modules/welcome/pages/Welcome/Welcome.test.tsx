import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildProfile } from '@test/mock-data-utils'

import { Welcome } from './Welcome'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('/', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders Information Required dialog if user doesnt have residing country', async () => {
    const profile = buildProfile({
      overrides: { country: undefined, countryCode: undefined },
    })
    render(<Welcome />, { auth: { profile } }, { initialEntries: ['/'] })

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByTestId('profile-country-dialog')).toBeInTheDocument()
      expect(
        within(screen.getByTestId('profile-country-dialog')).getByText(
          'Information Required',
        ),
      ).toBeInTheDocument()
    })
  })

  it('does not render dialog if user has residing country', async () => {
    const profile = buildProfile({
      overrides: {
        country: 'Romania',
      },
    })

    render(<Welcome />, { auth: { profile } }, { initialEntries: ['/'] })

    vi.runAllTimers()

    await waitFor(() => {
      expect(
        screen.queryByTestId('profile-country-dialog'),
      ).not.toBeInTheDocument()
    })
  })

  it('Pressing Go to my Profile button on Information Required dialog, navigates user to profile', async () => {
    const profile = buildProfile({
      overrides: { country: undefined, countryCode: undefined },
    })
    render(<Welcome />, { auth: { profile } }, { initialEntries: ['/'] })

    vi.runAllTimers()

    await waitFor(() => {
      expect(screen.getByTestId('profile-country-dialog')).toBeInTheDocument()
      userEvent.click(
        within(screen.getByTestId('profile-country-dialog')).getByTestId(
          'go-to-my-profile-page',
        ),
      )
      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })
  })
})
