import React from 'react'

import { render } from '@test/index'

import { Form } from './Form'

const defaultProps = {
  onSuccess: jest.fn(),
  courseId: 123,
}

describe('Form', () => {
  it('matches snapshot', async () => {
    const props = { ...defaultProps }
    const view = render(<Form {...props} />)

    expect(view).toMatchSnapshot()
  })
})
