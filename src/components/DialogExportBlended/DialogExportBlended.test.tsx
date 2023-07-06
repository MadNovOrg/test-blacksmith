import { setMedia } from 'mock-match-media'
import React from 'react'

import { screen, render, userEvent, waitFor } from '@test/index'

import { DialogExportBlended } from './index'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('component: DialogExportBlended', () => {
  setMedia({ pointer: 'fine' }) // renders MUI datepicker in desktop mode

  it('render export dialog with filters', async () => {
    const onClose = jest.fn()
    render(<DialogExportBlended isOpen={true} closeModal={onClose} />)
    expect(
      screen.getByText('Export blended learning license summary')
    ).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByTestId('date-range')).toBeInTheDocument()
  })

  it('render export dialog to show dates error if one is missing', async () => {
    const onClose = jest.fn()
    render(<DialogExportBlended isOpen={true} closeModal={onClose} />)

    await waitFor(
      async () => {
        await userEvent.click(screen.getByText('Export'))
      },
      { timeout: 4000 }
    )

    expect(screen.queryByText('Please insert dates')).toBeInTheDocument()
  })
})
