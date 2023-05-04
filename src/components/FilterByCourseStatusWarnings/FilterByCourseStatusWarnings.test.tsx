import React from 'react'

import { Course_Status_Enum } from '@app/generated/graphql'

import { render, screen, userEvent } from '@test/index'

import { FilterByCourseStatusWarnings } from './index'

describe('component: FilterByBlendedLearning', () => {
  it('triggers onChange when filtering by show all warning statuses', async () => {
    const onChange = jest.fn()
    render(<FilterByCourseStatusWarnings onChange={onChange} />)

    //Initial render with call of URL value
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith([])

    await userEvent.click(screen.getByLabelText('Show all warning statuses'))

    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith([
      Course_Status_Enum.ApprovalPending,
      Course_Status_Enum.ConfirmModules,
      Course_Status_Enum.EvaluationMissing,
      Course_Status_Enum.ExceptionsApprovalPending,
      Course_Status_Enum.GradeMissing,
      Course_Status_Enum.TrainerPending,
      Course_Status_Enum.VenueMissing,
    ])
  })
})
