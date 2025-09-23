import { RoleName } from '@app/types'

import { chance, screen, _render } from '@test/index'

import { ProfileLink } from './ProfileLink'

describe(ProfileLink.name, () => {
  it('displays link in the case of an internal user', () => {
    const fullName = chance.name()
    _render(<ProfileLink profileId={chance.guid()} fullName={fullName} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })
    expect(screen.getByText(fullName).closest('a')).toBeInTheDocument()
  })
  it('displays plain text in the case of an external user', () => {
    const fullName = chance.name()
    _render(<ProfileLink profileId={chance.guid()} fullName={fullName} />, {
      auth: { activeRole: RoleName.USER },
    })
    expect(screen.getByText(fullName).closest('a')).not.toBeInTheDocument()
  })
})
