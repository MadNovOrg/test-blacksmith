import { useScopedTranslation } from '@app/hooks/useScopedTranslation'

import { _render, renderHook, screen } from '@test/index'

import { CourseDiffTable } from '.'

describe(CourseDiffTable.name, () => {
  const {
    result: {
      current: { t, _t },
    },
  } = renderHook(() =>
    useScopedTranslation('pages.edit-course.review-changes-modal'),
  )
  const newValue = new Date()
  const oldValue = new Date()
  beforeEach(() => {
    _render(
      <CourseDiffTable
        diff={[
          {
            type: 'date',
            newValue: [newValue, newValue],
            oldValue: [oldValue, oldValue],
          },
        ]}
      />,
    )
  })
  it('should _render the component', () => {
    expect(screen.getByTestId('course-diff-table'))
  })
  it('should _render course head cells correclty, cell', () =>
    [t('col-property'), t('col-old-value'), t('col-new-value')].forEach(
      cell => {
        expect(screen.queryAllByText(cell)[0]).toBeInTheDocument()
      },
    ))
  it('shows dates correctly', () => {
    const formatedDate = `${_t('dates.longWithTime', {
      date: newValue,
    })} - ${_t('dates.longWithTime', { date: newValue })}`
    screen.queryAllByText(formatedDate).forEach(e => {
      expect(e).toBeInTheDocument()
    })
  })
})
