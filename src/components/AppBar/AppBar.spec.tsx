import useSWR from 'swr'

import { chance, render, screen } from '@test/index'

import { AppBar } from './AppBar'

vi.mock('swr')
const useSWRMock = vi.mocked(useSWR)

function registerMocks(certificateCount: number, courseCount: number) {
  useSWRMock.mockReturnValueOnce({
    data: {
      certificates: { aggregate: { count: certificateCount } },
      participant: { aggregate: { count: courseCount } },
    },
    mutate: vi.fn(),
    isValidating: false,
    error: null,
    isLoading: false,
  })
}

describe(AppBar.name, () => {
  it('renders logo as expected', async () => {
    render(<AppBar />)

    const logo = screen.getByTestId('app-logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '230')
    expect(logo).toHaveAttribute('height', '48')
  })

  it('renders user name in profile button', async () => {
    registerMocks(2, 1)
    const profile = { fullName: `${chance.first()} ${chance.last()}` }

    render(<AppBar />, { auth: { profile } })

    const btn = screen.getByTestId('user-menu-btn')
    expect(btn).toHaveTextContent(`${profile.fullName}`)
  })
})
