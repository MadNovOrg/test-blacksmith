import { _render } from '@test/index'

import { BannerBox } from './BannerBox'

describe(BannerBox.name, () => {
  it('should _render Box with default styles', () => {
    const { container } = _render(<BannerBox />)

    expect(container.firstChild).toHaveStyle('display: flex;')
  })

  it('should _render Box with rounded corners when roundedCorners prop is true', () => {
    const { container } = _render(<BannerBox roundedCorners={true} />)

    expect(container.firstChild).toHaveStyle('border-radius: 30px;')
  })
})
