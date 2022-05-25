import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { render, screen, chance, waitForCalls } from '@test/index'

import { XeroConnect } from './XeroConnect'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockFetcher = jest.fn()
jest.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

const _render = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

const savedLocation = window.location
const mockLocationHref = jest.fn(() => savedLocation.href)

describe('page: XeroConnect', () => {
  beforeAll(() => {
    // @ts-expect-error removing default location
    delete window.location

    window.location = Object.defineProperties({} as Location, {
      href: { get: mockLocationHref },
      search: { get: () => new URL(window.location.href).search },
    })
  })

  afterAll(() => {
    window.location = savedLocation
  })

  it('renders loading and calls XeroConnect', async () => {
    const consentUrl = chance.url()
    mockFetcher.mockResolvedValueOnce({ xeroConnect: { consentUrl } })

    _render(<XeroConnect />)

    expect(screen.queryByTestId('XeroConnect-loading')).toBeInTheDocument()

    await waitForCalls(mockFetcher)

    expect(mockFetcher).toBeCalledWith(
      expect.stringContaining('query XeroConnect')
    )

    expect(screen.queryByTestId('XeroConnect-loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('XeroConnect-connect')).toBeInTheDocument()
  })

  it('renders loading and calls XeroCallback', async () => {
    const url = `http://localhost?code=${chance.word()}`
    mockLocationHref.mockReturnValue(url)

    mockFetcher.mockResolvedValueOnce({ status: true })

    _render(<XeroConnect />)

    expect(screen.queryByTestId('XeroConnect-loading')).toBeInTheDocument()

    await waitForCalls(mockFetcher)

    expect(mockFetcher).toBeCalledWith(
      expect.stringContaining('mutation XeroCallback'),
      { input: { url } }
    )

    expect(screen.queryByTestId('XeroConnect-loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('XeroConnect-connected')).toBeInTheDocument()
  })
})
