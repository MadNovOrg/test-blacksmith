import { render, screen } from '@test/index'

import { AppFooter } from './index'

describe(AppFooter.name, () => {
  it('displays Footer links', async () => {
    render(<AppFooter />)
    expect(screen.getByText('Follow Team Teach')).toBeVisible()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(9)
    expect(screen.getByTestId('terms-of-use')).toBeVisible()
    expect(screen.getByTestId('terms-of-business')).toBeVisible()
    expect(screen.getByTestId('privacy-policy')).toBeVisible()
    expect(screen.getByTestId('cookie-policy')).toBeVisible()
    expect(screen.getByTestId('right-to-withdrawal')).toBeVisible()
    expect(screen.getByTestId('FacebookIcon')).toBeVisible()
    expect(screen.getByTestId('InstagramIcon')).toBeVisible()
    expect(screen.getByTestId('TwitterIcon')).toBeVisible()
    expect(screen.getByTestId('YouTubeIcon')).toBeVisible()
  })
})
