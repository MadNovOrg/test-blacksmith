import { useTranslation } from 'react-i18next'

import { RoleName } from '@app/types'

import { chance, render, renderHook, screen, userEvent } from '@test/index'

import { ManageAffiliatedOrgsMenu } from './ManageAffiliatedOrgsMenu'

describe(ManageAffiliatedOrgsMenu.name, () => {
  const mainOrgId = chance.guid()
  const affiliatedOrgId = chance.guid()
  const mainOrg = {
    organization: {
      id: mainOrgId,
      name: chance.name(),
      affiliated_organisations: [
        {
          id: affiliatedOrgId,
          name: chance.name(),
        },
      ],
    },
  }
  const { result } = renderHook(() => useTranslation())
  const {
    current: { t },
  } = result

  ;[
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.SALES_ADMIN,
    RoleName.SALES_REPRESENTATIVE,
  ].forEach(role => {
    it(`displays unlink option for ${role}`, async () => {
      render(
        <ManageAffiliatedOrgsMenu
          affiliatedOrg={mainOrg.organization.affiliated_organisations[0]}
          onUnlinkClick={vi.fn()}
        />,
        {
          auth: {
            activeRole: role,
          },
        },
      )

      const actionsMenu = screen.getByTestId('manage-affiliated-orgs')
      await userEvent.click(actionsMenu)
      expect(
        screen.queryByText(t('common.unlink-organisation')),
      ).toBeInTheDocument()
    })
  })
})
