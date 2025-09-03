import { useTranslation } from 'react-i18next'

import { Course_Audit_Type_Enum } from '@app/generated/graphql'

import { render, renderHook, screen } from '@test/index'

import { CourseExceptionsLogTable } from '.'

describe(CourseExceptionsLogTable.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const setup = (loading?: boolean) =>
    render(
      <CourseExceptionsLogTable
        loading={loading ?? false}
        logs={[]}
        sorting={{ by: 'created_at', dir: 'desc', onSort: () => null }}
        activeTab={Course_Audit_Type_Enum.Approved}
      />,
    )
  it('should render the component', () => {
    // Act
    setup()

    // Assert
    expect(
      screen.getByTestId('course-exceptions-log-table'),
    ).toBeInTheDocument()
  })
  it('should render all the required table columns', () => {
    // Arrange
    const cols = Object.values(
      t('pages.admin.course-exceptions-log.table-cols', {
        returnObjects: true,
      }),
    )
    // Act
    setup()
    //Assert
    cols
      .filter(
        col =>
          ![
            t('pages.admin.course-exceptions-log.table-cols.reason'),
            t('pages.admin.course-exceptions-log.table-cols.rejection-reason'),
          ].includes(col),
      )

      .forEach(col => expect(screen.getByText(col)).toBeInTheDocument())
  })
})
