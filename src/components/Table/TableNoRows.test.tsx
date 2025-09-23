import React from 'react'

import { _render, screen, chance, within } from '@test/index'

import { TableNoRows } from './TableNoRows'

const setup = (tr: React.ReactElement<unknown>) => {
  _render(
    <table>
      <tbody>{tr}</tbody>
    </table>,
  )
}

describe('component: TableNoRows', () => {
  it('does not _render when noRecords is false', async () => {
    setup(<TableNoRows noRecords={false} />)

    const tr = screen.queryByTestId('TableNoRows')
    expect(tr).toBeNull()
  })

  it('renders when noRecords is true', async () => {
    setup(<TableNoRows noRecords={true} filtered={false} />)

    const tr = screen.getByTestId('TableNoRows')
    expect(tr).toBeInTheDocument()

    const fixFilters = screen.queryByTestId('TableNoRows-second')
    expect(fixFilters).not.toBeInTheDocument()
  })

  it('allows custom records name', async () => {
    const itemsName = chance.first()

    setup(<TableNoRows noRecords={true} itemsName={itemsName} />)

    const msg = screen.getByText(new RegExp(itemsName))
    expect(msg).toBeInTheDocument()
  })

  it('renders extra info when filtered is true', async () => {
    setup(<TableNoRows noRecords={true} filtered={true} />)

    const tr = screen.getByTestId('TableNoRows')
    expect(tr).toBeInTheDocument()

    const fixFilters = screen.getByTestId('TableNoRows-second')
    expect(fixFilters).toBeInTheDocument()
  })

  it('has correct table cell attribute when noRecords is true', async () => {
    const colSpan = chance.integer()
    setup(<TableNoRows noRecords={true} colSpan={colSpan} />)

    const tr = screen.getByTestId('TableNoRows')
    const td = within(tr).getByRole('cell')
    expect(td).toHaveAttribute('colspan', `${colSpan}`)
  })
})
