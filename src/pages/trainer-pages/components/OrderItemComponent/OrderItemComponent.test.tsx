import { Route, Routes } from 'react-router-dom'

import { Course_Type_Enum } from '@app/generated/graphql'
import useCourse from '@app/hooks/useCourse'
import { Course } from '@app/types'
import { LoadingStatus } from '@app/util'

import { render, screen } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseDetails } from '../../CourseDetails'

vi.mock('@app/hooks/useCourse')

const useCourseMocked = vi.mocked(useCourse)

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
            order: {
              ...testProps,
            },
          },
        ],
        ...overrides,
      },
    })

    useCourseMocked.mockReturnValue({
      mutate: vi.fn(),
      data: { course },
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
      type: Course_Type_Enum.Closed,
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
      type: Course_Type_Enum.Indirect,
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
      type: Course_Type_Enum.Open,
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
