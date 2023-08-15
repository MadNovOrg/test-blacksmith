import { Route, Routes } from 'react-router-dom'

import useCourse from '@app/hooks/useCourse'
import { Course, CourseType, RoleName } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseDetails } from '.'

jest.mock('@app/hooks/useCourse')

const useCourseMocked = jest.mocked(useCourse)

describe('page: CourseDetails', () => {
  it('should render CourseHeroSummary component', () => {
    // Arrange
    const course = buildCourse()

    useCourseMocked.mockReturnValue({
      mutate: jest.fn(),
      data: course,
      status: LoadingStatus.SUCCESS,
    })

    // Act
    render(
      <Routes>
        <Route path="/course/:id/details" element={<CourseDetails />} />
      </Routes>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/course/${course.id}/details`] }
    )

    // Assert
    expect(screen.getByTestId('course-hero-summary')).toBeInTheDocument()
  })

  describe('OrderItem', () => {
    const testProps = {
      id: 'b2715e60-752c-41f5-b38e-b2984f8f02a3',
      xeroInvoiceNumber: 'TT-123456',
    }

    const setup = (overrides: Partial<Course>) => {
      // Arrange
      const course = buildCourse({
        overrides: {
          orders: [
            {
              ...testProps,
            },
          ],
          ...overrides,
        },
      })

      useCourseMocked.mockReturnValue({
        mutate: jest.fn(),
        data: course,
        status: LoadingStatus.SUCCESS,
      })

      // Act
      render(
        <Routes>
          <Route path="/course/:id/details" element={<CourseDetails />} />
        </Routes>,
        {},
        { initialEntries: [`/course/${course.id}/details`] }
      )
    }

    it('should render order item when it has an order and is of CLOSED type', () => {
      setup({
        type: CourseType.CLOSED,
        go1Integration: false,
      })

      const orderItem = screen.getByTestId('order-item')
      const orderItemLink = screen.getByTestId('order-item-link')

      // Assert
      expect(orderItem).toBeInTheDocument()
      expect(orderItem).toHaveTextContent('Order:')
      expect(orderItemLink).toHaveTextContent(testProps.xeroInvoiceNumber)
      expect(orderItemLink).toHaveAttribute('href', `/orders/${testProps.id}`)
    })

    it('should render order item when it has an order and is of INDIRECT type with blended learning', () => {
      setup({
        type: CourseType.INDIRECT,
        go1Integration: true,
      })

      const orderItem = screen.getByTestId('order-item')
      const orderItemLink = screen.getByTestId('order-item-link')

      // Assert
      expect(orderItem).toBeInTheDocument()
      expect(orderItem).toHaveTextContent('Order:')
      expect(orderItemLink).toHaveTextContent(testProps.xeroInvoiceNumber)
      expect(orderItemLink).toHaveAttribute('href', `/orders/${testProps.id}`)
    })

    it('should not render order item when it has an order and is of OPEN type', () => {
      setup({
        type: CourseType.OPEN,
        go1Integration: false,
      })

      // Assert
      expect(screen.queryByTestId('order-item')).toBeNull()
    })

    it('should not render order item when it does not have a linked order', () => {
      setup({
        orders: [],
      })

      // Assert
      expect(screen.queryByTestId('order-item')).toBeNull()
    })
  })
})
