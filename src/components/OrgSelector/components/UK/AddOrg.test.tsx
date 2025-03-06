import { DocumentNode } from 'graphql'
import { useTranslation } from 'react-i18next'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Cud_Operation_Enum,
  FindEstablishmentQuery,
  GetOrganizationsQuery,
  GetOrgTypesQuery,
  Org_Created_From_Enum,
} from '@app/generated/graphql'
import { GET_ORG_TYPES } from '@app/modules/organisation/queries/get-org-types'
import { AwsRegions, RoleName } from '@app/types'

import {
  render,
  screen,
  fireEvent,
  renderHook,
  chance,
  userEvent,
  within,
  waitFor,
} from '@test/index'

import { FIND_ESTABLISHMENTS } from '../../queries/find-establishment'
import { GET_ORGANIZATIONS } from '../../queries/get-organizations'

import { AddOrg } from './AddOrg'
import { GET_DFE_REGISTERED_ORGANISATION } from './queries'

const option = {
  id: 'id',
  urn: 'urn',
  name: 'name',
}

const mockQuery = vi.fn().mockReturnValue({
  toPromise: vi.fn().mockResolvedValue({
    data: {
      dfe_establishment: [
        {
          registered: false,
          organizations: [],
          __typename: 'dfe_establishment',
        },
      ],
    },
  }),
})

vi.mock('urql', async () => {
  const actual = await vi.importActual('urql')
  return {
    ...actual,
    useClient: () => ({
      query: mockQuery,
    }),
  }
})

const useInsertNewOrganisationMock = vi.fn().mockResolvedValue({
  data: { org: { id: 'id', name: option.name } },
})
vi.mock('@app/hooks/useInsertNewOrganisationLead', async () => {
  const actual = await vi.importActual(
    '@app/hooks/useInsertNewOrganisationLead',
  )
  return {
    ...actual,
    useInsertNewOrganization: () => [
      {
        fetching: false,
        error: undefined,
        data: { org: { id: 'id', name: option.name } },
      },
      useInsertNewOrganisationMock,
    ],
  }
})

const useInsertOrgLogMock = vi.fn()
vi.mock('@app/modules/organisation/queries/insert-org-log', async () => {
  const actual = await vi.importActual(
    '@app/modules/organisation/queries/insert-org-log',
  )
  return {
    ...actual,
    useInsertOrganisationLog: () => [
      {
        fetching: false,
        error: undefined,
        data: { org_log: { id: chance.guid() } },
      },
      useInsertOrgLogMock,
    ],
  }
})

