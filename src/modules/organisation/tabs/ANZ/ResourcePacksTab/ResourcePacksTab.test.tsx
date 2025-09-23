import { RoleName } from '@app/types'

import { screen, chance, _render } from '@test/index'

import { ResourcePacksTab } from './ResourcePacksTab'

describe('component: ResourcePacksTab', () => {
  const allowedRoles = [
    RoleName.TT_ADMIN,
    RoleName.TT_OPS,
    RoleName.FINANCE,
    RoleName.SALES_ADMIN,
  ]
  it('should _render the component', () => {
    _render(<ResourcePacksTab orgId={chance.guid()} />)
    expect(screen.getByTestId('remaining-resource-packs')).toBeInTheDocument()
    expect(screen.getByTestId('unused-resource-packs')).toBeInTheDocument
  })

  it.each(allowedRoles)(
    'should _render the manage resource packs button for allowed roles -- %s role',
    role => {
      _render(<ResourcePacksTab orgId={chance.guid()} />, {
        auth: {
          activeRole: role,
        },
      })
      expect(
        screen.getByTestId('manage-remaining-resource-packs'),
      ).toBeInTheDocument()
    },
  )
})
