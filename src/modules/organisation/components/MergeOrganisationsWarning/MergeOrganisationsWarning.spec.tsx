import { renderHook, waitFor } from '@testing-library/react'
import { Client, Provider } from 'urql'
import { fromValue } from 'wonka'

import {
  InputMaybe,
  MergeOrganisationsMutation,
  MergeOrganisationsStatus,
  Scalars,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { render, screen } from '@test/index'

import { MergeOrganisationsWarning } from './MergeOrganisationsWarning'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

describe(MergeOrganisationsWarning.name, () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() => useScopedTranslation('pages.admin.organizations.merge'))
  const onClose = vi.fn()
  it('should render', () => {
    render(
      <MergeOrganisationsWarning
        open={true}
        onClose={onClose}
        selectedMain={''}
        selectedOrgs={[]}
      />,
    )
    expect(screen.getByText(t('warning.title'))).toBeInTheDocument()
  })
  it('should call onClose when cancel button is clicked', () => {
    render(
      <MergeOrganisationsWarning
        open={true}
        onClose={onClose}
        selectedMain={''}
        selectedOrgs={[]}
      />,
    )
    screen.getByText(_t('cancel')).click()
    expect(onClose).toHaveBeenCalled()
  })
  it('should call onClose and navigate when confirm button is clicked', () => {
    const client = {
      executeQuery: vi.fn(),
      executeMutation: () =>
        fromValue<{ data: MergeOrganisationsMutation }>({
          data: {
            mergeOrganisations: {
              status: MergeOrganisationsStatus.Success,
              message: 'success',
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <MergeOrganisationsWarning
          open={true}
          onClose={onClose}
          selectedMain={''}
          selectedOrgs={[]}
        />
        ,
      </Provider>,
    )

    screen.getByText(t('warning.proceed')).click()
    waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/organisations/list')
    })
  })
  it('calls merge organisations with correct arguments', async () => {
    const client = {
      executeQuery: vi.fn(),
      executeMutation: () =>
        fromValue<{ data: MergeOrganisationsMutation }>({
          data: {
            mergeOrganisations: {
              status: MergeOrganisationsStatus.Success,
              message: 'success',
            },
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <MergeOrganisationsWarning
          open={true}
          onClose={onClose}
          selectedMain={'main'}
          selectedOrgs={
            [{ id: 'org1' }, { id: 'org2' }] as Array<
              InputMaybe<Scalars['uuid']>
            >
          }
        />
      </Provider>,
    )

    screen.getByText(t('warning.proceed')).click()
    waitFor(() => {
      expect(client.executeMutation).toHaveBeenCalledWith({
        query: expect.anything(),
        variables: {
          input: {
            main: 'main',
            merge: ['org1', 'org2'],
          },
        },
      })
    })
  })
})
