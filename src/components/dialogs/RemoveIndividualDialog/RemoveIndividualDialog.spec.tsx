import { render, screen } from '@test/index'
import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { RemoveIndividualDialog } from './RemoveIndividualDialog'

describe(RemoveIndividualDialog.name, () => {
  it('should render component', () => {
    const mockParticipant = buildParticipant()
    const mockCourse = buildCourse()

    render(
      <RemoveIndividualDialog
        participant={mockParticipant}
        course={mockCourse}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )

    expect(true).toBeTruthy()
  })

  it('should render modal title correctly', () => {
    const mockParticipant = buildParticipant()
    const mockCourse = buildCourse()

    render(
      <RemoveIndividualDialog
        participant={mockParticipant}
        course={mockCourse}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )

    expect(
      screen.getByTestId('remove-individual-dialog-title')
    ).toHaveTextContent(
      `Cancel ${mockParticipant.profile.fullName} from ${mockCourse.course_code}?`
    )
  })
})
