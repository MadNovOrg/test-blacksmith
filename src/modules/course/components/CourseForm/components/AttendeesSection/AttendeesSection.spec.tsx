import { Course_Type_Enum } from '@app/generated/graphql'
import { AwsRegions } from '@app/types'

import { screen, userEvent } from '@test/index'

import { renderForm } from '../../test-utils'

import { AttendeesSection } from './AttendeesSection'

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

describe(`component: ${AttendeesSection.name}`, () => {
  it.each(Object.values(AwsRegions))(
    'validates that min participants is smaller than max participants %s',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Open })

      await userEvent.type(
        screen.getByLabelText('Minimum', { exact: false }),
        '6',
      )
      await userEvent.type(
        screen.getByLabelText('Maximum', { exact: false }),
        '5',
      )

      expect(
        screen.getByText(
          'Minimum number of attendees must be less than the maximum number of attendees',
        ),
      ).toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'validates that minimum participants has to be positive number %s',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Open })

      await userEvent.type(
        screen.getByLabelText('Minimum', { exact: false }),
        '0',
      )

      expect(
        await screen.findByText(
          'Minimum number of attendees must be a positive number',
        ),
      ).toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'does not _render minimum participants for closed course type %s',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Closed })

      expect(
        screen.queryByLabelText('Minimum', { exact: false }),
      ).not.toBeInTheDocument()
    },
  )

  it.each(Object.values(AwsRegions))(
    'does not _render minimum participants for indirect course type %s',
    async appRegion => {
      vi.stubEnv('VITE_AWS_REGION', appRegion)
      renderForm({ type: Course_Type_Enum.Indirect })

      expect(
        screen.queryByLabelText('Minimum', { exact: false }),
      ).not.toBeInTheDocument()
    },
  )
})
