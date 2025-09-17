import React from 'react'

import { _render, screen } from '@test/index'

import { QuestionGroup } from './index'

describe('QuestionGroup component', () => {
  it('renders QuestionGroup', async () => {
    const title = 'my title'
    const description = 'my description'
    const error = 'test error'
    _render(
      <QuestionGroup title={title} description={description} error={error} />,
    )
    expect(screen.getByText('my title')).toBeInTheDocument()
    expect(screen.getByText('my description')).toBeInTheDocument()
    expect(screen.getByText('test error')).toBeInTheDocument()
  })
})
