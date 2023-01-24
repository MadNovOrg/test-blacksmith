import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { act } from '@test/index'

import { useSnackbar, SnackbarProvider } from '.'

describe('hook: useSnackbar', () => {
  it('manages snackbar messages', () => {
    const { result } = renderHook(() => useSnackbar(), {
      wrapper: ({ children }) => (
        <SnackbarProvider>{children}</SnackbarProvider>
      ),
    })

    act(() => {
      result.current.addSnackbarMessage('course-created', { label: 'Label' })
    })

    expect(result.current.messages.size).toBe(1)

    expect(result.current.getSnackbarMessage('course-created')).toEqual({
      label: 'Label',
    })

    act(() => {
      result.current.removeSnackbarMessage('course-created')
    })

    expect(result.current.messages.size).toBe(0)
  })
})
