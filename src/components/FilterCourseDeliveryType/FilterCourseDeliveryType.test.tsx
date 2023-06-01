import React from 'react'

import { render, screen, userEvent } from '@test/index'

import { FilterCourseDeliveryType } from './index'

describe('component: FilterCourseDelivery', () => {
  it('triggers onChange when Delivery = Face to Face is selected', async () => {
    const onChange = jest.fn()
    render(<FilterCourseDeliveryType onChange={onChange} />)

    await userEvent.click(screen.getByText('Delivery'))
    await userEvent.click(screen.getByText('Face to Face'))

    expect(onChange).toHaveBeenCalledWith(['F2F'])
  })
})
