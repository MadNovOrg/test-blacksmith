import React from 'react'

import { _render, screen, userEvent } from '@test/index'

import { FilterByReaccreditation } from './index'

describe(FilterByReaccreditation.name, () => {
  it('triggers onChange when filtering by reaccreditation', async () => {
    const onChange = vi.fn()
    _render(<FilterByReaccreditation onChange={onChange} selected />)

    await userEvent.click(screen.getByLabelText('Reaccreditation'))

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
