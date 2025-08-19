import { cleanup, render } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'

import { screen } from '@test/index'

import Spotlight from './Spotlight'

describe('Spotlight', () => {
  beforeEach(() => {
    cleanup()
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders nothing if open is false', () => {
    const { container } = render(
      <Spotlight open={false} positionTargetId="target">
        <div>Child</div>
      </Spotlight>,
    )

    expect(container.firstChild).toBeNull()
  })

  it('sets body overflow to hidden when open and restores on unmount', () => {
    const target = document.createElement('div')
    target.id = 'target'
    document.body.appendChild(target)

    const { unmount } = render(
      <Spotlight open={true} positionTargetId="target">
        <div>Child</div>
      </Spotlight>,
    )

    // Check body overflow set
    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    // Check cleanup restores overflow
    expect(document.body.style.overflow).toBe('')
  })

  it('renders children when target element exists', async () => {
    const target = document.createElement('div')
    target.id = 'target'
    document.body.appendChild(target)

    render(
      <Spotlight open={true} positionTargetId="target">
        <div data-testid="child">Child</div>
      </Spotlight>,
    )

    // Wait for the interval to set targetRect and cloneNode
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
