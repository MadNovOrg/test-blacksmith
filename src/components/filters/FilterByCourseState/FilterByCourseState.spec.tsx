import { _render, screen, userEvent } from '@test/index'

import { FilterByCourseState } from './index'

describe(FilterByCourseState.name, () => {
  it('triggers onChange when a course state is selected', async () => {
    const onChange = vi.fn()
    _render(<FilterByCourseState onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: /In Progress/i }))
    expect(onChange).toHaveBeenCalledWith(['IN_PROGRESS'])
  })

  it('supports multiple selected course states', async () => {
    const onChange = vi.fn()
    _render(<FilterByCourseState onChange={onChange} />)

    await userEvent.click(screen.getByRole('button', { name: /In Progress/i }))
    expect(onChange).toHaveBeenCalledWith(['IN_PROGRESS'])

    await userEvent.click(screen.getByRole('button', { name: /Scheduled/i }))
    expect(onChange).toHaveBeenCalledWith(['IN_PROGRESS', 'SCHEDULED'])

    await userEvent.click(screen.getByRole('button', { name: /In Progress/i }))
    expect(onChange).toHaveBeenCalledWith(['SCHEDULED'])
  })
})
