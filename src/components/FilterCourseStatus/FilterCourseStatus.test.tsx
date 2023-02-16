import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterCourseStatus } from './index'

describe('component: FilterCourseStatus', () => {
  it('triggers onChange when course status = grade missing is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseStatus onChange={onChange} />)

    await userEvent.click(screen.getByText('Course Status'))
    await userEvent.click(screen.getByText('Missing grade'))

    expect(onChange).toHaveBeenCalledWith(['GRADE_MISSING'])
  })
})
