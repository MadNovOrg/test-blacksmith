import { describe, it, expect } from 'vitest'

import { TableCourse } from '@app/modules/trainer_courses/utils'

import { _render } from '@test/index'

import { VenueCell } from './VenueCell'

describe('VenueCell', () => {
  it('renders venue name and city when venue ID is present', () => {
    const course = {
      id: '1',
      schedule: [
        {
          venue: {
            id: 'v1',
            name: 'Conference Center',
            city: 'New York',
          },
        },
      ],
    }
    const { getByText } = _render(
      <VenueCell course={course as unknown as TableCourse} />,
    )

    const venueName = getByText('Conference Center')
    const venueCity = getByText('New York')

    expect(venueName).toBeInTheDocument()
    expect(venueCity).toBeInTheDocument()
  })

  it('displays "Online" when no venue ID is present', () => {
    const course = {
      id: '1',
      schedule: [
        {
          venue: {
            id: null,
            name: '',
            city: '',
          },
        },
      ],
    }
    const { getByTestId } = _render(
      <VenueCell course={course as unknown as TableCourse} />,
    )

    const venueName = getByTestId('venue-name')

    expect(venueName.textContent).toBe('Online')
  })
})
