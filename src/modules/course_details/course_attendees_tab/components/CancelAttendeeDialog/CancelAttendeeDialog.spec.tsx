import { Course_Type_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { _render, screen } from '@test/index'
import { buildCourse, buildParticipant } from '@test/mock-data-utils'

import { CancelAttendeeDialog } from './CancelAttendeeDialog'

describe(CancelAttendeeDialog.name, () => {
  it('should _render component', () => {
    const mockParticipant = buildParticipant()
    const mockCourse = buildCourse()

    _render(
      <CancelAttendeeDialog
        participant={mockParticipant}
        course={mockCourse}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    )

    expect(true).toBeTruthy()
  })

  it.each([RoleName.TT_ADMIN, RoleName.TT_OPS, RoleName.SALES_ADMIN])(
    'should allow selecting custom fee for cancellation for %s role',
    role => {
      const mockParticipant = buildParticipant()
      const mockCourse = buildCourse({
        overrides: {
          type: Course_Type_Enum.Open,
        },
      })

      _render(
        <CancelAttendeeDialog
          participant={mockParticipant}
          course={mockCourse}
          onClose={vi.fn()}
          onSave={vi.fn()}
        />,
        {
          auth: {
            activeRole: role,
          },
        },
      )

      const customFeeRadio = screen.getByTestId('CUSTOM_FEE-radioButton')
      const noFeeRadio = screen.getByTestId('NO_FEES-radioButton')

      expect(customFeeRadio).toBeEnabled()
      expect(noFeeRadio).toBeEnabled()
    },
  )
})
