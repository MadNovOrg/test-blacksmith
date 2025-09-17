import React from 'react'

import { _render, screen, userEvent, waitFor, fireEvent } from '@test/index'

import { DrawerMenu } from './DrawerMenu'

describe('component: DrawerMenu', () => {
  it('toggles menu', async () => {
    _render(<DrawerMenu />)

    const openButton = screen.getByLabelText('Open menu')
    expect(openButton).toBeInTheDocument()
    expect(screen.queryByTestId('drawer-menu')).not.toBeInTheDocument()
    await userEvent.click(openButton)
    expect(screen.queryByTestId('drawer-menu')).toBeInTheDocument()
    const closeButton = screen.getByLabelText('Close menu')
    expect(closeButton).toBeInTheDocument()
    await waitFor(() => fireEvent.click(closeButton))
    await waitFor(() =>
      expect(screen.queryByTestId('drawer-menu')).not.toBeInTheDocument(),
    )
  })
})
