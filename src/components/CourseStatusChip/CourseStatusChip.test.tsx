import React from 'react'

import { Course_Status_Enum } from '@app/generated/graphql'

import { _render, screen } from '@test/index'

import { CourseStatusChip } from '.'

describe('component: CourseStatusChip', () => {
  it('renders warning icon if color of status is warning', () => {
    _render(<CourseStatusChip status={Course_Status_Enum.TrainerPending} />)

    expect(screen.getByTestId('WarningIcon')).toBeInTheDocument()
  })
})
