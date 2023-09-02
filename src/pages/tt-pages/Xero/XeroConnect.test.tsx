import React from 'react'

import { render, screen, chance, waitFor } from '@test/index'

import { XeroConnect } from './XeroConnect'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

const mockFetcher = vi.fn()
vi.mock('@app/hooks/use-fetcher', () => ({
  useFetcher: () => mockFetcher,
}))

const _render = (ui: React.ReactElement) => {
  return render(<>{ui}</>)
}

const savedLocation = window.location
const mockLocationHref = vi.fn(() => savedLocation.href)

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

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(1)

      expect(mockFetcher).toHaveBeenCalledWith(
        expect.stringContaining('query XeroConnect')
      )

      expect(
        screen.queryByTestId('XeroConnect-loading')
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('XeroConnect-connect')).toBeInTheDocument()
    })
  })

  it('renders loading and calls XeroCallback', async () => {
    const url = `http://localhost?code=${chance.word()}`
    mockLocationHref.mockReturnValue(url)

    mockFetcher.mockResolvedValueOnce({ xeroCallback: { status: true } })

    _render(<XeroConnect />)

    expect(screen.queryByTestId('XeroConnect-loading')).toBeInTheDocument()

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(1)

      expect(mockFetcher).toHaveBeenCalledWith(
        expect.stringContaining('mutation XeroCallback'),
        { input: { url } }
      )

      expect(
        screen.queryByTestId('XeroConnect-loading')
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('XeroConnect-connected')).toBeInTheDocument()
    })
  })
})
