import { Course_Level_Enum } from '@app/generated/graphql'
import { calculateGo1LicenseCost } from '@app/modules/course/pages/CreateCourse/utils'
import { AwsRegions } from '@app/types'

import { render, screen } from '@test/index'

import { OrderDetails } from '.'

describe('component: OrderDetails', () => {
  process.env.VITE_AWS_REGION = AwsRegions.UK

  const mockCourseData = {
    blendedLearning: true,
    courseLevel: Course_Level_Enum.Level_1,
    resourcePacksType: undefined,
  }

  it('calculates correctly if there is a full license allowance', () => {
    const costs = calculateGo1LicenseCost({
      numberOfLicenses: 2,
      licenseBalance: 4,
    })

    render(
      <OrderDetails
        courseData={mockCourseData}
        go1LicensesCost={costs}
        numberOfLicenses={2}
      />,
    )

    expect(screen.queryByText(/license allowance/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('amount-allowance')).not.toBeInTheDocument()
    expect(screen.queryByTestId('amount-subtotal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('amount-vat')).not.toBeInTheDocument()

    expect(screen.getByTestId('amount-due')).toHaveTextContent('£0.00')
  })

  it('calculates correctly if there is a partial license allowance', () => {
    const costs = calculateGo1LicenseCost({
      numberOfLicenses: 2,
      licenseBalance: 1,
    })

    render(
      <OrderDetails
        courseData={mockCourseData}
        go1LicensesCost={costs}
        numberOfLicenses={2}
      />,
    )

    expect(screen.getByTestId('amount-allowance')).toHaveTextContent('-£50.00')
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£100.00')
    expect(screen.getByTestId('amount-vat')).toHaveTextContent('£10.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£60.00')
  })

  it('calculates correctly if there is no license allowance', () => {
    const costs = calculateGo1LicenseCost({
      numberOfLicenses: 2,
      licenseBalance: 0,
    })
    render(
      <OrderDetails
        courseData={mockCourseData}
        go1LicensesCost={costs}
        numberOfLicenses={2}
      />,
    )

    expect(screen.queryByTestId('amount-allowance')).not.toBeInTheDocument()
    expect(screen.getByTestId('amount-subtotal')).toHaveTextContent('£100.00')
    expect(screen.getByTestId('amount-vat')).toHaveTextContent('£20.00')
    expect(screen.getByTestId('amount-due')).toHaveTextContent('£120.00')
  })
})
