import React from 'react'

import { SearchTrainers } from './SearchTrainers'

import { render, screen, chance, userEvent, waitForCalls } from '@test/index'

const mockSearch = jest.fn().mockResolvedValue({ trainers: [] })
jest.mock('./useQueryTrainers.ts', () => ({
  useQueryTrainers: () => ({ search: mockSearch }),
}))

describe('component: SearchTrainers', () => {
  it('renders as expected', async () => {
    const { container } = render(<SearchTrainers />)

    const input = screen.getByTestId('SearchTrainers-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')

    const searchIcon = screen.getByTestId('SearchTrainers-input-icon')
    expect(searchIcon).toBeInTheDocument()

    const loadingIcon = container.querySelector('.MuiCircularProgress-root')
    expect(loadingIcon).toBeInTheDocument()
    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused
  })

  it('uses provided placeholder', async () => {
    const placeholder = chance.sentence()
    render(<SearchTrainers placeholder={placeholder} />)

    const input = screen.getByPlaceholderText(placeholder)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('calls search trainers when input term length is >= 3', async () => {
    const { container } = render(<SearchTrainers />)
    const input = screen.getByTestId('SearchTrainers-input')
    const loadingIcon = container.querySelector('.MuiCircularProgress-root')

    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused

    const shortQuery = chance.last().slice(0, 3)
    userEvent.type(input, shortQuery)
    expect(input).toHaveValue(shortQuery)
    expect(mockSearch).not.toBeCalled()

    userEvent.clear(input)

    const enoughQuery = chance.last().slice(0, 4)
    userEvent.type(input, enoughQuery)

    expect(loadingIcon).toHaveClass('MuiCircularProgress-indeterminate') // loading

    await waitForCalls(mockSearch)
    expect(mockSearch).toBeCalledWith(enoughQuery)

    expect(loadingIcon).toHaveClass('MuiCircularProgress-determinate') // paused
  })

  it('shows options matching search term', async () => {
    const lastName = 'Smith'
    mockSearch.mockResolvedValueOnce({
      trainers: [
        { id: chance.guid(), fullName: `John Mc${lastName}` },
        { id: chance.guid(), fullName: `Ivan ${lastName}ovich` },
        { id: chance.guid(), fullName: `Coen De${lastName}` },
        { id: chance.guid(), fullName: `Mary NotAMatch` },
      ],
    })

    render(<SearchTrainers />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, lastName.slice(0, 4))

    await waitForCalls(mockSearch)
    expect(screen.getAllByTestId('SearchTrainers-option')).toHaveLength(3)
  })

  it('calls matchesFilter to further filter options', async () => {
    const trainers = [
      { id: chance.guid(), fullName: chance.name() },
      { id: chance.guid(), fullName: chance.name() },
      { id: chance.guid(), fullName: chance.name() },
      { id: chance.guid(), fullName: chance.name() },
    ]

    mockSearch.mockResolvedValueOnce({ trainers })

    const matchesFilter = jest.fn().mockReturnValueOnce([trainers[2]])
    render(<SearchTrainers matchesFilter={matchesFilter} />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitForCalls(mockSearch)

    expect(matchesFilter).toHaveBeenCalledWith(trainers)

    expect(screen.getAllByTestId('SearchTrainers-option')).toHaveLength(1)
  })

  it('enforces max selected items when max is set', async () => {
    const lastName = 'Smith'
    mockSearch.mockResolvedValueOnce({
      trainers: [
        { id: chance.guid(), fullName: `John Mc${lastName}` },
        { id: chance.guid(), fullName: `Ivan ${lastName}ovich` },
        { id: chance.guid(), fullName: `Coen De${lastName}` },
        { id: chance.guid(), fullName: `Mary NotAMatch` },
      ],
    })

    render(<SearchTrainers max={1} />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, lastName.slice(0, 4))

    await waitForCalls(mockSearch)
    const matches = screen.getAllByTestId('SearchTrainers-option')
    expect(matches).toHaveLength(3)
    userEvent.click(matches[0])

    expect(input).toBeDisabled()
    expect(screen.getByPlaceholderText('(max allowed reached)')).toBe(input)
  })

  it('calls onChange when a trainer is selected', async () => {
    const trainers = [
      { id: chance.guid(), fullName: chance.name() },
      { id: chance.guid(), fullName: chance.name() },
      { id: chance.guid(), fullName: chance.name() },
      { id: chance.guid(), fullName: chance.name() },
    ]

    mockSearch.mockResolvedValueOnce({ trainers })

    const onChange = jest.fn()
    render(<SearchTrainers onChange={onChange} />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, trainers[2].fullName.slice(0, 4))

    await waitForCalls(mockSearch)
    const matches = screen.getAllByTestId('SearchTrainers-option')
    expect(matches).toHaveLength(1)
    userEvent.click(matches[0])

    expect(onChange).toBeCalledWith([trainers[2]])
  })

  it('shows info message when no matches are found', async () => {
    mockSearch.mockResolvedValueOnce({ trainers: [] })

    render(<SearchTrainers />)
    const input = screen.getByTestId('SearchTrainers-input')

    userEvent.type(input, chance.last().slice(0, 4))

    await waitForCalls(mockSearch)

    const noMatchTxt = 'No trainers found. Try another search term.'
    expect(screen.getByText(noMatchTxt)).toBeInTheDocument()
  })
})
