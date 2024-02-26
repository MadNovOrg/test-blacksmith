import React from 'react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { XeroCallbackMutation, XeroConnectQuery } from '@app/generated/graphql'

import { render, screen, chance, waitFor } from '@test/index'

import { XeroConnect } from './XeroConnect'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

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
    const client = {
      executeQuery: () =>
        fromValue<{ data: XeroConnectQuery }>({
          data: { xeroConnect: { consentUrl } },
        }),
      executeMutation: vi.fn(),
    }

    render(
      <Provider value={client as unknown as Client}>
        <XeroConnect />
      </Provider>
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('XeroConnect-loading')
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('XeroConnect-connect')).toBeInTheDocument()
    })
  })
  // Todo: update this as right now is not testing what it should -> mockLocationHref is false at first wich triggers executeQuery instead of executeMutation
  it.skip('tests running of the xero callback mutation', async () => {
    const url = `http://localhost?code=${chance.word()}`
    mockLocationHref.mockReturnValue(url)

    const client = {
      executeQuery: vi.fn(),
      executeMutation: () =>
        fromValue<{ data: XeroCallbackMutation }>({
          data: {
            xeroCallback: {
              status: true,
            },
          },
        }),
    }

    render(
      <Provider value={client as unknown as Client}>
        <XeroConnect />
      </Provider>
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('XeroConnect-loading')
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('XeroConnect-connected')).toBeInTheDocument()
    })
  })
})
