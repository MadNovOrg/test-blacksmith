import React from 'react'

import { SnackbarProvider, SnackbarState } from '@app/context/snackbar'

import { render, screen, waitFor, act } from '@test/index'

import { SnackbarMessage } from '.'

describe('component: SnackbarMessage', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it("doesn't render anything if message by key is not found", () => {
    act(() => {
      render(
        <SnackbarProvider>
          <SnackbarMessage messageKey="course-created" />
        </SnackbarProvider>
      )
    })

    expect(screen.queryByText(/course created/i)).not.toBeInTheDocument()
  })

  it('renders message by key if found in context', () => {
    const initialMessages: SnackbarState['messages'] = new Map()

    initialMessages.set('course-created', { label: 'course created' })

    act(() => {
      render(
        <SnackbarProvider initialMessages={initialMessages}>
          <SnackbarMessage messageKey="course-created" />
        </SnackbarProvider>
      )
    })

    expect(screen.getByText(/course created/i)).toBeInTheDocument()
  })

  it('deletes message by key on snackbar dismissed', async () => {
    const initialMessages: SnackbarState['messages'] = new Map()

    initialMessages.set('course-created', {
      label: 'course created',
    })

    act(() => {
      render(
        <SnackbarProvider initialMessages={initialMessages}>
          <SnackbarMessage messageKey="course-created" />
        </SnackbarProvider>
      )

      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(screen.queryByText(/course created/i)).not.toBeInTheDocument()
    })
  })
})
