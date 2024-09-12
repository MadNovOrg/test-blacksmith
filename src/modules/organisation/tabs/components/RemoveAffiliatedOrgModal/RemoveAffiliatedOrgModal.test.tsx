import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { UnlinkMultipleAffiliatedOrganisationsMutation } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'

import { chance, render, screen, renderHook, userEvent } from '@test/index'

import { RemoveAffiliatedOrgModal } from './RemoveAffiliatedOrgModal'

describe('RemoveAffiliatedOrgModal', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation(
      'pages.org-details.tabs.affiliated-orgs.remove-affiliate',
    ),
  )

  const affiliatedOrgId = chance.guid()
  const client = {
    executeMutation: vi.fn(() => never),
  }

  const setup = (role: RoleName) => {
    client.executeMutation.mockImplementation(() => {
      return fromValue<{
        data: UnlinkMultipleAffiliatedOrganisationsMutation
      }>({
        data: {
          update_organization_many: [
            {
              affected_rows: 0,
            },
          ],
        },
      })
    })

    render(
      <Provider value={client as unknown as Client}>
        <RemoveAffiliatedOrgModal
          affiliatedOrgsIds={[affiliatedOrgId]}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />
      </Provider>,
      { auth: { activeRole: role } },
    )
  }

  ;[
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ].forEach(role => {
    it(`renders the component if a user is ${role}`, () => {
      setup(role)
      expect(screen.getByText(t('title'))).toBeInTheDocument()
      expect(screen.getByText(t('description'))).toBeInTheDocument()

      const closeButton = screen.getByTestId(
        'close-unlink-affiliate-org-button',
      )
      expect(closeButton).toBeInTheDocument()

      const confirmButton = screen.getByTestId(
        'confirm-unlink-affiliate-org-button',
      )
      expect(confirmButton).toBeInTheDocument()
    })
    it(`should call executeMutation`, async () => {
      setup(role)
      const confirmButton = screen.getByTestId(
        'confirm-unlink-affiliate-org-button',
      )
      await userEvent.click(confirmButton)
      expect(client.executeMutation).toHaveBeenCalledTimes(1)
    })
  })
})
