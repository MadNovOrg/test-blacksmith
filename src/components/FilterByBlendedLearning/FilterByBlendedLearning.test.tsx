import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterByBlendedLearning } from './index'

describe('component: FilterByBlendedLearning', () => {
  it('triggers onChange when filtering by blended learning', async () => {
    const onChange = jest.fn()
    render(<FilterByBlendedLearning onChange={onChange} selected />)

    await userEvent.click(screen.getByLabelText('Blended learning'))

    expect(onChange).toHaveBeenCalled()
  })
})
