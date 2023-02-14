import React from 'react'

import { CourseEvaluationQuestionType } from '@app/types'

import { render, screen, userEvent } from '@test/index'

import { BooleanQuestion } from './index'

describe('BooleanQuestion component', () => {
  it('renders BooleanQuestionReasonYes', async () => {
    const type = CourseEvaluationQuestionType.BOOLEAN_REASON_Y
    const value = 'YES'
    const reason = 'my reason'
    const infoText = 'info text'
    render(
      <BooleanQuestion
        type={type}
        value={value}
        reason={reason}
        infoText={infoText}
      />
    )
    userEvent.click(screen.getByTestId('rating-yes'))
    expect(screen.getByTestId('rating-boolean-reason-yes')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('info text')).toBeInTheDocument()
  })
  it('renders BooleanQuestionReasonNo', async () => {
    const type = CourseEvaluationQuestionType.BOOLEAN_REASON_N
    const value = 'NO'
    const reason = 'reason'
    const infoText = 'information text'
    render(
      <BooleanQuestion
        type={type}
        value={value}
        reason={reason}
        infoText={infoText}
      />
    )
    userEvent.click(screen.getByTestId('rating-no'))
    expect(screen.getByTestId('rating-boolean-reason-no')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('information text')).toBeInTheDocument()
  })
})
