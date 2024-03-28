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
    const org = {
      id: chance.guid(),
      name: chance.name(),
      count: {
        orders: 0,
        members: 0,
        courses: 0,
      },
    }

    const { getByText } = render(
      <DeleteOrgModal
        onClose={() => {
          return
        }}
        open={true}
        org={org}
      />
    )

    expect(
      getByText(t('confirm-deleting', { name: org.name }))
    ).toBeInTheDocument()
    expect(screen.getByTestId('delete-org-btn')).toBeInTheDocument()
  })

  it('should render the modal with correct content if delete is NOT allowed', () => {
    const org = {
      id: chance.guid(),
      name: chance.name(),
      count: {
        orders: 1,
        members: 0,
        courses: 0,
      },
    }

    const { getByText } = render(
      <DeleteOrgModal
        onClose={() => {
          return
        }}
        open={true}
        org={org}
      />
    )

    expect(getByText(t('cannot-be-deleted'))).toBeInTheDocument()
    expect(
      screen.queryByText(t('confirm-deleting', { name: org.name }))
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })

  it('should render the modal with correct organisation linked entities', () => {
    const org = {
      id: chance.guid(),
      name: chance.name(),
      count: {
        orders: 1,
        members: 1,
        courses: 0,
      },
    }

    const { getByText } = render(
      <DeleteOrgModal
        onClose={() => {
          return
        }}
        open={true}
        org={org}
      />
    )

    expect(getByText(t('cannot-be-deleted'))).toBeInTheDocument()

    expect(
      getByText(t('count-members', { num: org.count.members }))
    ).toBeInTheDocument()
    expect(
      getByText(t('count-orders', { num: org.count.orders }))
    ).toBeInTheDocument()
    expect(
      screen.queryByText(t('count-courses', { num: org.count.orders }))
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText(t('confirm-deleting', { name: org.name }))
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('delete-org-btn')).not.toBeInTheDocument()
  })
})
