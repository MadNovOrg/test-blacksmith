import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'

import { render, screen, userEvent, chance } from '@test/index'

import { useTableChecks } from './useTableChecks'

describe('useTableChecks', () => {
  it('has none selected by default', async () => {
    const { result } = renderHook(() => useTableChecks())

    const selected = [...result.current.selected]
    expect(selected).toStrictEqual([])
  })

  it('sets expected selected object', async () => {
    const { result } = renderHook(() => useTableChecks())

    const obj = { id: chance.guid(), name: chance.name() }
    act(() => {
      result.current.setSelected([obj.id])
    })

    expect(result.current.isSelected(obj.id)).toBe(true)
    const selected = [...result.current.selected]
    expect(selected).toStrictEqual([obj.id])
  })

  it('sets multiple selected object', async () => {
    const { result } = renderHook(() => useTableChecks())

    const obj1 = { id: chance.guid(), name: chance.name() }
    const obj2 = { id: chance.guid(), name: chance.name() }
    const obj3 = { id: chance.guid(), name: chance.name() }

    act(() => result.current.setSelected([obj1.id]))
    expect(result.current.isSelected(obj1.id)).toBe(true)
    expect(result.current.isSelected(obj2.id)).toBe(false)
    expect(result.current.isSelected(obj3.id)).toBe(false)

    act(() => result.current.setSelected([obj2.id, obj3.id]))
    expect(result.current.isSelected(obj1.id)).toBe(true)
    expect(result.current.isSelected(obj2.id)).toBe(true)
    expect(result.current.isSelected(obj3.id)).toBe(true)

    const selected = [...result.current.selected]
    expect(selected).toStrictEqual([obj1.id, obj2.id, obj3.id])
  })

  it('unselects one object', async () => {
    const { result } = renderHook(() => useTableChecks())

    const obj1 = { id: chance.guid(), name: chance.name() }
    const obj2 = { id: chance.guid(), name: chance.name() }

    act(() => result.current.setSelected([obj1.id, obj2.id]))
    expect(result.current.isSelected(obj1.id)).toBe(true)
    expect(result.current.isSelected(obj2.id)).toBe(true)

    act(() => result.current.setSelected([obj2.id], false))
    expect(result.current.isSelected(obj1.id)).toBe(true)
    expect(result.current.isSelected(obj2.id)).toBe(false)

    const selected = [...result.current.selected]
    expect(selected).toStrictEqual([obj1.id])
  })

  it('unselects all objects', async () => {
    const { result } = renderHook(() => useTableChecks())

    const obj1 = { id: chance.guid(), name: chance.name() }
    const obj2 = { id: chance.guid(), name: chance.name() }

    act(() => result.current.setSelected([obj1.id, obj2.id]))
    expect(result.current.isSelected(obj1.id)).toBe(true)
    expect(result.current.isSelected(obj2.id)).toBe(true)

    act(() => result.current.setSelected([]))
    expect(result.current.isSelected(obj1.id)).toBe(false)
    expect(result.current.isSelected(obj2.id)).toBe(false)

    const selected = [...result.current.selected]
    expect(selected).toStrictEqual([])
  })

  it('renders checkboxes', async () => {
    const obj1 = { id: chance.guid(), name: chance.name() }
    const obj2 = { id: chance.guid(), name: chance.name() }

    render(<Table entries={[obj1, obj2]} />)

    const headCheck = screen.getByTestId('TableChecks-Head')
    const rowChecks = screen.getAllByTestId('TableChecks-Row')

    expect(headCheck).not.toBeChecked()
    expect(rowChecks).toHaveLength(2)
    rowChecks.forEach(rc => expect(rc).not.toBeChecked())
  })

  it('responds to checkboxes clicks', async () => {
    const obj1 = { id: chance.guid(), name: chance.name() }
    const obj2 = { id: chance.guid(), name: chance.name() }

    render(<Table entries={[obj1, obj2]} />)

    const headCheck = screen.getByTestId('TableChecks-Head')
    const rowChecks = screen.getAllByTestId('TableChecks-Row')

    expect(headCheck).not.toBeChecked()
    rowChecks.forEach(rc => expect(rc).not.toBeChecked())

    userEvent.click(rowChecks[1])

    expect(headCheck).not.toBeChecked()
    expect(headCheck).toHaveAttribute('data-indeterminate', 'true')
    expect(rowChecks[1]).toBeChecked()
  })

  it('selects all when head checkbox is clicked', async () => {
    const obj1 = { id: chance.guid(), name: chance.name() }
    const obj2 = { id: chance.guid(), name: chance.name() }

    render(<Table entries={[obj1, obj2]} />)

    const headCheck = screen.getByTestId('TableChecks-Head')
    const rowChecks = screen.getAllByTestId('TableChecks-Row')

    expect(headCheck).not.toBeChecked()
    rowChecks.forEach(rc => expect(rc).not.toBeChecked())

    userEvent.click(headCheck)
    expect(headCheck).toBeChecked()
    rowChecks.forEach(rc => expect(rc).toBeChecked())

    userEvent.click(headCheck)
    expect(headCheck).not.toBeChecked()
    rowChecks.forEach(rc => expect(rc).not.toBeChecked())
  })
})

/**
 * Helpers
 */

type Props = { entries: { id: string; name: string }[] }
function Table({ entries }: Props) {
  const { checkbox } = useTableChecks()

  return (
    <table>
      <thead>
        <tr>
          <th>{checkbox.headCol(entries.map(e => e.id)).component}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(e => (
          <tr key={e.id}>{checkbox.rowCell(e.id)}</tr>
        ))}
      </tbody>
    </table>
  )
}
