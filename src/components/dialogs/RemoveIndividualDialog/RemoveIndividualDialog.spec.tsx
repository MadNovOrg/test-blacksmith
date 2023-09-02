import { render } from '@test/index'
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
})
