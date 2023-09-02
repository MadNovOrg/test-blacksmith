import { render, screen } from '@test/index'

import { ConfirmDialog } from './ConfirmDialog'

describe(ConfirmDialog.name, () => {
  it('should render dialog as expected', async () => {
    const title = 'Dialog title'
    const okLabel = 'OK'
    const cancelLabel = 'Never mind'
    const message = 'Message'
    render(
      <ConfirmDialog
        open={true}
        title={title}
        okLabel={okLabel}
        cancelLabel={cancelLabel}
        message={message}
        onOk={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('Dialog title')).toBeVisible()
    expect(screen.getByText('OK')).toBeVisible()
    expect(screen.getByText('Never mind')).toBeVisible()
    expect(screen.getByText('Message')).toBeVisible()
  })
})
