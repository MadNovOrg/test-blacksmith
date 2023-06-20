import { Route, Routes } from 'react-router-dom'
import useSWR from 'swr'

import { RoleName } from '@app/types'

import { chance, render, screen, userEvent } from '@test/index'

import { AppBar } from './AppBar'

jest.mock('swr')
const useSWRMock = jest.mocked(useSWR)

function registerMocks(certificateCount: number, courseCount: number) {
  useSWRMock.mockReturnValueOnce({
    data: {
      certificates: { aggregate: { count: certificateCount } },
      participant: { aggregate: { count: courseCount } },
    },
    mutate: jest.fn(),
    isValidating: false,
    error: null,
    isLoading: false,
  })
}

describe('component: AppBar', () => {
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

  it('renders membership link if user can access membership area', async () => {
    render(
      <>
        <AppBar />
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route path="/membership" element={<p>Membership page</p>} />
        </Routes>
      </>,
      { auth: { verified: true, activeRole: RoleName.TRAINER } }
    )

    await userEvent.click(screen.getByText('Membership'))
    expect(screen.getByText('Membership page')).toBeInTheDocument()
  })
})
