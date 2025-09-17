import {
  Course_Type_Enum,
  GetAttendeeAuditLogsQuery,
} from '@app/generated/graphql'

import { _render, screen, waitFor } from '@test/index'

import useAttendeeAuditLogs from '../hooks/useAttendeeAuditLogs'

import { AttendeeCancellationTable } from './AttendeeCancellationTable'
import { AttendeeReplacementTable } from './AttendeeReplacementTable'
import { AttendeeTransferTable } from './AttendeeTransferTable'

const resolveDelayed = <T,>(value: T) =>
  new Promise<T>(resolve => setTimeout(() => resolve(value), 1000))

vi.mock('@app/modules/admin/Audits/hooks/useAttendeeAuditLogs')

const useAttendeeAuditLogsMock = vi.mocked(useAttendeeAuditLogs)

const exampleLogs: GetAttendeeAuditLogsQuery['logs'] = [
  {
    id: '1',
    created_at: '2021-01-01T00:00:00Z',
    authorizedBy: {
      id: '1',
    },
    course: {
      id: 1337,
      course_code: 'COURSE_CODE',
      type: Course_Type_Enum.Open,
      orders: [
        {
          order: {
            id: 'id',
            xeroInvoiceNumber: 'XERO_INVOICE_NUMBER',
          },
        },
      ],
    },
    xero_invoice_number: 'XERO_INVOICE_NUMBER',
    payload: {
      cancellation_reason: 'REASON',
    },
    updated_at: '2021-01-01T00:00:00Z',
    profile: {
      id: '1',
      fullName: 'FULL_NAME',
      email: 'EMAIL',
      organizations: [
        {
          organization: {
            id: '1',
            name: 'ORG_NAME',
          },
        },
      ],
    },
  },
]

// TODO: Add file download test using playwright after merging TTHP-3752
describe('Attendee Audit Logs', () => {
  describe(AttendeeCancellationTable.name, () => {
    it('should _render the table', async () => {
      // Arrange
      useAttendeeAuditLogsMock.mockReturnValue({
        logs: exampleLogs,
        count: 1,
        loading: false,
        getUnpagedLogs: () => resolveDelayed(exampleLogs),
      })

      // Act
      _render(<AttendeeCancellationTable />)

      // Assert
      expect(screen.getAllByRole('row')).toHaveLength(2)
      expect(
        screen.getByRole('cell', { name: 'XERO_INVOICE_NUMBER' }),
      ).toBeInTheDocument()
    })

    it('should not error when exporting a historic log with no invoice attached', async () => {
      const logs: GetAttendeeAuditLogsQuery['logs'] = [
        ...exampleLogs,
        {
          ...exampleLogs[0],
          xero_invoice_number: null,
          course: {
            ...exampleLogs[0].course,
            orders: [],
          },
        },
      ]

      useAttendeeAuditLogsMock.mockReturnValue({
        logs,
        count: 1,
        loading: false,
        getUnpagedLogs: () => resolveDelayed(logs),
      })

      _render(<AttendeeCancellationTable />)

      // Act
      const exportButton = screen.getByTestId('export-audits-button')
      exportButton.click()

      // Assert
      waitFor(() => {
        expect(screen.getByTestId('export-audits-button')).toBeDisabled()
      })
      waitFor(() => {
        expect(screen.getByTestId('export-audits-button')).toBeEnabled()
      })
      // No errors
    })
  })

  describe(AttendeeTransferTable.name, () => {
    const transferLogs: GetAttendeeAuditLogsQuery['logs'] = [
      {
        id: '29a1c63d-3822-4d26-a966-d825fd027f2e',
        created_at: '2024-04-02T13:22:02.0892+00:00',
        updated_at: '2024-04-02T13:22:02.0892+00:00',
        xero_invoice_number: 'TT-0022580',
        authorizedBy: {
          id: '22015a3e-8907-4333-8811-85f782265a63',
          avatar: '',
          fullName: 'Benjamin Admin',
          archived: false,
          __typename: 'profile',
        },
        profile: {
          id: '48c9c19b-e7bf-4309-9679-52d5619d27dd',
          avatar: '',
          fullName: 'Lucas Ops',
          email: 'ops@teamteach.testinator.com',
          archived: false,
          organizations: [
            {
              organization: {
                id: 'a24397aa-b059-46b9-a728-955580823ce4',
                name: 'Team Teach',
                __typename: 'organization',
              },
              __typename: 'organization_member',
            },
          ],
          __typename: 'profile',
        },
        course: {
          id: 14432,
          course_code: 'L1.F.OP-14432',
          type: Course_Type_Enum.Open,
          orders: [
            {
              order: {
                id: '7bfb9c99-2884-48a0-ac2b-3fff4451d364',
                xeroInvoiceNumber: 'TT-0022580',
                __typename: 'order',
              },
              __typename: 'course_order',
            },
          ],
          __typename: 'course',
        },
        fromCourse: [
          { id: 14432, course_code: 'L1.F.OP-14432', __typename: 'course' },
        ],
        toCourse: [
          { id: 14434, course_code: 'L1.F.OP-14434', __typename: 'course' },
        ],
        payload: {
          type: 'FREE',
          orgId: '952b5762-40cd-48a5-afec-2f66581b5573',
          toCourse: { id: 14434, courseCode: 'L1.F.OP-14434' },
          fromCourse: { id: 14432, courseCode: 'L1.F.OP-14432' },
          transfer_reason: 'test',
        },
        newAttendeeEmail: null,
        __typename: 'course_participant_audit',
      },
    ]
    it('should _render the table', async () => {
      // Arrange
      useAttendeeAuditLogsMock.mockReturnValue({
        logs: transferLogs,
        count: 1,
        loading: false,
        getUnpagedLogs: () => resolveDelayed(transferLogs),
      })

      // Act
      _render(<AttendeeTransferTable />)

      // Assert
      expect(screen.getAllByRole('row')).toHaveLength(2)
      expect(
        screen.getByRole('cell', { name: 'TT-0022580' }),
      ).toBeInTheDocument()
    })
  })

  describe(AttendeeReplacementTable.name, () => {
    it('should _render the table', async () => {
      // Arrange
      useAttendeeAuditLogsMock.mockReturnValue({
        logs: exampleLogs,
        count: 1,
        loading: false,
        getUnpagedLogs: () => resolveDelayed(exampleLogs),
      })

      // Act
      _render(<AttendeeReplacementTable />)

      // Assert
      expect(screen.getAllByRole('row')).toHaveLength(2)
      expect(
        screen.getByRole('cell', { name: 'XERO_INVOICE_NUMBER' }),
      ).toBeInTheDocument()
    })
  })
})
