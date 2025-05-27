import { render } from '@test/index'

import { CourseCertification } from './CourseCertification'

describe(CourseCertification.name, () => {
  it('should render', () => {
    const { container } = render(<CourseCertification certificateId={''} />)
    expect(container).toBeInTheDocument()
  })
})
