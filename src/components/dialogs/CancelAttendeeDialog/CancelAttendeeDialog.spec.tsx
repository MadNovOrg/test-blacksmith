import { render } from '@test/index'
import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { CancelAttendeeDialog } from './CancelAttendeeDialog'

describe(CancelAttendeeDialog.name, () => {
  it('should render component', () => {
    const mockParticipant = buildParticipant()
    const mockCourse = buildCourse()

    render(
      <CancelAttendeeDialog
        participant={mockParticipant}
        course={mockCourse}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )

    expect(true).toBeTruthy()
  })
})
