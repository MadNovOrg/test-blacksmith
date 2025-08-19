import { render, screen, userEvent, waitFor } from '@test/index'

import { FilterByCourseLevel } from './index'

describe(FilterByCourseLevel.name, () => {
  it('triggers onChange when course level = Advanced Trainer is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByCourseLevel onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByText('Course Level')).toBeVisible()
    })

    await userEvent.click(screen.getByText('Course Level'))
    await userEvent.click(screen.getByText('Advanced Trainer'))

    expect(onChange).toHaveBeenCalledWith(['ADVANCED_TRAINER'])
  })
})
