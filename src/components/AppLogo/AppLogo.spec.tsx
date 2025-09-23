import { _render, screen } from '@test/index'

import { AppLogo } from './AppLogo'

describe(AppLogo.name, () => {
  it('should _render AppLogo component correctly', async () => {
    _render(<AppLogo width={50} height={50} variant="partial" />)

    expect(screen.getByTestId('app-logo-svg')).toBeVisible()
  })

  it('should _render AppLogo component with default props', async () => {
    _render(<AppLogo />)

    const svgElement = screen.getByTestId('app-logo-svg')

    expect(svgElement).toHaveAttribute('width', '40')
    expect(svgElement).toHaveAttribute('height', '40')
  })

  it('should _render AppLogo width and height values according to props', async () => {
    _render(<AppLogo width={60} height={55} variant="partial" />)

    const svgElement = screen.getByTestId('app-logo-svg')

    expect(svgElement).toHaveAttribute('width', '60')
    expect(svgElement).toHaveAttribute('height', '55')
  })
})
