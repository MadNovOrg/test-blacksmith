import React from 'react'

import { _render, screen } from '@test/index'

import { AttendeeMenu } from './AttendeeMenu'

describe('component: AttendeeMenu', () => {
  it('renders menu as expected', async () => {
    const options = [
      {
        id: '1',
        name: 'input name',
        avatar: 'avatar',
      },
      {
        id: '2',
        name: 'input name2',
        avatar: 'avatar2',
      },
    ]
    const placeholder = 'Placeholder text for attendee menu'
    const value = 'value'
    _render(
      <AttendeeMenu
        options={options}
        placeholder={placeholder}
        value={value}
      />,
    )
    expect(screen.getByText('Placeholder text for attendee menu')).toBeVisible()
  })
})
