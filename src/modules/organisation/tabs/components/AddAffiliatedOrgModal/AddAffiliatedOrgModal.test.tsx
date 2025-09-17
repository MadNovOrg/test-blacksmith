import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'

import { chance, _render, screen, renderHook, userEvent } from '@test/index'

import { AddAffiliatedOrgModal } from './AddAffiliatedOrgModal'
describe('component: AddAffiliatedOrgModal', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation(
      'pages.org-details.tabs.affiliated-orgs.add-affiliate',
    ),
  )
  const setup = (role: RoleName) => {
    const mainOrgId = chance.guid()
    const mainOrgName = chance.name()
    const mainOrgCountryCode = 'AU'
    return _render(
      <AddAffiliatedOrgModal
        mainOrgId={mainOrgId}
        mainOrgCountryCode={mainOrgCountryCode}
        mainOrgName={mainOrgName}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
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

      const closeButton = screen.getByTestId('close-link-affiliate-org-button')
      expect(closeButton).toBeInTheDocument()

      const confirmButton = screen.getByTestId(
        'confirm-link-affiliate-org-button',
      )
      expect(confirmButton).toBeInTheDocument()

      const orgSelector = screen.getByTestId('affiliated-org')
      expect(orgSelector).toBeInTheDocument()
    })

    it(`should display error if affiliated org is not selected`, async () => {
      setup(role)

      const confirmButton = screen.getByTestId(
        'confirm-link-affiliate-org-button',
      )

      await userEvent.click(confirmButton)
      expect(
        screen.getByText(t('validation-errors.affiliate-org-required')),
      ).toBeInTheDocument()
    })
  })
})
