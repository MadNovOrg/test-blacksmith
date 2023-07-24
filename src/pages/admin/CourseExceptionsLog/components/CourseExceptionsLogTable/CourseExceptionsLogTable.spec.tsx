import { useTranslation } from 'react-i18next'

import { Course_Audit_Type_Enum } from '@app/generated/graphql'

import { render, renderHook, screen } from '@test/index'

import { TabsValues } from '../CourseExceptionsLogTabs'

import { CourseExceptionsLogTable } from '.'

describe(CourseExceptionsLogTable.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const setup = (
    loading?: boolean,
    activeTab: TabsValues = Course_Audit_Type_Enum.Approved
  ) =>
    render(
      <CourseExceptionsLogTable
        loading={loading ?? false}
        logs={[]}
        sorting={{ by: 'created_at', dir: 'desc', onSort: () => null }}
        activeTab={activeTab}
      />
    )
  it('should render the component', () => {
    // Act
    setup()

    // Assert
    expect(
      screen.getByTestId('course-exceptions-log-table')
    ).toBeInTheDocument()
  })
  it('should render all the required table columns for the approved tab', () => {
    // Arrange
    const cols = Object.values(
      t('pages.admin.course-exceptions-log.table-cols', {
        returnObjects: true,
      })
    )
    // Act
    setup()
    //Assert
    cols
      .filter(
        col => col !== t('pages.admin.course-exceptions-log.table-cols.reason')
      )
      .map(col => expect(screen.getByText(col)).toBeInTheDocument())
  })
  it('should render all the required table columns for the rejected tab', () => {
    // Arrange
    const cols = Object.values(
      t('pages.admin.course-exceptions-log.table-cols', {
        returnObjects: true,
      })
    )
    // Act
    setup(false, Course_Audit_Type_Enum.Rejected)
    //Assert
    cols
      .filter(
        col => col !== t('pages.admin.course-exceptions-log.table-cols.notes')
      )
      .map(col => expect(screen.getByText(col)).toBeInTheDocument())
  })
})
