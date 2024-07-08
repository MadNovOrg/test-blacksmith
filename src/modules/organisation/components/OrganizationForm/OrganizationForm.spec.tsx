import { DocumentNode } from 'graphql'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import {
  FindEstablishmentQuery,
  GetOrgTypesQuery,
  GetOrganizationsQuery,
  GetRegionsByCountryQuery,
  Organization,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { Query as REGIONS_BY_COUNTRY_QUERY } from '@app/queries/country-region/get-region-by-country'
import { QUERY as FIND_ESTABLISHMENTS } from '@app/queries/dfe/find-establishment'
import { GET_ORG_TYPES } from '@app/queries/organization/get-org-types'
import { QUERY as GET_ORGANIZATIONS } from '@app/queries/organization/get-organizations'

import {
  chance,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor,
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
    expect(submitMock).not.toBeCalled()
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

  it('renders zip code for international organisation and post code for UK', async () => {
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
    await userEvent.type(textField, 'Albania')

    const nonUKCountry = screen.getByTestId('country-AL')
    expect(nonUKCountry).toBeInTheDocument()
    await userEvent.click(nonUKCountry)

    const zipCode = screen.getByLabelText(t('fields.addresses.zipCode'), {
      exact: false,
    })
    expect(zipCode).toBeInTheDocument()

    await userEvent.clear(within(textField).getByRole('combobox'))
    await userEvent.type(textField, 'England')

    const countryInUK = screen.getByTestId('country-GB-ENG')
    expect(countryInUK).toBeInTheDocument()
    await userEvent.click(countryInUK)

    const postCode = screen.getByLabelText(t('fields.addresses.postcode'), {
      exact: false,
    })
    expect(postCode).toBeInTheDocument()
  })

  it('submit organisation form for UK', async () => {
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
    await userEvent.type(textField, 'England')

    const nonUKCountry = screen.getByTestId('country-GB-ENG')
    expect(nonUKCountry).toBeInTheDocument()
    await userEvent.click(nonUKCountry)

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
    await userEvent.type(orgSelector, 'UK Test Organisation')

    const sectorDropdown = screen.getByTestId('sector-select')
    await userEvent.click(within(sectorDropdown).getByRole('button'))

    const orgType = screen.getByLabelText(_t('org-type'), {
      exact: false,
    })
    expect(orgType).toBeDisabled

    const sectorOption = screen.getByTestId('sector-edu')
    await userEvent.click(sectorOption)

    expect(orgType).toBeEnabled()

    await userEvent.click(orgType)

    const typeOption = screen.getByTestId('type-UTC')
    await userEvent.click(typeOption)

    const orgNumber = screen.getByLabelText(t('fields.organization-phone'), {
      exact: false,
    })
    await userEvent.type(orgNumber, chance.phone())

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

    const localAuthority = screen.getByLabelText(t('fields.local-authority'), {
      exact: false,
    })
    expect(localAuthority).toBeInTheDocument()

    const ofstedRating = screen.getByLabelText(t('fields.ofsted-rating'), {
      exact: false,
    })
    expect(ofstedRating).toBeInTheDocument()

    const lastInspectionDate = screen.getByLabelText(
      t('fields.ofsted-last-inspection-date'),
      {
        exact: false,
      },
    )
    expect(lastInspectionDate).toBeInTheDocument()

    const submitButton = screen.getByTestId('create-org-form-submit-btn')
    await userEvent.click(submitButton)

    expect(submitMock).toHaveBeenCalled()
  })

  it('submit international organisation form', async () => {
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
    await userEvent.type(textField, 'Albania')

    const nonUKCountry = screen.getByTestId('country-AL')
    expect(nonUKCountry).toBeInTheDocument()
    await userEvent.click(nonUKCountry)

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

    const sectorDropdown = screen.getByTestId('sector-select')
    await userEvent.click(within(sectorDropdown).getByRole('button'))

    const orgType = screen.getByLabelText(_t('org-type'), {
      exact: false,
    })
    expect(orgType).toBeDisabled

    const sectorOption = screen.getByTestId('sector-edu')
    await userEvent.click(sectorOption)

    expect(orgType).toBeEnabled()

    await userEvent.click(orgType)

    const typeOption = screen.getByTestId('type-UTC')
    await userEvent.click(typeOption)

    const orgNumber = screen.getByLabelText(t('fields.organization-phone'), {
      exact: false,
    })
    await userEvent.type(orgNumber, chance.phone())

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

    const localAuthority = screen.queryByLabelText(
      t('fields.local-authority'),
      {
        exact: false,
      },
    )
    expect(localAuthority).not.toBeInTheDocument()

    const ofstedRating = screen.queryByLabelText(t('fields.ofsted-rating'), {
      exact: false,
    })
    expect(ofstedRating).not.toBeInTheDocument()

    const lastInspectionDate = screen.queryByLabelText(
      t('fields.ofsted-last-inspection-date'),
      {
        exact: false,
      },
    )
    expect(lastInspectionDate).not.toBeInTheDocument()

    const submitButton = screen.getByTestId('create-org-form-submit-btn')
    await userEvent.click(submitButton)

    expect(submitMock).toHaveBeenCalled()
  })

  it('disable prefilled dfe organization properties', async () => {
    const establishmentId = chance.guid()

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === FIND_ESTABLISHMENTS) {
          return fromValue<{ data: FindEstablishmentQuery }>({
            data: {
              establishments: [
                {
                  id: establishmentId,
                  urn: chance.string(),
                  name: 'The Pointer School',
                  localAuthority: 'Greenwich',
                  trustType: null,
                  trustName: null,
                  addressLineOne: chance.address(),
                  addressLineTwo: chance.address(),
                  addressLineThree: null,
                  town: 'London',
                  county: null,
                  postcode: 'SE3 7TH',
                  headTitle: chance.name(),
                  headFirstName: chance.name(),
                  headLastName: chance.name(),
                  headJobTitle: chance.name(),
                  ofstedRating: 'Outstanding',
                  ofstedLastInspection: '2019-03-05T23:00:00.000Z',
                },
              ],
              total: { aggregate: { count: 1 } },
            },
          })
        }

        if (query === GET_ORGANIZATIONS) {
          return fromValue<{ data: GetOrganizationsQuery }>({
            data: {
              orgs: [],
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

    const orgSelector = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    await userEvent.type(orgSelector, 'The Pointer School')

    vi.runAllTimers()

    await waitFor(() =>
      screen.getByTestId(`org-selector-result-${establishmentId}`),
    )

    await userEvent.click(
      screen.getByTestId(`org-selector-result-${establishmentId}`),
    )

    const line1 = screen.getByLabelText(t('fields.addresses.line1'), {
      exact: false,
    })
    expect(line1).toBeInTheDocument()
    expect(line1).toBeDisabled()

    const line2 = screen.getByLabelText(t('fields.addresses.line2'))
    expect(line2).toBeInTheDocument()

    const city = screen.getByLabelText(t('fields.addresses.town-city'), {
      exact: false,
    })
    expect(city).toBeInTheDocument()
    expect(city).toBeDisabled()

    const zipCode = screen.getByLabelText(
      t('fields.addresses.postalAndZipCode'),
      {
        exact: false,
      },
    )
    expect(zipCode).toBeDisabled()

    const headFirstName = screen.getByLabelText(t('fields.head-first-name'), {
      exact: false,
    })
    expect(headFirstName).toBeDisabled()

    const headSurname = screen.getByLabelText(t('fields.head-surname'), {
      exact: false,
    })
    expect(headSurname).toBeDisabled()

    const settingName = screen.getByLabelText(t('fields.setting-name'), {
      exact: false,
    })
    expect(settingName).toBeDisabled()

    const localAuthority = screen.getByLabelText(t('fields.local-authority'), {
      exact: false,
    })
    expect(localAuthority).toBeDisabled()

    const ofstedRating = screen.getByTestId('ofsted-rating')
    expect(ofstedRating).toBeDisabled()

    const ofstedLastInspection = screen.getByLabelText(
      t('fields.ofsted-last-inspection-date'),
      {
        exact: false,
      },
    )
    expect(ofstedLastInspection).toBeDisabled()
  })

  it('enable disabled prefilled dfe organization properties on name change', async () => {
    const establishmentId = chance.guid()

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === FIND_ESTABLISHMENTS) {
          return fromValue<{ data: FindEstablishmentQuery }>({
            data: {
              establishments: [
                {
                  id: establishmentId,
                  urn: chance.string(),
                  name: 'The Pointer School',
                  localAuthority: 'Greenwich',
                  trustType: null,
                  trustName: null,
                  addressLineOne: chance.address(),
                  addressLineTwo: chance.address(),
                  addressLineThree: null,
                  town: 'London',
                  county: null,
                  postcode: 'SE3 7TH',
                  headTitle: chance.name(),
                  headFirstName: chance.name(),
                  headLastName: chance.name(),
                  headJobTitle: chance.name(),
                  ofstedRating: 'Outstanding',
                  ofstedLastInspection: '2019-03-05T23:00:00.000Z',
                },
              ],
              total: { aggregate: { count: 1 } },
            },
          })
        }

        if (query === GET_ORGANIZATIONS) {
          return fromValue<{ data: GetOrganizationsQuery }>({
            data: {
              orgs: [],
            },
          })
        }

        if (query === REGIONS_BY_COUNTRY_QUERY) {
          return fromValue<{ data: GetRegionsByCountryQuery }>({
            data: {
              regions: [{ name: 'London' }],
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

    const orgSelector = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    await userEvent.type(orgSelector, 'The Pointer School')

    vi.runAllTimers()

    await waitFor(() =>
      screen.getByTestId(`org-selector-result-${establishmentId}`),
    )

    await userEvent.click(
      screen.getByTestId(`org-selector-result-${establishmentId}`),
    )

    const line1 = screen.getByLabelText(t('fields.addresses.line1'), {
      exact: false,
    })
    expect(line1).toBeInTheDocument()
    expect(line1).toBeDisabled()

    const line2 = screen.getByLabelText(t('fields.addresses.line2'))
    expect(line2).toBeDisabled()

    const city = screen.getByLabelText(t('fields.addresses.town-city'), {
      exact: false,
    })
    expect(city).toBeInTheDocument()
    expect(city).toBeDisabled()

    const zipCode = screen.getByLabelText(
      t('fields.addresses.postalAndZipCode'),
      {
        exact: false,
      },
    )
    expect(zipCode).toBeDisabled()

    const headFirstName = screen.getByLabelText(t('fields.head-first-name'), {
      exact: false,
    })
    expect(headFirstName).toBeDisabled()

    const headSurname = screen.getByLabelText(t('fields.head-surname'), {
      exact: false,
    })
    expect(headSurname).toBeDisabled()

    const settingName = screen.getByLabelText(t('fields.setting-name'), {
      exact: false,
    })
    expect(settingName).toBeDisabled()

    const localAuthority = screen.getByLabelText(t('fields.local-authority'), {
      exact: false,
    })
    expect(localAuthority).toBeDisabled()

    const ofstedRating = screen.getByTestId('ofsted-rating')
    expect(ofstedRating).toBeDisabled()

    const ofstedLastInspection = screen.getByLabelText(
      t('fields.ofsted-last-inspection-date'),
      {
        exact: false,
      },
    )
    expect(ofstedLastInspection).toBeDisabled()

    await userEvent.type(orgSelector, 'My Org')

    expect(line1).toBeEnabled()
    expect(line2).toBeEnabled()
    expect(city).toBeEnabled()
    expect(zipCode).toBeEnabled()
    expect(headFirstName).toBeEnabled()
    expect(headSurname).toBeEnabled()
    expect(settingName).toBeEnabled()
    expect(localAuthority).toBeEnabled()
    expect(ofstedRating).toBeEnabled()
    expect(ofstedLastInspection).toBeEnabled()
  })

  it('keep enabled missing dfe org data fields', async () => {
    const establishmentId = chance.guid()

    const client = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === FIND_ESTABLISHMENTS) {
          return fromValue<{ data: FindEstablishmentQuery }>({
            data: {
              establishments: [
                {
                  id: establishmentId,
                  urn: chance.string(),
                  name: 'The Pointer School',
                  localAuthority: 'Greenwich',
                  trustType: null,
                  trustName: null,
                  addressLineOne: chance.address(),
                  addressLineTwo: chance.address(),
                  addressLineThree: null,
                  town: 'London',
                  county: null,
                  postcode: 'SE3 7TH',
                  headTitle: chance.name(),
                  headFirstName: chance.name(),
                  headLastName: chance.name(),
                  headJobTitle: chance.name(),
                  ofstedRating: null,
                  ofstedLastInspection: null,
                },
              ],
              total: { aggregate: { count: 1 } },
            },
          })
        }

        if (query === GET_ORGANIZATIONS) {
          return fromValue<{ data: GetOrganizationsQuery }>({
            data: {
              orgs: [],
            },
          })
        }

        if (query === REGIONS_BY_COUNTRY_QUERY) {
          return fromValue<{ data: GetRegionsByCountryQuery }>({
            data: {
              regions: [{ name: 'London' }],
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

    const orgSelector = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    await userEvent.type(orgSelector, 'The Pointer School')

    vi.runAllTimers()

    await waitFor(() =>
      screen.getByTestId(`org-selector-result-${establishmentId}`),
    )

    await userEvent.click(
      screen.getByTestId(`org-selector-result-${establishmentId}`),
    )

    const localAuthority = screen.getByLabelText(t('fields.local-authority'), {
      exact: false,
    })
    expect(localAuthority).toBeDisabled()

    const ofstedRating = screen.getByTestId('ofsted-rating')
    expect(ofstedRating).toBeEnabled()

    const ofstedLastInspection = screen.getByLabelText(
      t('fields.ofsted-last-inspection-date'),
      {
        exact: false,
      },
    )
    expect(ofstedLastInspection).toBeEnabled()
  })

  it('disable prefilled dfe organization properties on edit org form', async () => {
    const establishmentId = chance.guid()

    render(
      <OrganizationForm
        onSubmit={submitMock}
        isEditMode
        editOrgData={{
          name: 'My Org',
          dfeEstablishment: {
            id: establishmentId,
            urn: chance.string(),
            name: 'The Pointer School',
            localAuthority: 'Greenwich',
            trustType: null,
            trustName: null,
            addressLineOne: chance.address(),
            addressLineTwo: null,
            addressLineThree: null,
            town: 'London',
            county: null,
            postcode: 'SE3 7TH',
            headTitle: chance.name(),
            headFirstName: chance.name(),
            headLastName: chance.name(),
            headJobTitle: null,
            ofstedRating: 'Outstanding',
            ofstedLastInspection: '2019-03-05T23:00:00.000Z',
          },
        }}
      />,
    )

    const orgName = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    expect(orgName).toBeDisabled()

    const line1 = screen.getByLabelText(t('fields.addresses.line1'), {
      exact: false,
    })
    expect(line1).toBeDisabled()

    const line2 = screen.getByLabelText(t('fields.addresses.line2'))
    expect(line2).toBeEnabled()

    const city = screen.getByLabelText(t('fields.addresses.town-city'), {
      exact: false,
    })
    expect(city).toBeDisabled()

    const zipCode = screen.getByLabelText(
      t('fields.addresses.postalAndZipCode'),
      {
        exact: false,
      },
    )
    expect(zipCode).toBeDisabled()

    const headFirstName = screen.getByLabelText(t('fields.head-first-name'), {
      exact: false,
    })
    expect(headFirstName).toBeDisabled()

    const headSurname = screen.getByLabelText(t('fields.head-surname'), {
      exact: false,
    })
    expect(headSurname).toBeDisabled()

    const settingName = screen.getByLabelText(t('fields.setting-name'), {
      exact: false,
    })
    expect(settingName).toBeEnabled()

    const localAuthority = screen.getByLabelText(t('fields.local-authority'), {
      exact: false,
    })
    expect(localAuthority).toBeDisabled()

    const ofstedRating = screen.getByTestId('ofsted-rating')
    expect(ofstedRating).toBeDisabled()

    const ofstedLastInspection = screen.getByLabelText(
      t('fields.ofsted-last-inspection-date'),
      {
        exact: false,
      },
    )
    expect(ofstedLastInspection).toBeDisabled()
  })

  it('keeps name enabled for non dfe organization on edit org form', async () => {
    render(
      <OrganizationForm
        onSubmit={submitMock}
        isEditMode
        editOrgData={{
          name: 'My Org',
          dfeEstablishment: undefined,
        }}
      />,
    )

    const orgName = screen.getByLabelText(t('fields.organization-name'), {
      exact: false,
    })
    expect(orgName).toBeEnabled()
  })
})
