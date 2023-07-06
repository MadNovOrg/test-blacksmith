import React from 'react'

import { render, screen, chance, waitForCalls, userEvent } from '@test/index'

import { FilterSearch } from './FilterSearch'

describe('components: FilterSearch', () => {
  it('renders as expected', async () => {
    const onChange = jest.fn()
    render(<FilterSearch onChange={onChange} />)

    const input = screen.getByTestId('FilterSearch-Input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(screen.getByTestId('FilterSearch-Clear')).toBeDisabled()

    await expect(waitForCalls(onChange)).rejects.toThrow()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('takes in a value', async () => {
    const value = chance.first()
    const onChange = jest.fn()
    render(<FilterSearch value={value} onChange={onChange} />)

    const input = screen.getByTestId('FilterSearch-Input')

    expect(input).toHaveValue(value)
    expect(screen.getByTestId('FilterSearch-Clear')).not.toBeDisabled()

    await expect(waitForCalls(onChange)).rejects.toThrow()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onChange debounced when user types', async () => {
    const value = chance.first()
    const onChange = jest.fn()
    render(<FilterSearch value="" onChange={onChange} />)

    const input = screen.getByTestId('FilterSearch-Input')

    expect(input).toHaveValue('')
    userEvent.type(input, value)

    await waitForCalls(onChange, 1, 3000)
    expect(onChange).toHaveBeenCalledWith(value)
  })

  it('calls onChange not debounced when user types', async () => {
    const value = chance.first()
    const onChange = jest.fn()
    render(<FilterSearch value="" onChange={onChange} debounce={0} />)

    const input = screen.getByTestId('FilterSearch-Input')

    expect(input).toHaveValue('')
    await userEvent.type(input, value, { delay: 25 })

    await waitForCalls(onChange, value.length)
    expect(onChange).toHaveBeenCalledTimes(value.length)

    for (let i = 1; i <= value.length; i++) {
      expect(onChange).toHaveBeenCalledWith(value.slice(0, i))
    }
  })

  it('clears text', async () => {
    const value = chance.first()
    const onChange = jest.fn()
    render(<FilterSearch value={value} onChange={onChange} debounce={0} />)

    const input = screen.getByTestId('FilterSearch-Input')
    const clear = screen.getByTestId('FilterSearch-Clear')

    expect(input).toHaveValue(value)
    expect(clear).not.toBeDisabled()

    userEvent.click(clear)

    await waitForCalls(onChange)
    expect(input).toHaveValue('')
    expect(onChange).toHaveBeenCalledWith('')
  })
})
