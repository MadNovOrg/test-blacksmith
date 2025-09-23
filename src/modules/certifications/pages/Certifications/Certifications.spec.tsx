import { screen, _render } from '@test/index'

import { Certifications } from './Certifications'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe(Certifications.name, () => {
  it('renders empty page with filters', async () => {
    _render(<Certifications />)
    expect(screen.getByText('Certifications')).toBeInTheDocument()
    expect(screen.getByText('Filter by date obtained')).toBeInTheDocument()
    expect(screen.getByTestId('FilterSearch-Input')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByCourseLevel')).toBeInTheDocument()
  })
})
