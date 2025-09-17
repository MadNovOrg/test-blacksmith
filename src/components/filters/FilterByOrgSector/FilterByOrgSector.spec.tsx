import { AwsRegions } from '@app/types'

import { _render, screen, userEvent, waitFor } from '@test/index'

import { FilterByOrgSector } from './FilterByOrgSector'

describe('FilterOrgSector', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })

  it('onChange FilterOrgSector', async () => {
    const onChange = vi.fn()
    _render(<FilterByOrgSector onChange={onChange} />)

    await userEvent.click(screen.getByText('Adults Health and Social Care'))

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['hsc_adult'])
    })
  })
})
