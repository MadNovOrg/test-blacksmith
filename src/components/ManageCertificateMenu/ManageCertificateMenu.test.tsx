import React from 'react'

import { RoleName } from '@app/types'

import { render, screen, userEvent } from '@test/index'

import { ManageCertificateMenu } from './ManageCertificateMenu'

describe('ManageCertificateMenu', () => {
  const onShowModifyGradeMock = vi.fn()
  const onShowRevokeModalMock = vi.fn()
  const onShowUndoRevokeModalMock = vi.fn()
  const onShowPutOnHoldModalMock = vi.fn()
  const onShowChangelogModalMock = vi.fn()

  it('when role is admin', async () => {
    render(
      <ManageCertificateMenu
        isRevoked={false}
        certificateChangeLength={1}
        onShowModifyGrade={onShowModifyGradeMock}
        onShowRevokeModal={onShowRevokeModalMock}
        onShowUndoRevokeModal={onShowUndoRevokeModalMock}
        onShowPutOnHoldModal={onShowPutOnHoldModalMock}
        onShowChangelogModal={onShowChangelogModalMock}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    expect(screen.queryByText('revoke certificate')).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Manage certificate' }),
    )

    expect(screen.queryByText('Modify grade')).toBeInTheDocument()
    expect(screen.queryByText('Put on hold')).toBeInTheDocument()
    expect(screen.queryByText('Change log')).toBeInTheDocument()
    expect(screen.queryByText('Revoke certificate')).toBeInTheDocument()

    expect(screen.queryByText('Reinstate certificate')).not.toBeInTheDocument()
  })

  it('when role is not admin', async () => {
    render(
      <ManageCertificateMenu
        isRevoked={false}
        certificateChangeLength={1}
        onShowModifyGrade={onShowModifyGradeMock}
        onShowRevokeModal={onShowRevokeModalMock}
        onShowUndoRevokeModal={onShowUndoRevokeModalMock}
        onShowPutOnHoldModal={onShowPutOnHoldModalMock}
        onShowChangelogModal={onShowChangelogModalMock}
      />,
      { auth: { activeRole: RoleName.USER } },
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Manage certificate' }),
    )

    expect(screen.queryByText('Modify grade')).not.toBeInTheDocument()
    expect(screen.queryByText('Put on hold')).not.toBeInTheDocument()
    expect(screen.queryByText('Change log')).not.toBeInTheDocument()
    expect(screen.queryByText('Revoke certificate')).not.toBeInTheDocument()

    expect(screen.queryByText('Reinstate certificate')).not.toBeInTheDocument()
  })

  it('when cert is revoked', async () => {
    render(
      <ManageCertificateMenu
        isRevoked={true}
        certificateChangeLength={1}
        onShowModifyGrade={onShowModifyGradeMock}
        onShowRevokeModal={onShowRevokeModalMock}
        onShowUndoRevokeModal={onShowUndoRevokeModalMock}
        onShowPutOnHoldModal={onShowPutOnHoldModalMock}
        onShowChangelogModal={onShowChangelogModalMock}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Manage certificate' }),
    )

    expect(screen.queryByText('Reinstate')).toBeInTheDocument()
    expect(screen.queryByText('Modify grade')).toHaveAttribute('aria-disabled')
    expect(screen.queryByText('Put on hold')).toHaveAttribute('aria-disabled')
  })

  it('does not render change log menu when not applicable', async () => {
    render(
      <ManageCertificateMenu
        isRevoked={true}
        certificateChangeLength={0}
        onShowModifyGrade={onShowModifyGradeMock}
        onShowRevokeModal={onShowRevokeModalMock}
        onShowUndoRevokeModal={onShowUndoRevokeModalMock}
        onShowPutOnHoldModal={onShowPutOnHoldModalMock}
        onShowChangelogModal={onShowChangelogModalMock}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await userEvent.click(
      screen.getByRole('button', { name: 'Manage certificate' }),
    )

    expect(screen.queryByText('Change log')).not.toBeInTheDocument()
  })
})
