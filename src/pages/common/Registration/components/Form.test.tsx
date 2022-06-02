import React from 'react'

import { render } from '@test/index'

import { Form } from './Form'

const defaultProps = {
  onSignUp: jest.fn(),
  courseId: 123,
  quantity: 2,
}

describe('Form', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern')
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('matches snapshot', async () => {
    jest.setSystemTime(new Date(2022, 4, 23))
    const props = { ...defaultProps }
    const view = render(<Form {...props} />)

    expect(view).toMatchSnapshot()
  })
})
