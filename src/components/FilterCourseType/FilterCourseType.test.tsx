import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterCourseType } from './index'

describe('component: FilterCourseType', () => {
  it('triggers onChange when course type = closed is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseType onChange={onChange} />)

    await userEvent.click(screen.getByText('Course type'))
    await userEvent.click(screen.getByText('Closed'))

    expect(onChange).toHaveBeenCalledWith(['CLOSED'])
  })
})
