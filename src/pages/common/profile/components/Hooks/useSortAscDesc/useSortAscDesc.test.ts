import { act, renderHook } from '@testing-library/react'

import { useSortAscDesc } from './useSortAscDesc'

describe('useSortAscDesc', () => {
  it('should initialize with default sort order', () => {
    const { result } = renderHook(() => useSortAscDesc('asc'))

    expect(result.current.sortOrder).toBe('asc')
  })

  it('should initialize with default sort order if not provided', () => {
    const { result } = renderHook(() => useSortAscDesc())

    expect(result.current.sortOrder).toBe('desc')
  })

  it('should toggle sort order from "asc" to "desc"', () => {
    const { result } = renderHook(() => useSortAscDesc('asc'))

    act(() => {
      result.current.handleSortToggle()
    })

    expect(result.current.sortOrder).toBe('desc')
  })

  it('should toggle sort order from "desc" to "asc"', () => {
    const { result } = renderHook(() => useSortAscDesc('desc'))

    act(() => {
      result.current.handleSortToggle()
    })

    expect(result.current.sortOrder).toBe('asc')
  })
})
