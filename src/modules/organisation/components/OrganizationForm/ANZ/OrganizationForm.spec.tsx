import { DocumentNode } from 'graphql'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { GET_ORGANIZATIONS } from '@app/components/OrgSelector/queries/get-organizations'
import {
  GetOrganizationsQuery,
  GetOrgTypesQuery,
  Organization,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { GET_ORG_TYPES } from '@app/modules/organisation/queries/get-org-types'
import { RoleName } from '@app/types'

import {
  chance,
  fireEvent,
  render,
  renderHook,
  screen,
  userEvent,
  within,
} from '@test/index'

import { OrganizationForm } from './OrganizationForm'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

describe(OrganizationForm.name, () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() => useScopedTranslation('pages.create-organization'))

  useFeatureFlagEnabledMock.mockResolvedValue(true)

  const submitMock = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders the component', () => {
    render(<OrganizationForm onSubmit={submitMock} />)
    expect(screen.getByText(t('fields.organization-name'))).toBeInTheDocument()
  })
  it('does not submit if form isnt filled', async () => {
    render(<OrganizationForm onSubmit={submitMock} />)
    expect(screen.getByText(t('add-new-organization'))).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('create-org-form-submit-btn'))
    expect(submitMock).not.toHaveBeenCalled()
  })
  it('prefills if edit mode', async () => {
    const editOrgData = {
      name: 'Test org',
    } as Partial<Organization>
    render(
      <OrganizationForm
        onSubmit={submitMock}
        isEditMode={true}
        editOrgData={editOrgData}
      />,
    )
    expect(screen.getByTestId('name')).toHaveValue(editOrgData.name)
  })
  it('renders field errors', async () => {
    render(<OrganizationForm onSubmit={submitMock} />)
    await userEvent.click(screen.getByTestId('create-org-form-submit-btn'))
    expect(
      screen.getByText(
        _t('validation-errors.required-field', {
          name: t('fields.organization-name'),
        }),
      ),
    ).toBeInTheDocument()
  })

  it('renders post code for AU', async () => {
    render(<OrganizationForm onSubmit={submitMock} />)

    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete',
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input',
    )
    expect(textField).toBeInTheDocument()

    await userEvent.type(textField, 'Australia')

    const countryInUK = screen.getByTestId('country-AU')
    expect(countryInUK).toBeInTheDocument()
    await userEvent.click(countryInUK)

    const postCode = screen.getByLabelText(t('fields.addresses.postcode'), {
      exact: false,
    })
    expect(postCode).toBeInTheDocument()
  })

  it('submit organisation form for AU without main organisation', async () => {
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
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrganizationForm onSubmit={submitMock} />
      </Provider>,
    )

    // Organisation address
    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete',
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input',
    )
    expect(textField).toBeInTheDocument()
    await userEvent.type(textField, 'Australia')

    const nonUKCountry = screen.getByTestId('country-AU')
    expect(nonUKCountry).toBeInTheDocument()
    await userEvent.click(nonUKCountry)

    const regionSelector = screen.getByLabelText('State/Territory', {
      exact: false,
    })

    expect(regionSelector).toBeInTheDocument()
    fireEvent.click(regionSelector)
    await userEvent.keyboard('{tab} {enter}')

    const line1 = screen.getByLabelText(t('fields.addresses.line1'), {
      exact: false,
    })
    expect(line1).toBeInTheDocument()
    await userEvent.type(line1, 'Line 1')

    const line2 = screen.getByLabelText(t('fields.addresses.line2'))
    expect(line2).toBeInTheDocument()

    const city = screen.getByLabelText(t('fields.addresses.town-city'), {
      exact: false,
    })
    expect(city).toBeInTheDocument()
    await userEvent.type(city, 'City')

    const postCode = screen.getByLabelText(t('fields.addresses.postcode'), {
      exact: false,
    })
    await userEvent.type(postCode, 'EC1M 7AJ')

    // Organisation details
    const orgSelector = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    await userEvent.type(orgSelector, 'AU Test Organisation')

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.queryByTestId('main-org')).not.toBeInTheDocument()

    const sectorDropdown = screen.getByTestId('sector-select')
    await userEvent.click(within(sectorDropdown).getByRole('button'))

    const orgType = screen.getByLabelText(_t('org-type'), {
      exact: false,
    })
    expect(orgType).toBeDisabled

    const sectorOption = screen.getByTestId('sector-anz_edu')
    await userEvent.click(sectorOption)

    expect(orgType).toBeEnabled()

    await userEvent.click(orgType)

    const typeOption = screen.getByTestId('type-UTC')
    await userEvent.click(typeOption)

    const orgPhoneNumber = screen.getByLabelText(
      t('fields.organization-phone'),
      {
        exact: false,
      },
    )

    await userEvent.clear(orgPhoneNumber)
    await userEvent.type(orgPhoneNumber, '610491000000')

    const orgEmail = screen.getByLabelText(t('fields.organization-email'), {
      exact: false,
    })
    await userEvent.type(orgEmail, chance.email())

    // Additional details
    const headFirstName = screen.getByLabelText(t('fields.head-first-name'), {
      exact: false,
    })
    expect(headFirstName).toBeInTheDocument()

    const headSurname = screen.getByLabelText(t('fields.head-surname'), {
      exact: false,
    })
    expect(headSurname).toBeInTheDocument()

    const headEmail = screen.getByLabelText(
      t('fields.organisation-main-contact-email-address'),
      {
        exact: false,
      },
    )
    expect(headEmail).toBeInTheDocument()

    const settingName = screen.getByLabelText(t('fields.setting-name'), {
      exact: false,
    })
    expect(settingName).toBeInTheDocument()

    const submitButton = screen.getByTestId('create-org-form-submit-btn')
    await userEvent.click(submitButton)

    expect(submitMock).toHaveBeenCalled()
  })

  it('submit organisation form for NZ with main organisation', async () => {
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
              orgs: [
                {
                  id: '1',
                  name: 'Main Org',
                },
              ] as GetOrganizationsQuery['orgs'],
            },
          })
        }

        return never
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <OrganizationForm onSubmit={submitMock} />
      </Provider>,
    )

    // Organisation address
    const countriesSelector = screen.getByTestId(
      'countries-selector-autocomplete',
    )
    expect(countriesSelector).toBeInTheDocument()
    countriesSelector.focus()

    const textField = within(countriesSelector).getByTestId(
      'countries-selector-input',
    )
    expect(textField).toBeInTheDocument()
    await userEvent.type(textField, 'New Zealand')

    const nonUKCountry = screen.getByTestId('country-NZ')
    expect(nonUKCountry).toBeInTheDocument()
    await userEvent.click(nonUKCountry)

    const regionSelector = screen.getByLabelText('Region', {
      exact: false,
    })

    expect(regionSelector).toBeInTheDocument()
    fireEvent.click(regionSelector)
    await userEvent.keyboard('{tab} {enter}')

    const line1 = screen.getByLabelText(t('fields.addresses.line1'), {
      exact: false,
    })
    expect(line1).toBeInTheDocument()
    await userEvent.type(line1, 'Line 1')

    const line2 = screen.getByLabelText(t('fields.addresses.line2'))
    expect(line2).toBeInTheDocument()

    const city = screen.getByLabelText(t('fields.addresses.town-city'), {
      exact: false,
    })
    expect(city).toBeInTheDocument()
    await userEvent.type(city, 'City')

    const zipCode = screen.getByLabelText(
      t('fields.addresses.postalAndZipCode'),
      {
        exact: false,
      },
    )
    expect(zipCode).toBeInTheDocument()

    // Organisation details
    const orgSelector = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    await userEvent.type(orgSelector, 'UK Test Organisation')
    const mainOrgSelector = screen.getByTestId('main-org')
    await userEvent.type(mainOrgSelector, 'Main Org')
    await userEvent.keyboard('{enter}')

    const sectorDropdown = screen.getByTestId('sector-select')
    await userEvent.click(within(sectorDropdown).getByRole('button'))

    const orgType = screen.getByLabelText(_t('org-type'), {
      exact: false,
    })
    expect(orgType).toBeDisabled

    const sectorOption = screen.getByTestId('sector-anz_ss')
    await userEvent.click(sectorOption)

    expect(orgType).toBeEnabled()

    await userEvent.click(orgType)

    const typeOption = screen.getByTestId('type-UTC')
    await userEvent.click(typeOption)

    const orgPhoneNumber = screen.getByLabelText(
      t('fields.organization-phone'),
      {
        exact: false,
      },
    )
    await userEvent.clear(orgPhoneNumber)
    await userEvent.type(orgPhoneNumber, '610491000000')

    const orgEmail = screen.getByLabelText(t('fields.organization-email'), {
      exact: false,
    })
    await userEvent.type(orgEmail, chance.email())

    // Additional details
    const headFirstName = screen.getByLabelText(t('fields.head-first-name'), {
      exact: false,
    })
    expect(headFirstName).toBeInTheDocument()

    const headSurname = screen.getByLabelText(t('fields.head-surname'), {
      exact: false,
    })
    expect(headSurname).toBeInTheDocument()

    const headEmail = screen.getByLabelText(
      t('fields.organisation-main-contact-email-address'),
      {
        exact: false,
      },
    )
    expect(headEmail).toBeInTheDocument()

    const settingName = screen.getByLabelText(t('fields.setting-name'), {
      exact: false,
    })
    expect(settingName).toBeInTheDocument()

    const submitButton = screen.getByTestId('create-org-form-submit-btn')
    await userEvent.click(submitButton)

    expect(submitMock).toHaveBeenCalled()
  })

  it('disables country selector and link to main org checkbox on edit if org is main', () => {
    render(
      <OrganizationForm
        onSubmit={submitMock}
        isEditMode={true}
        editOrgData={{
          id: chance.guid(),
          name: chance.name(),
          sector: 'anz_ss',
          organisationType: 'Catholic Education',
          attributes: {
            email: chance.email(),
            phone: chance.phone(),
            headFirstName: chance.first(),
            headSurname: chance.last(),
            headEmailAddress: chance.email(),
            website: chance.url(),
          },
          address: {
            country: 'Australia',
            countryCode: 'AU',
            city: chance.city(),
            line1: chance.address(),
            postCode: chance.postcode(),
            region: 'Tasmania',
          },
          affiliatedOrgCount: 2,
        }}
      />,
    )
    // Check Residing Country
    const countrySelector = screen.getByLabelText(/residing country/i, {
      exact: false,
    })
    expect(countrySelector).toBeDisabled()
    expect(
      screen.getByText(t('edit-main-with-affiliate-warning')),
    ).toBeInTheDocument()

    // Check Link to Main Org Checkbox
    const linkToMainOrgCheckbox = screen.getByLabelText(
      /link to another organisation/i,
      {
        exact: false,
      },
    )
    expect(linkToMainOrgCheckbox).toBeDisabled()
    expect(linkToMainOrgCheckbox).not.toBeChecked()
  })

  it('disables country selector, renders main org and disables main org selector on edit if org is affiliate', () => {
    const mainOrgId = chance.guid()
    const mainOrgName = chance.name()
    render(
      <OrganizationForm
        onSubmit={submitMock}
        isEditMode={true}
        editOrgData={{
          id: chance.guid(),
          name: chance.name(),
          sector: 'anz_ss',
          organisationType: 'Catholic Education',
          attributes: {
            email: chance.email(),
            phone: chance.phone(),
            headFirstName: chance.first(),
            headSurname: chance.last(),
            headEmailAddress: chance.email(),
            website: chance.url(),
          },
          address: {
            country: 'Australia',
            countryCode: 'AU',
            city: chance.city(),
            line1: chance.address(),
            postCode: chance.postcode(),
            region: 'Tasmania',
          },
          affiliatedOrgCount: 0,
          main_organisation_id: mainOrgId,
          mainOrgName: mainOrgName,
        }}
      />,
    )

    // Check Residing Country
    const countrySelector = screen.getByLabelText(/residing country/i, {
      exact: false,
    })
    expect(countrySelector).toBeDisabled()
    expect(screen.getByText(t('edit-affiliated-warning'))).toBeInTheDocument()

    // Check Link to Main Org Checkbox
    const linkToMainOrgCheckbox = screen.getByLabelText(
      /link to another organisation/i,
      {
        exact: false,
      },
    )
    expect(linkToMainOrgCheckbox).toBeDisabled()
    expect(linkToMainOrgCheckbox).toBeChecked()

    const orgSelector = screen.getByLabelText(
      /select the organisation it affiliates with/i,
      {
        exact: false,
      },
    )
    expect(orgSelector).toBeDisabled()
    expect(orgSelector).toHaveValue(mainOrgName)
  })
  ;[
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ].forEach(roleName => {
    it(`displays the Edit the organisation affiliation link for ${roleName}`, () => {
      const mainOrgId = chance.guid()
      const mainOrgName = chance.name()

      const client = {
        executeQuery: () => never,
      } as unknown as Client

      render(
        <Provider value={client}>
          <OrganizationForm
            onSubmit={submitMock}
            isEditMode={true}
            editOrgData={{
              id: chance.guid(),
              name: chance.name(),
              sector: 'anz_ss',
              organisationType: 'Catholic Education',
              attributes: {
                email: chance.email(),
                phone: chance.phone(),
                headFirstName: chance.first(),
                headSurname: chance.last(),
                headEmailAddress: chance.email(),
                website: chance.url(),
              },
              address: {
                country: 'Australia',
                countryCode: 'AU',
                city: chance.city(),
                line1: chance.address(),
                postCode: chance.postcode(),
                region: 'Tasmania',
              },
              affiliatedOrgCount: 0,
              main_organisation_id: mainOrgId,
              mainOrgName: mainOrgName,
            }}
          />
          ,
        </Provider>,
        {
          auth: {
            activeRole: roleName,
          },
        },
      )

      expect(screen.getByTestId('edit-affiliation-link')).toBeInTheDocument()
    })
  })
})
