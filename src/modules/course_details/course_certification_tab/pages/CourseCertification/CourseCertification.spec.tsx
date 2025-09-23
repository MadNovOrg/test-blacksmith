import { _render } from '@test/index'

import { CourseCertification } from './CourseCertification'

describe(CourseCertification.name, () => {
  it('should _render', () => {
    const { container } = _render(<CourseCertification certificateId={''} />)
    expect(container).toBeInTheDocument()
  })
})
