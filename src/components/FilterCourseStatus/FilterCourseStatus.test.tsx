import React from 'react'

import { render, screen, waitFor, userEvent } from '@test/index'

import { FilterCourseStatus } from './index'

describe('component: FilterCourseStatus', () => {
  it('triggers onChange when course status = grade missing is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseStatus onChange={onChange} />)

    await waitFor(() => {
      userEvent.click(screen.getByText('Course Status'))
      userEvent.click(screen.getByText('Missing grade'))
    })

    expect(onChange).toHaveBeenCalledWith(['GRADE_MISSING'])
  })
})
