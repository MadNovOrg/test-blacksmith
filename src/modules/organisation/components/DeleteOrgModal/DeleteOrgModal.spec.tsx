import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import { GetOrganisationDetailsForDeleteQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import DeleteOrgModal from '@app/modules/organisation/components/DeleteOrgModal/DeleteOrgModal'

import { render, renderHook, screen } from '@test/index'
import { chance } from '@test/index'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe(DeleteOrgModal.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useScopedTranslation('pages.org-details.tabs.details'))

  it('should render the modal with correct content if delete is allowed', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 0 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 0 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>
    )

    expect(
      getByText(t('confirm-deleting', { name: org.name }))
    ).toBeInTheDocument()
    expect(screen.getByTestId('delete-org-btn')).toBeInTheDocument()
  })

  it('should render the modal with correct content if delete is NOT allowed', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 0 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 1 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>
    )

    expect(getByText(t('cannot-be-deleted'))).toBeInTheDocument()
    expect(
      screen.queryByText(t('confirm-deleting', { name: org.name }))
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })

  it('should render the modal with correct organisation linked entities', () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: GetOrganisationDetailsForDeleteQuery }>({
          data: {
            orgs: {
              members: { aggregate: { count: 1 } },
              courses: { aggregate: { count: 0 } },
              orders: { aggregate: { count: 1 } },
            },
          },
        }),
    } as unknown as Client

    const org = {
      id: chance.guid(),
      name: chance.name(),
    }

    const { getByText } = render(
      <Provider value={client}>
        <DeleteOrgModal
          onClose={() => {
            return
          }}
          open={true}
          org={org}
        />
      </Provider>
    )

    expect(getByText(t('cannot-be-deleted'))).toBeInTheDocument()

    expect(getByText(t('count-members', { num: 1 }))).toBeInTheDocument()
    expect(getByText(t('count-orders', { num: 1 }))).toBeInTheDocument()
    expect(
      screen.queryByText(t('count-courses', { num: 0 }))
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(t('confirm-deleting', { name: org.name }))
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })
})
