import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterByReaccreditation } from './index'

describe('component: FilterByReaccreditation', () => {
  it('triggers onChange when filtering by reaccreditation', async () => {
    const onChange = jest.fn()
    render(<FilterByReaccreditation onChange={onChange} selected />)

    await userEvent.click(screen.getByLabelText('Reaccreditation'))

    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
