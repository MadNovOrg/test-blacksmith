import { addDays, addWeeks } from 'date-fns'

import { Course_Level_Enum } from '@app/generated/graphql'

import { render, screen, within } from '@test/index'

import { TransferTermsTable } from '.'

describe('component: TransferTermsTable', () => {
  ;[
    Course_Level_Enum.Level_1,
    Course_Level_Enum.Level_2,
    Course_Level_Enum.Advanced,
  ].forEach(level => {
    it(`renders correct terms for ${level} course`, () => {
      render(<TransferTermsTable startDate={new Date()} courseLevel={level} />)

      const zeroFee = screen.getByTestId('term-row-0-fee')
      const fifteenFee = screen.getByTestId(`term-row-15-fee`)
      const twentyfiveFee = screen.getByTestId('term-row-25-fee')

      expect(within(zeroFee).getByText(/4\+ weeks/i)).toBeInTheDocument()
      expect(within(zeroFee).getByText(/no transfer fee/i)).toBeInTheDocument()

      expect(within(fifteenFee).getByText(/2-4 weeks/i)).toBeInTheDocument()
      expect(
        within(fifteenFee).getByText(/15% of payment due/i)
      ).toBeInTheDocument()

      expect(within(twentyfiveFee).getByText(/0-2 weeks/i)).toBeInTheDocument()
      expect(
        within(twentyfiveFee).getByText(/25% of payment due/i)
      ).toBeInTheDocument()
    })
  })
  ;[
    Course_Level_Enum.IntermediateTrainer,
    Course_Level_Enum.AdvancedTrainer,
  ].forEach(level => {
    it(`renders correct terms for ${level} course`, () => {
      render(<TransferTermsTable startDate={new Date()} courseLevel={level} />)

      const zeroFee = screen.getByTestId('term-row-0-fee-trainer')
      const twentyfiveFee = screen.getByTestId(`term-row-25-fee-trainer`)
      const fiftyFee = screen.getByTestId('term-row-50-fee-trainer')

      expect(within(zeroFee).getByText(/4\+ weeks/i)).toBeInTheDocument()
      expect(within(zeroFee).getByText(/no transfer fee/i)).toBeInTheDocument()

      expect(within(twentyfiveFee).getByText(/1-4 weeks/i)).toBeInTheDocument()
      expect(
        within(twentyfiveFee).getByText(/25% of payment due/i)
      ).toBeInTheDocument()

      expect(within(fiftyFee).getByText(/0-1 week/i)).toBeInTheDocument()
      expect(
        within(fiftyFee).getByText(/50% of payment due/i)
      ).toBeInTheDocument()
    })
  })

  it('highlights fees as free if course is starting more then 4 weeks from now', () => {
    render(
      <TransferTermsTable
        courseLevel={Course_Level_Enum.Level_1}
        startDate={addWeeks(new Date(), 5)}
      />
    )

    expect(screen.getByTestId('term-row-0-fee')).toHaveAttribute(
      'data-highlighted',
      'true'
    )
  })

  it('highlights 15% of payment due if a course start date is between 2-4 weeks', () => {
    render(
      <TransferTermsTable
        courseLevel={Course_Level_Enum.Level_1}
        startDate={addWeeks(new Date(), 4)}
      />
    )

    expect(screen.getByTestId('term-row-15-fee')).toHaveAttribute(
      'data-highlighted',
      'true'
    )
  })

  it('highlights 25% of payment due if a course start date is less then 2 weeks from now', () => {
    render(
      <TransferTermsTable
        courseLevel={Course_Level_Enum.Level_1}
        startDate={addWeeks(new Date(), 1)}
      />
    )

    expect(screen.getByTestId('term-row-25-fee')).toHaveAttribute(
      'data-highlighted',
      'true'
    )
  })

  it('highlights 25% of payment due if a course start date is between 1-4 weeks from now for train the trainer course level', () => {
    render(
      <TransferTermsTable
        courseLevel={Course_Level_Enum.IntermediateTrainer}
        startDate={addWeeks(new Date(), 4)}
      />
    )

    expect(screen.getByTestId('term-row-25-fee-trainer')).toHaveAttribute(
      'data-highlighted',
      'true'
    )
  })

  it('highlights 50% of payment due if a course start date is less then a week from now for train the trainer course level', () => {
    render(
      <TransferTermsTable
        courseLevel={Course_Level_Enum.IntermediateTrainer}
        startDate={addDays(new Date(), 6)}
      />
    )

    expect(screen.getByTestId('term-row-50-fee-trainer')).toHaveAttribute(
      'data-highlighted',
      'true'
    )
  })
})
