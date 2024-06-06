import { noop } from 'ts-essentials'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrganizationsQuery } from '@app/generated/graphql'

import { render, screen, userEvent, waitFor, within } from '@test/index'
import { buildOrganization, buildProfile } from '@test/mock-data-utils'

import { OrgSelector } from '.'

describe('component: OrgSelector', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  const profile = buildProfile({
    overrides: {
      organizations: [
        {
          isAdmin: false,
          organization: buildOrganization({
            overrides: {
              id: '1',
              name: 'My Org',
            },
          }),
        },
      ],
    },
  })

  it("doesn't display options initially", async () => {
    render(<OrgSelector onChange={noop} />, { auth: { profile } })

    await userEvent.click(
      screen.getByPlaceholderText('Start typing organisation', { exact: false })
    )

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('loads organizations when the user types organization name', async () => {
    const ORG_SEARCH_NAME = 'My Org'
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganizationsQuery }>({
          data: {
            orgs: [
              buildOrganization({
                overrides: {
                  name: ORG_SEARCH_NAME,
                },
              }) as GetOrganizationsQuery['orgs'][0],
            ],
          },
        }),
    } as unknown as Client
    render(
      <Provider value={client}>
        <OrgSelector onChange={noop} />
      </Provider>,
      { auth: { profile } }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Start typing organisation', {
        exact: false,
      }),
      ORG_SEARCH_NAME
    )

    vi.runAllTimers()

    await waitFor(() =>
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    )
  })

  it('should split results based on current user orgs', async () => {
    const orgs = [
      buildOrganization({
        overrides: {
          id: '1',
          name: 'My Org',
        },
      }),
      buildOrganization({
        overrides: {
          id: '2',
          name: 'Other Org',
        },
      }),
    ] as GetOrganizationsQuery['orgs']

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganizationsQuery }>({
          data: {
            orgs,
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgSelector onChange={noop} />
      </Provider>,
      { auth: { profile } }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Start typing organisation', {
        exact: false,
      }),
      'Org'
    )

    vi.runAllTimers()

    await waitFor(() => {
      const myOrgsGroup = screen.getByTestId(
        'org-selector-result-group-My organisations'
      )
      expect(myOrgsGroup).toBeInTheDocument()
      within(myOrgsGroup).getByTestId(`org-selector-result-${orgs[0].id}`)
      const foundInHubGroup = screen.getByTestId(
        'org-selector-result-group-Found in Team Teach Connect'
      )
      expect(foundInHubGroup).toBeInTheDocument()
      within(foundInHubGroup).getByTestId(`org-selector-result-${orgs[1].id}`)
    })
  })

  it('calls callback when the user makes the selection', async () => {
    const ORG_SEARCH_NAME = 'Organization'
    const onChangeMock = vi.fn()
    const organization = buildOrganization({
      overrides: {
        name: ORG_SEARCH_NAME,
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganizationsQuery }>({
          data: {
            orgs: [organization] as GetOrganizationsQuery['orgs'],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgSelector onChange={onChangeMock} />
      </Provider>,
      { auth: { profile } }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Start typing organisation', {
        exact: false,
      }),
      ORG_SEARCH_NAME
    )

    vi.runAllTimers()

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()
    })

    await userEvent.click(
      within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
    )

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledTimes(1)
      expect(onChangeMock).toHaveBeenCalledWith(organization)
    })
  })

  it('displays *Organisation Enquiry* button when country is one of UK countries', async () => {
    const ORG_SEARCH_NAME = 'Organization'
    const onChangeMock = vi.fn()
    const organization = buildOrganization({
      overrides: {
        name: ORG_SEARCH_NAME,
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganizationsQuery }>({
          data: {
            orgs: [organization] as GetOrganizationsQuery['orgs'],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgSelector
          onChange={onChangeMock}
          allowAdding={true}
          countryCode="GB-ENG"
        />
      </Provider>,
      { auth: { profile } }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Start typing organisation', {
        exact: false,
      }),
      'Test'
    )

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()

      expect(screen.getByTestId('new-organisation')).toBeInTheDocument()

      expect(screen.getByTestId('new-organisation')).toHaveTextContent(
        'Organisation Enquiry'
      )
    })
  })

  it('displays *Create* button when country is not one of UK countries', async () => {
    const ORG_SEARCH_NAME = 'Organization'
    const onChangeMock = vi.fn()
    const organization = buildOrganization({
      overrides: {
        name: ORG_SEARCH_NAME,
      },
    })

    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganizationsQuery }>({
          data: {
            orgs: [organization] as GetOrganizationsQuery['orgs'],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrgSelector
          onChange={onChangeMock}
          allowAdding={true}
          countryCode="AT"
        />
      </Provider>,
      { auth: { profile } }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Start typing organisation', {
        exact: false,
      }),
      'Test'
    )

    await waitFor(() => {
      expect(
        within(screen.getByRole('listbox')).getByText(ORG_SEARCH_NAME)
      ).toBeInTheDocument()

      expect(screen.getByTestId('new-organisation')).toBeInTheDocument()

      expect(screen.getByTestId('new-organisation')).toHaveTextContent('Create')
    })
  })
})
