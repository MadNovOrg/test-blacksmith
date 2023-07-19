import Table from '@mui/material/Table'
import { useTranslation } from 'react-i18next'

import { screen, render, renderHook } from '@test/index'
import { buildLogs } from '@test/mock-data-utils'

import { TableBody } from '.'

const logsMock = [buildLogs()]

describe('component: TableBody', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  const setup = async (loading = false, logs = logsMock) =>
    render(
      <Table>
        <TableBody colSpan={7} loading={loading} logs={logs} />
      </Table>
    )

  it('should render the component', () => {
    setup()
    expect(
      screen.getByTestId('course-exceptions-log-table-body')
    ).toBeInTheDocument()
  })
  it('should render logs', () => {
    setup()
    logsMock.map(log =>
      expect(
        screen.getByText(log.authorizedBy.fullName as string)
      ).toBeInTheDocument()
    )
  })
  it('should render the loading spinner if in loading state', () => {
    setup(true)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
  it('should render the no records message if no logs were found', () => {
    setup(false, [])
    expect(
      screen.getByText(
        t(`components.table-no-rows.noRecords-first`, {
          itemsName: t('components.table-no-rows.itemsName'),
        })
      )
    ).toBeInTheDocument()
  })
  it('should render valid anchor elements', () => {
    // Arrange
    const courseDetails = logsMock.map(log => ({
      name: log.course.course_code as string,
      id: log.course.id,
    }))
    // Act
    setup()
    courseDetails.map(course => {
      // Assert
      expect(
        screen.getByRole('link', { name: course.name })
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: course.name })).toHaveAttribute(
        'href',
        `/courses/${course.id}/details`
      )
    })
  })

  it.each(logsMock)('has valid links', log => {
    // Act
    setup()
    // Assert
    expect(
      screen.getByRole('link', { name: log.course.course_code as string })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: log.course.course_code as string })
    ).toHaveAttribute('href', `/courses/${log.course.id}/details`)

    expect(
      screen.getByRole('link', {
        name: log.course.organization?.name as string,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: log.course.organization?.name as string,
      })
    ).toHaveAttribute('href', `/organisations/${log.course.organization?.id}`)
  })
})
