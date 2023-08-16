import { render } from '@test/index'

import { BannerBox } from './BannerBox'

describe(BannerBox.name, () => {
  it('should render Box with default styles', () => {
    const { container } = render(<BannerBox />)

    expect(container.firstChild).toHaveStyle('display: flex;')
  })

  it('should render Box with rounded corners when roundedCorners prop is true', () => {
    const { container } = render(<BannerBox roundedCorners={true} />)

    expect(container.firstChild).toHaveStyle('border-radius: 30px;')
  })
})
