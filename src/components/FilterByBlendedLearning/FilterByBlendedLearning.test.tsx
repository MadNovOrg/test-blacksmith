import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterByBlendedLearning } from './index'

describe('component: FilterByBlendedLearning', () => {
  it('triggers onChange when filtering by blended learning', async () => {
    const onChange = jest.fn()
    render(<FilterByBlendedLearning onChange={onChange} selected />)

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('Blended Learning'))
    })

    expect(onChange).toHaveBeenCalled()
  })
})
