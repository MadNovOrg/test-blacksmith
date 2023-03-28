import React from 'react'

import { CertificateStatus } from '@app/types'

import { render, screen } from '@test/index'

import { CertificateStatusChip } from '.'

describe('component: CertificateStatusChip', () => {
  it('renders warning icon if status is REVOKED', () => {
    render(<CertificateStatusChip status={CertificateStatus.REVOKED} />)

    expect(screen.getByTestId('WarningIcon')).toBeInTheDocument()
  })
})
