import { render, screen } from '@test/index'

import { AppFooter } from './index'

describe(AppFooter.name, () => {
  it('displays Footer links', async () => {
    render(<AppFooter />)
    expect(screen.getByText('Follow Team Teach')).toBeVisible()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(4)
    expect(screen.getByTestId('FacebookIcon')).toBeVisible()
    expect(screen.getByTestId('InstagramIcon')).toBeVisible()
    expect(screen.getByTestId('TwitterIcon')).toBeVisible()
    expect(screen.getByTestId('YouTubeIcon')).toBeVisible()
  })
})
