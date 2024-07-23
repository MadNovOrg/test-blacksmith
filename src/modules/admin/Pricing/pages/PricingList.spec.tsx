import {
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
} from '@app/generated/graphql'
import { useCoursePricing } from '@app/modules/admin/Pricing/hooks'

import { chance, render, screen } from '@test/index'

import { PricingList } from './PricingList'

vi.mock('@app/modules/admin/Pricing/hooks/useCoursePricing')

const useCoursePricingMock = vi.mocked(useCoursePricing)

describe(PricingList.name, () => {
  const setup = () => {
    useCoursePricingMock.mockReturnValue({
      coursePricing: [
        {
          id: chance.guid(),
          priceAmount: 100,
          priceCurrency: Currency.Gbp,
          level: Course_Level_Enum.Level_1,
          type: Course_Type_Enum.Open,
          blended: true,
          reaccreditation: true,
          xeroCode: 'LEVEL1.OP',
          pricingSchedules: [],
          pricingSchedules_aggregate: {
            aggregate: {
              count: 0,
            },
            nodes: [],
          },
        },
      ],
      total: 1,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    })
    render(<PricingList />)
  }

  it('renders the component', () => {
    setup()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByCourseLevel')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByCourseType')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByBlendedLearning')).toBeInTheDocument()
    expect(screen.getByTestId('FilterByReaccreditation')).toBeInTheDocument()
  })
})
