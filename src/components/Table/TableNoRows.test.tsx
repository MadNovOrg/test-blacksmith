import React from 'react'

import { render, screen, chance, within } from '@test/index'

import { TableNoRows } from './TableNoRows'

const _render = (tr: React.ReactElement) => {
  render(
    <table>
      <tbody>{tr}</tbody>
    </table>
  )
}

describe('component: TableNoRows', () => {
  it('does not render when noRecords is false', async () => {
    _render(<TableNoRows noRecords={false} />)

    const tr = screen.queryByTestId('TableNoRows')
    expect(tr).toBeNull()
  })

  it('renders when noRecords is true', async () => {
    _render(<TableNoRows noRecords={true} filtered={false} />)

    const tr = screen.getByTestId('TableNoRows')
    expect(tr).toBeInTheDocument()

    const fixFilters = screen.queryByTestId('TableNoRows-fixFilters')
    expect(fixFilters).not.toBeInTheDocument()
  })

  it('allows custom records name', async () => {
    const itemsName = chance.first()

    _render(<TableNoRows noRecords={true} itemsName={itemsName} />)

    const msg = screen.getByText(new RegExp(itemsName))
    expect(msg).toBeInTheDocument()
  })

  it('renders extra info when filtered is true', async () => {
    _render(<TableNoRows noRecords={true} filtered={true} />)

    const tr = screen.getByTestId('TableNoRows')
    expect(tr).toBeInTheDocument()

    const fixFilters = screen.getByTestId('TableNoRows-fixFilters')
    expect(fixFilters).toBeInTheDocument()
  })

  it('renders when noRecords is true', async () => {
    const colSpan = chance.integer()
    _render(<TableNoRows noRecords={true} colSpan={colSpan} />)

    const tr = screen.getByTestId('TableNoRows')
    const td = within(tr).getByRole('cell')
    expect(td).toHaveAttribute('colspan', `${colSpan}`)
  })
})
