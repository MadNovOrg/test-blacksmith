import { renderHook, act } from '@test/index'
import { TestMemoryRouter } from '@test/index'

import { useTableSort } from '.'

describe('useTableSort', () => {
  it('returns expected defaults', async () => {
    const { result } = renderHook(() => useTableSort(), {
      wrapper: TestMemoryRouter,
    })

    expect(result.current.by).toBe('')
    expect(result.current.dir).toBe('asc')
    expect(typeof result.current.onSort).toBe('function')
  })

  it('sets by as expected', async () => {
    const { result } = renderHook(() => useTableSort(), {
      wrapper: TestMemoryRouter,
    })

    expect(result.current.by).toBe('')
    expect(result.current.dir).toBe('asc')

    act(() => result.current.onSort('someCol'))
    expect(result.current.by).toBe('someCol')
    expect(result.current.dir).toBe('asc')

    act(() => result.current.onSort('someCol'))
    expect(result.current.by).toBe('someCol')
    expect(result.current.dir).toBe('desc')

    act(() => result.current.onSort('anotherCol'))
    expect(result.current.by).toBe('anotherCol')
    expect(result.current.dir).toBe('asc')
  })

  it('sets dir as expected', async () => {
    const { result } = renderHook(() => useTableSort('someCol', 'desc'), {
      wrapper: TestMemoryRouter,
    })

    expect(result.current.by).toBe('someCol')
    expect(result.current.dir).toBe('desc')

    act(() => result.current.onSort('someCol'))
    expect(result.current.by).toBe('someCol')
    expect(result.current.dir).toBe('asc')

    act(() => result.current.onSort('someCol'))
    expect(result.current.by).toBe('someCol')
    expect(result.current.dir).toBe('desc')
  })
})
