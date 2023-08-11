import { addDays, addWeeks } from 'date-fns'

import { Course_Level_Enum } from '@app/generated/graphql'

import { screen, within, render } from '@test/index'

import { ReschedulingTermsTable } from '.'

describe('component: ReschedulingTermsTable', () => {
  ;(
    [
      Course_Level_Enum.Level_1,
      Course_Level_Enum.Level_2,
      Course_Level_Enum.Advanced,
    ] as const
  ).forEach(level => {
    it(`displays correct rows for ${level}`, () => {
      render(<ReschedulingTermsTable startDate={new Date()} level={level} />)

      const free = screen.getByTestId('fee-row-0-fee')
      const fiftheen = screen.getByTestId('fee-row-15-fee')
      const twentyfive = screen.getByTestId('fee-row-25-fee')

      expect(within(free).getByText('4+ weeks')).toBeInTheDocument()
      expect(within(free).getByText('Free')).toBeInTheDocument()

      expect(within(fiftheen).getByText('2-4 weeks')).toBeInTheDocument()
      expect(
        within(fiftheen).getByText('15% of payment due')
      ).toBeInTheDocument()

      expect(
        within(twentyfive).getByText('Less than 2 weeks')
      ).toBeInTheDocument()
      expect(
        within(twentyfive).getByText('25% of payment due')
      ).toBeInTheDocument()
    })

    it(`marks fee as free if start date is more than 4 weeks ahaid for ${level}`, () => {
      render(
        <ReschedulingTermsTable
          startDate={addWeeks(new Date(), 5)}
          level={level}
        />
      )

      const free = screen.getByTestId('fee-row-0-fee')

      expect(free).toHaveAttribute('data-highlighted', 'true')
    })

    it(`marks fee as 2-4 weeks if start date is within 2-4 weeks range for ${level}`, () => {
      render(
        <ReschedulingTermsTable
          startDate={addWeeks(new Date(), 3)}
          level={level}
        />
      )

      const fiftheen = screen.getByTestId('fee-row-15-fee')

      expect(fiftheen).toHaveAttribute('data-highlighted', 'true')
    })

    it(`marks fee as less then two weeks if start date is less then 2 weeks ahaid for ${level}`, () => {
      render(
        <ReschedulingTermsTable
          startDate={addWeeks(new Date(), 1)}
          level={level}
        />
      )

      const twentyfive = screen.getByTestId('fee-row-25-fee')

      expect(twentyfive).toHaveAttribute('data-highlighted', 'true')
    })
  })
  ;(
    [
      Course_Level_Enum.IntermediateTrainer,
      Course_Level_Enum.AdvancedTrainer,
    ] as const
  ).forEach(trainerLevel => {
    it(`displays correct rows for ${trainerLevel} course level`, async () => {
      render(
        <ReschedulingTermsTable startDate={new Date()} level={trainerLevel} />
      )

      const free = screen.getByTestId('fee-row-0-fee-trainer')
      const twentyfive = screen.getByTestId('fee-row-25-fee-trainer')
      const fifty = screen.getByTestId('fee-row-50-fee-trainer')

      expect(within(free).getByText('4+ weeks')).toBeInTheDocument()
      expect(within(free).getByText('Free')).toBeInTheDocument()

      expect(within(twentyfive).getByText('1-4 weeks')).toBeInTheDocument()
      expect(
        within(twentyfive).getByText('25% of payment due')
      ).toBeInTheDocument()

      expect(within(fifty).getByText('0-1 week')).toBeInTheDocument()
      expect(within(fifty).getByText('50% of payment due')).toBeInTheDocument()
    })

    it(`marks fee as free if start is more then 4 weeks ahaid for ${trainerLevel}`, () => {
      render(
        <ReschedulingTermsTable
          startDate={addWeeks(new Date(), 5)}
          level={trainerLevel}
        />
      )

      const free = screen.getByTestId('fee-row-0-fee-trainer')

      expect(free).toHaveAttribute('data-highlighted', 'true')
    })

    it(`marks 25% fee if start date is 1-4 weeks range for ${trainerLevel}`, () => {
      render(
        <ReschedulingTermsTable
          startDate={addWeeks(new Date(), 3)}
          level={trainerLevel}
        />
      )

      const free = screen.getByTestId('fee-row-25-fee-trainer')

      expect(free).toHaveAttribute('data-highlighted', 'true')
    })

    it(`marks 50% fee if start date is 0-1 weeks range for ${trainerLevel}`, () => {
      render(
        <ReschedulingTermsTable
          startDate={addDays(new Date(), 4)}
          level={trainerLevel}
        />
      )

      const free = screen.getByTestId('fee-row-50-fee-trainer')

      expect(free).toHaveAttribute('data-highlighted', 'true')
    })
  })
})
