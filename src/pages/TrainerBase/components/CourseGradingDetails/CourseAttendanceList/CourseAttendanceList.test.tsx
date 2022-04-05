import userEvent from '@testing-library/user-event'
import React from 'react'

import { render, screen, chance, within } from '@test/index'

import { CourseAttendanceList } from './index'

describe('component: CourseAttendanceList', () => {
  it('selects single participant as attended', () => {
    const participants = [
      { id: chance.guid(), attending: false, name: chance.name() },
    ]

    const onChangeMock = jest.fn()

    render(
      <CourseAttendanceList
        participants={participants}
        onChange={onChangeMock}
      />
    )

    userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith({ [participants[0].id]: true })
    expect(screen.getByText('1 selected')).toBeInTheDocument()
    expect(
      within(
        screen.getByTestId(`participant-attendance-${participants[0].id}`)
      ).getByText('Attended + ID checked')
    ).toBeInTheDocument()
  })

  it('selects single participant as did not attend', () => {
    const participants = [
      { id: chance.guid(), attending: true, name: chance.name() },
    ]

    const onChangeMock = jest.fn()

    render(
      <CourseAttendanceList
        participants={participants}
        onChange={onChangeMock}
      />
    )

    userEvent.click(
      screen.getByTestId(`${participants[0].id}-attendance-checkbox`)
    )

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith({ [participants[0].id]: false })
    expect(screen.getByText('0 selected')).toBeInTheDocument()
  })

  it('selects all participants when master checkbox is checked', () => {
    const participants = [
      { id: chance.guid(), attending: false, name: chance.name() },
      { id: chance.guid(), attending: false, name: chance.name() },
    ]

    const onChangeMock = jest.fn()

    render(
      <CourseAttendanceList
        participants={participants}
        onChange={onChangeMock}
      />
    )

    userEvent.click(screen.getByLabelText('Select all'))

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith({
      [participants[0].id]: true,
      [participants[1].id]: true,
    })

    expect(screen.getByLabelText('Deselect all')).toBeChecked()
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('deselects all participants when master checkbox is unchecked', () => {
    const participants = [
      { id: chance.guid(), attending: true, name: chance.name() },
      { id: chance.guid(), attending: true, name: chance.name() },
    ]

    const onChangeMock = jest.fn()

    render(
      <CourseAttendanceList
        participants={participants}
        onChange={onChangeMock}
      />
    )

    userEvent.click(screen.getByLabelText('Deselect all'))

    expect(onChangeMock).toHaveBeenCalledTimes(1)
    expect(onChangeMock).toHaveBeenCalledWith({
      [participants[0].id]: false,
      [participants[1].id]: false,
    })

    expect(screen.getByLabelText('Select all')).not.toBeChecked()
    expect(screen.getByText('0 selected')).toBeInTheDocument()
  })
})
