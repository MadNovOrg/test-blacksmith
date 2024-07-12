import React from 'react'

import { render, screen, fireEvent, waitFor, within } from '@test/index'

import { SmileyFaceRating } from './SmileyFaceRating'

describe('SmileyFaceRating', () => {
  it('renders five rating options from best to worst', async () => {
    render(<SmileyFaceRating value={''} onChange={vi.fn()} />)

    const container = screen.getByTestId('smiley-faces-container')
    expect(container).toBeInTheDocument()

    const icons = within(container).queryAllByTestId('rating')
    expect(icons).toHaveLength(5)
    expect(container.children[0]).toHaveClass('rating-5')
    expect(container.children[1]).toHaveClass('rating-4')
    expect(container.children[2]).toHaveClass('rating-3')
    expect(container.children[3]).toHaveClass('rating-2')
    expect(container.children[4]).toHaveClass('rating-1')
  })

  it('calls onChange with rating value when an icon is clicked', async () => {
    const onChange = vi.fn()
    render(<SmileyFaceRating value={''} onChange={onChange} />)
    const icon = screen.queryAllByTestId('rating')[0]
    fireEvent.click(icon)
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(5)
    })
  })

  it('does not call onChange when an icon is hovered', async () => {
    const onChange = vi.fn()
    render(<SmileyFaceRating value={''} onChange={onChange} />)
    const icon = screen.queryAllByTestId('rating')[0]
    fireEvent.mouseEnter(icon)
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  it('sets selected icon to active', async () => {
    const onChange = vi.fn()
    render(<SmileyFaceRating value={'5'} onChange={onChange} />)
    const icon = screen.queryAllByTestId('rating')[0]
    expect(icon).toHaveClass('active')
  })

  it('sets icon to active when it is hovered', async () => {
    const onChange = vi.fn()
    render(<SmileyFaceRating value={'5'} onChange={onChange} />)
    const icons = screen.queryAllByTestId('rating')
    const firstIcon = icons[0]
    const secondIcon = icons[1]
    expect(firstIcon).toHaveClass('active')
    expect(secondIcon).not.toHaveClass('active')
    fireEvent.mouseEnter(secondIcon)
    await waitFor(() => {
      expect(firstIcon).not.toHaveClass('active')
      expect(secondIcon).toHaveClass('active')
    })
  })

  it('adds readOnly class when readOnly is true', async () => {
    const onChange = vi.fn()
    render(<SmileyFaceRating value={''} onChange={onChange} readOnly={true} />)
    const icon = screen.queryAllByTestId('rating')[0]
    expect(icon).toHaveClass('readOnly')
  })
})
