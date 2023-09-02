import { render, screen, userEvent } from '@test/index'

import { FilterByCourseStatus } from './index'

describe(FilterByCourseStatus.name, () => {
  it('triggers onChange when course status = grade missing is selected', async () => {
    const onChange = vi.fn()
    render(<FilterByCourseStatus onChange={onChange} />)

    await userEvent.click(screen.getByText('Course Status'))
    await userEvent.click(screen.getByText('Missing grade'))

    expect(onChange).toHaveBeenCalledWith(['GRADE_MISSING'])
  })
})