describe('AddOrg component', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const labels = Object.values(
    t('components.add-organisation.fields', { returnObjects: true }),
  )
  it.each([
    t('components.add-organisation.component-title'),
    t('pages.create-organization.fields.addresses.postalAndZipCode'),
    ...labels.filter(
      label =>
        label !== t('components.add-organisation.fields.zipCode') &&
        label !== t('components.add-organisation.fields.postCode') &&
        label !==
          t('components.add-organisation.fields.organisation-specify-other') &&
        label !== t('components.add-organisation.fields.region') &&
        label !== t('components.add-organisation.fields.stateTerritory') &&
        label !== t('components.add-organisation.fields.state') &&
        label !== t('components.add-organisation.fields.territory') &&
        label !== t('components.add-organisation.fields.organisation-phone'),
    ),
  ])('renders % field', async field => {
    render(
      <AddOrg
        option={option}
        countryCode={'GB-ENG'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it.each([
    t('components.add-organisation.component-title'),
    t('pages.create-organization.fields.addresses.postalAndZipCode'),
    ...labels.filter(
      label =>
        label !== t('components.add-organisation.fields.postCode') &&
        label !== t('components.add-organisation.fields.zipCode') &&
        label !==
          t('components.add-organisation.fields.organisation-specify-other') &&
        label !== t('components.add-organisation.fields.region') &&
        label !== t('components.add-organisation.fields.stateTerritory') &&
        label !== t('components.add-organisation.fields.state') &&
        label !== t('components.add-organisation.fields.territory') &&
        label !== t('components.add-organisation.fields.organisation-phone'),
    ),
  ])('renders % field', async field => {
    render(
      <AddOrg
        option={option}
        countryCode={'RO'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it('should display the Postcode tooltip message on hover', async () => {
    render(
      <AddOrg
        option={option}
        countryCode={'GB-ENG'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('Add Organisation')).toBeInTheDocument()

    const tooltipElement = screen.getByTestId('post-code-tooltip')

    fireEvent.mouseOver(tooltipElement)
    const tooltipMessage = await screen.findByText(
      t('common.post-code-tooltip'),
    )
    expect(tooltipMessage).toBeInTheDocument()
  })

  it.each(Object.values(Org_Created_From_Enum))(
    'should call submit function and attempt insert log for non dfe org from page %s',
    async createdFrom => {
      vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
      const client = {
        executeQuery: ({ query }: { query: DocumentNode }) => {
          if (query === GET_ORG_TYPES) {
            return fromValue<{ data: GetOrgTypesQuery }>({
              data: {
                organization_type: [{ id: 'type1', name: 'UTC' }],
              },
            })
          }
          return never
        },
      }

      render(
        <Provider value={client as unknown as Client}>
          <AddOrg
            option={{ name: option.name }}
            countryCode={'GB-ENG'}
            onSuccess={vi.fn()}
            onClose={vi.fn()}
            createdFrom={createdFrom}
          />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
            profile: { id: 'user-id' },
          },
        },
      )

      const address = {
        line1: 'test',
        line2: '',
        city: 'test',
        country: 'England',
        countryCode: 'GB-ENG',
        postCode: 'WC2N 4JL',
      }
      const orgEmail = 'testare@teamteach.testinator.com'

      expect(screen.getByText('Add Organisation')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId('addr-line1'), {
        target: { value: address.line1 },
      })

      fireEvent.change(screen.getByTestId('city'), {
        target: { value: address.city },
      })
      fireEvent.change(screen.getByTestId('postCode'), {
        target: { value: address.postCode },
      })

      const sector = screen.getByTestId('sector-select')
      await userEvent.click(within(sector).getByRole('button'))
      const sectorOption = screen.getByTestId('sector-edu')
      await userEvent.click(sectorOption)

      const orgType = screen.getByLabelText('Organisation type', {
        exact: false,
      })
      await userEvent.click(orgType)

      const typeOption = screen.getByTestId('type-UTC')
      await userEvent.click(typeOption)

      fireEvent.change(screen.getByTestId('org-email'), {
        target: { value: orgEmail },
      })
      const submitButton = screen.getByTestId('add-org-form-submit-btn')

      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(useInsertNewOrganisationMock).toHaveBeenCalledTimes(1)
        expect(useInsertNewOrganisationMock).toHaveBeenCalledWith({
          name: option.name,
          sector: 'edu',
          orgType: 'UTC',
          address: address,
          attributes: { email: orgEmail },
          dfeId: undefined,
        })
      })

      expect(useInsertOrgLogMock).toHaveBeenCalledTimes(1)
      expect(useInsertOrgLogMock).toHaveBeenCalledWith({
        orgId: 'id',
        userId: 'user-id',
        createfrom: createdFrom,
        op: Cud_Operation_Enum.Create,
        updated_columns: {
          old: null,
          new: {
            id: 'id',
            name: option.name,
          },
        },
      })
    },
  )

  it.each(Object.values(Org_Created_From_Enum))(
    'should call submit function and attempt insert log on dfe org from page %s',
    async createdFrom => {
      vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
      const orgName = option.name
      const address = {
        line1: 'test',
        line2: '',
        city: 'test',
        country: 'England',
        countryCode: 'GB-ENG',
        postCode: 'WC2N 4JL',
      }
      const orgEmail = 'testare@teamteach.testinator.com'
      const client = {
        executeQuery: ({ query }: { query: DocumentNode }) => {
          if (query === GET_ORG_TYPES) {
            return fromValue<{ data: GetOrgTypesQuery }>({
              data: {
                organization_type: [{ id: 'type1', name: 'UTC' }],
              },
            })
          }
          if (query === GET_ORGANIZATIONS) {
            return fromValue<{ data: GetOrganizationsQuery }>({
              data: {
                orgs: [] as GetOrganizationsQuery['orgs'],
              },
            })
          }
          if (query === FIND_ESTABLISHMENTS) {
            return fromValue<{ data: FindEstablishmentQuery }>({
              data: {
                establishments: [
                  {
                    id: '7deb7243-2248-4b6c-97e8-fa01a822ca5e',
                    urn: '100031',
                    name: orgName,
                    localAuthority: 'Camden',
                    trustType: null,
                    trustName: null,
                    addressLineOne: address.line1,
                    addressLineTwo: address.line2,
                    addressLineThree: null,
                    town: address.city,
                    county: null,
                    postcode: address.postCode,
                    headTitle: 'Mr',
                    headFirstName: 'Allan',
                    headLastName: 'McLean',
                    headJobTitle: null,
                    ofstedRating: 'Good',
                    ofstedLastInspection: '2019-06-17T22:00:00.000Z',
                    __typename: 'dfe_establishment',
                  },
                ] as FindEstablishmentQuery['establishments'],
                total: {
                  aggregate: {
                    count: 1,
                  },
                },
              },
            })
          }
          return never
        },
      }

      render(
        <Provider value={client as unknown as Client}>
          <AddOrg
            option={option}
            countryCode={'GB-ENG'}
            onSuccess={vi.fn()}
            onClose={vi.fn()}
            createdFrom={createdFrom}
          />
        </Provider>,
        {
          auth: {
            activeRole: RoleName.TT_ADMIN,
            profile: { id: 'user-id' },
          },
        },
      )

      expect(screen.getByText('Add Organisation')).toBeInTheDocument()
      fireEvent.change(screen.getByTestId('addr-line1'), {
        target: { value: address.line1 },
      })

      fireEvent.change(screen.getByTestId('city'), {
        target: { value: address.city },
      })
      fireEvent.change(screen.getByTestId('postCode'), {
        target: { value: address.postCode },
      })
      const sector = screen.getByTestId('sector-select')
      await userEvent.click(within(sector).getByRole('button'))
      const sectorOption = screen.getByTestId('sector-edu')
      await userEvent.click(sectorOption)

      const orgType = screen.getByLabelText('Organisation type', {
        exact: false,
      })
      await userEvent.click(orgType)

      const typeOption = screen.getByTestId('type-UTC')
      await userEvent.click(typeOption)

      fireEvent.change(screen.getByTestId('org-email'), {
        target: { value: orgEmail },
      })
      const submitButton = screen.getByTestId('add-org-form-submit-btn')

      await userEvent.click(submitButton)

      await waitFor(() => {
        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith(
          GET_DFE_REGISTERED_ORGANISATION,
          {
            name: option.name,
            postcode: address.postCode,
          },
        )
        expect(useInsertNewOrganisationMock).toHaveBeenCalledTimes(1)
        expect(useInsertNewOrganisationMock).toHaveBeenCalledWith({
          name: orgName,
          sector: 'edu',
          orgType: 'UTC',
          address: address,
          attributes: {
            email: orgEmail,
            headFirstName: undefined,
            headLastName: undefined,
            headTitle: undefined,
            localAuthority: undefined,
            ofstedLastInspection: undefined,
            ofstedRating: undefined,
            phone: '',
          },
          dfeId: 'id',
        })
      })

      expect(useInsertOrgLogMock).toHaveBeenCalledTimes(1)
      expect(useInsertOrgLogMock).toHaveBeenCalledWith({
        orgId: 'id',
        userId: 'user-id',
        createfrom: createdFrom,
        op: Cud_Operation_Enum.Create,
        updated_columns: {
          old: null,
          new: {
            id: 'id',
            name: orgName,
          },
        },
      })
    },
  )
})
