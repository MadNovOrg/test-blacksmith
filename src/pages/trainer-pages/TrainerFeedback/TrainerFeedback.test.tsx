import React from 'react'

import { render, screen } from '@test/index'

import { TrainerFeedback } from './index'

describe('TrainerFeedback component', () => {
  it('renders TrainerFeedback', async () => {
    render(<TrainerFeedback />)
    expect(screen.getByText('Trainer summary evaluation')).toBeInTheDocument()
  })
})
