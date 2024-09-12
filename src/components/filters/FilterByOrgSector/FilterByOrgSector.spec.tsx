import { useAuth } from '@app/context/auth'
import { AuthContextType } from '@app/context/auth/types'

import { render, screen, userEvent, waitFor } from '@test/index'

import { FilterByOrgSector } from './FilterByOrgSector'
vi.mock('@app/context/auth', async () => ({
  ...((await vi.importActual('@app/context/auth')) as object),
  useAuth: vi.fn().mockReturnValue({
    acl: {
      isAustralia: vi.fn().mockReturnValue(false),
      isUK: vi.fn().mockReturnValue(true),
    },
  }),
}))

const useAuthMock = vi.mocked(useAuth)
describe('FilterOrgSector', () => {
  it('onChange FilterOrgSector', async () => {
    useAuthMock.mockReturnValue({
      acl: {
        isAustralia: vi.fn().mockReturnValue(false),
        isUK: vi.fn().mockReturnValue(true),
      },
    } as unknown as AuthContextType)
    const onChange = vi.fn()
    render(<FilterByOrgSector onChange={onChange} />)

    await userEvent.click(screen.getByText('Adults Health and Social Care'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['hsc_adult'])
    })
  })
})
