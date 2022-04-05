import React from 'react'

import { render, fireEvent, waitForCalls } from '@test/index'

import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('does not render children when open is false', async () => {
    const { queryByTestId } = render(
      <Dialog open={false} onClose={jest.fn()}>
        <p data-testid="dialog-children">test</p>
      </Dialog>
    )

    expect(queryByTestId('dialog-children')).not.toBeInTheDocument()
  })

  it('renders children when open is true', async () => {
    const { queryByTestId } = render(
      <Dialog open={true} onClose={jest.fn()}>
        <p data-testid="dialog-children">test</p>
      </Dialog>
    )

    expect(queryByTestId('dialog-children')).toBeInTheDocument()
  })

  it('renders title when provided', async () => {
    const { queryByTestId } = render(
      <Dialog
        open={true}
        title={<p data-testid="dialog-title">my title</p>}
        onClose={jest.fn()}
      >
        <p data-testid="dialog-children">test</p>
      </Dialog>
    )

    expect(queryByTestId('dialog-title')).toBeInTheDocument()
  })

  it('renders close button by default', async () => {
    const { queryByTestId } = render(
      <Dialog open={true} onClose={jest.fn()}></Dialog>
    )

    expect(queryByTestId('dialog-close')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn()
    const { getByTestId } = render(
      <Dialog open={true} onClose={onClose}></Dialog>
    )

    const closeBtn = getByTestId('dialog-close')

    fireEvent.click(closeBtn)
    await waitForCalls(onClose)
  })

  it('does not render close button when showClose is false', async () => {
    const { queryByTestId } = render(
      <Dialog open={true} showClose={false} onClose={jest.fn()}></Dialog>
    )

    expect(queryByTestId('dialog-close')).not.toBeInTheDocument()
  })
})
