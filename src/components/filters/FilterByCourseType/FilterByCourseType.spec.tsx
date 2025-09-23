import React from 'react'

import { _render, screen, userEvent } from '@test/index'

import { FilterByCourseType } from './index'

describe(FilterByCourseType.name, () => {
  it('triggers onChange when course type = closed is selected', async () => {
    const onChange = vi.fn()
    _render(<FilterByCourseType onChange={onChange} />)

    await userEvent.click(screen.getByText('Course Type'))
    await userEvent.click(screen.getByText('Closed'))

    expect(onChange).toHaveBeenCalledWith(['CLOSED'])
  })
})
