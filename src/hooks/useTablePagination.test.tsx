import { renderHook } from '@testing-library/react-hooks'
import React, { useState } from 'react'

import { render, screen, userEvent } from '@test/index'

import { useTablePagination } from './useTablePagination'

const Wrapper: React.FC<{ total?: number }> = ({ total = 36 }) => {
  const [halveTotal, setHalveTotal] = useState(false)
  const { Pagination, perPage, currentPage, limit, offset } =
    useTablePagination()

  return (
    <>
      <div data-testid="perPage">{perPage}</div>
      <div data-testid="currentPage">{currentPage}</div>
      <div data-testid="limit">{limit}</div>
      <div data-testid="offset">{offset}</div>
      <input
        type="button"
        value="Halve total"
        onClick={() => {
          setHalveTotal(true)
        }}
      />
      <Pagination total={halveTotal ? total / 2 : total} />
    </>
  )
}

const clickNext = () => {
  userEvent.click(screen.getByLabelText('Go to next page'))
}

const clickPrev = () => {
  userEvent.click(screen.getByLabelText('Go to previous page'))
}

describe('useTablePagination', () => {
  it('returns expected shape and defaults', async () => {
    const { result } = renderHook(() => useTablePagination())

    const keys = Object.keys(result.current)
    expect(keys).toStrictEqual([
      'Pagination',
      'perPage',
      'currentPage',
      'limit',
      'offset',
    ])

    expect(result.current.perPage).toBe(12)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.limit).toBe(12)
    expect(result.current.offset).toBe(0)
  })

  it('updates correctly on next page', async () => {
    render(<Wrapper />)

    const displayed = screen.getByText('1–12 of 36')
    expect(displayed).toBeInTheDocument()

    expect(screen.getByTestId('perPage')).toHaveTextContent('12')
    expect(screen.getByTestId('currentPage')).toHaveTextContent('1')
    expect(screen.getByTestId('limit')).toHaveTextContent('12')
    expect(screen.getByTestId('offset')).toHaveTextContent('0')

    const prev = screen.getByLabelText('Go to previous page')
    expect(prev).toBeDisabled()

    clickNext()

    expect(screen.getByText('13–24 of 36')).toBeInTheDocument()
    expect(screen.getByTestId('perPage')).toHaveTextContent('12')
    expect(screen.getByTestId('currentPage')).toHaveTextContent('2')
    expect(screen.getByTestId('limit')).toHaveTextContent('12')
    expect(screen.getByTestId('offset')).toHaveTextContent('12')

    clickNext()

    expect(screen.getByText('25–36 of 36')).toBeInTheDocument()
    expect(screen.getByTestId('perPage')).toHaveTextContent('12')
    expect(screen.getByTestId('currentPage')).toHaveTextContent('3')
    expect(screen.getByTestId('limit')).toHaveTextContent('12')
    expect(screen.getByTestId('offset')).toHaveTextContent('24')

    expect(screen.getByLabelText('Go to next page')).toBeDisabled()
  })

  it('updates correctly on prev page', async () => {
    render(<Wrapper />)

    const displayed = screen.getByText('1–12 of 36')
    expect(displayed).toBeInTheDocument()

    // Go to last page
    clickNext()
    clickNext()

    expect(screen.getByText('25–36 of 36')).toBeInTheDocument()
    expect(screen.getByTestId('perPage')).toHaveTextContent('12')
    expect(screen.getByTestId('currentPage')).toHaveTextContent('3')
    expect(screen.getByTestId('limit')).toHaveTextContent('12')
    expect(screen.getByTestId('offset')).toHaveTextContent('24')

    clickPrev()

    expect(screen.getByText('13–24 of 36')).toBeInTheDocument()
    expect(screen.getByTestId('perPage')).toHaveTextContent('12')
    expect(screen.getByTestId('currentPage')).toHaveTextContent('2')
    expect(screen.getByTestId('limit')).toHaveTextContent('12')
    expect(screen.getByTestId('offset')).toHaveTextContent('12')

    clickPrev()

    expect(screen.getByText('1–12 of 36')).toBeInTheDocument()
    expect(screen.getByTestId('perPage')).toHaveTextContent('12')
    expect(screen.getByTestId('currentPage')).toHaveTextContent('1')
    expect(screen.getByTestId('limit')).toHaveTextContent('12')
    expect(screen.getByTestId('offset')).toHaveTextContent('0')

    expect(screen.getByLabelText('Go to previous page')).toBeDisabled()
  })

  it('resets the current page if the total changes', async () => {
    render(<Wrapper total={48} />)

    // Go to last page
    clickNext()
    clickNext()
    clickNext()
    expect(screen.getByText('37–48 of 48')).toBeInTheDocument()

    // Reduce the total number of items to 24
    userEvent.click(screen.getByText('Halve total'))

    expect(screen.getByText('1–12 of 24')).toBeInTheDocument()
  })
})
