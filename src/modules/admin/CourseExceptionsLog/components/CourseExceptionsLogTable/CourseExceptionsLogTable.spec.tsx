import { useTranslation } from 'react-i18next'

import { useAuth } from '@app/context/auth'
import { Course_Audit_Type_Enum } from '@app/generated/graphql'

import { _render, renderHook, screen } from '@test/index'

import { CourseExceptionsLogTable } from '.'

vi.mock('@app/context/auth')

const mockedUseAuth = vi.mocked(useAuth)

describe(CourseExceptionsLogTable.name, () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      acl: { isUK: () => true },
    } as unknown as ReturnType<typeof useAuth>)
  })

  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const setup = (loading?: boolean) =>
    _render(
      <CourseExceptionsLogTable
        loading={loading ?? false}
        logs={[]}
        sorting={{ by: 'created_at', dir: 'desc', onSort: () => null }}
        activeTab={Course_Audit_Type_Enum.Approved}
      />,
    )
  it('should _render the component', () => {
    // Act
    setup()

    // Assert
    expect(
      screen.getByTestId('course-exceptions-log-table'),
    ).toBeInTheDocument()
  })
  it('should _render all the required table columns', () => {
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
