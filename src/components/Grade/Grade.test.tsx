import React from 'react'

import { Grade as GradeEnum } from '@app/types'

import { render, screen } from '@test/index'

import { Grade } from './index'

describe('Grade component', () => {
  it('renders Pass grade', async () => {
    const grade = GradeEnum.PASS
    render(<Grade grade={grade} />)
    expect(screen.getByText('Pass')).toBeInTheDocument()
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument()
  })
})
