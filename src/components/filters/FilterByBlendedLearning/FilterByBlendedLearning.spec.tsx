import React from 'react'

import { _render, screen, userEvent } from '@test/index'

import { FilterByBlendedLearning } from './index'

describe(FilterByBlendedLearning.name, () => {
  it('triggers onChange when filtering by blended learning', async () => {
    const onChange = vi.fn()
    _render(<FilterByBlendedLearning onChange={onChange} selected />)

    await userEvent.click(screen.getByLabelText('Blended Learning'))

    expect(onChange).toHaveBeenCalled()
  })
})
