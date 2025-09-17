import React from 'react'

import { Grade_Enum } from '@app/generated/graphql'

import { _render, screen } from '@test/index'

import { Grade } from './index'

describe('Grade component', () => {
  it('renders Pass grade', async () => {
    const grade = Grade_Enum.Pass
    _render(<Grade grade={grade} />)
    expect(screen.getByText('Pass')).toBeInTheDocument()
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument()
  })
})
