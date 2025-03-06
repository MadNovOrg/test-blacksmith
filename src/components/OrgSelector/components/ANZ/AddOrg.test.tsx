import { DocumentNode } from 'graphql'
import { useTranslation } from 'react-i18next'
import { Provider, Client } from 'urql'
import { fromValue, never } from 'wonka'

import {
  Org_Created_From_Enum,
  GetOrgTypesQuery,
  Cud_Operation_Enum,
} from '@app/generated/graphql'
import { GET_ORG_TYPES } from '@app/modules/organisation/queries/get-org-types'
import { AwsRegions, RoleName } from '@app/types'

import {
  render,
  screen,
  renderHook,
  fireEvent,
  userEvent,
  waitFor,
  within,
  chance,
} from '@test/index'

import { AddOrg } from './AddOrg'

const option = {
  id: 'id',
  urn: 'urn',
  name: 'name',
}

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
        label !== t('components.add-organisation.fields.state') &&
        label !== t('components.add-organisation.fields.territory') &&
        label !== t('components.add-organisation.fields.organisation-phone'),
    ),
  ])('renders % field', async field => {
    render(
      <AddOrg
        orgName={option.name}
        countryCode={'AU'}
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
        label !== t('components.add-organisation.fields.stateTerritory') &&
        label !== t('components.add-organisation.fields.state') &&
        label !== t('components.add-organisation.fields.territory') &&
        label !== t('components.add-organisation.fields.organisation-phone'),
    ),
  ])('renders % field', async field => {
    render(
      <AddOrg
        orgName={option.name}
        countryCode={'NZ'}
        onSuccess={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(screen.getByText(field)).toBeInTheDocument()
  })

  it.each(Object.values(Org_Created_From_Enum))(
    'should call submit function and attempt insert log for non dfe org from page %s',
    async createdFrom => {
      vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
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
            orgName={option.name}
            countryCode={'AU'}
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
        country: 'Australia',
        countryCode: 'AU',
        postCode: 'WC2N 4JL',
        region: 'Australian Capital Territory',
      }
      const orgEmail = 'testare@teamteach.testinator.com'

      expect(screen.getByText('Add Organisation')).toBeInTheDocument()
      const regionSelector = screen.getByLabelText('State/Territory', {
        exact: false,
      })
      await userEvent.click(regionSelector)
      const regionOption = screen.getByTestId(
        'region-option-Australian Capital Territory',
      )
      await userEvent.click(regionOption)
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
      const sectorOption = screen.getByTestId('sector-anz_edu')
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
          sector: 'anz_edu',
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
})
