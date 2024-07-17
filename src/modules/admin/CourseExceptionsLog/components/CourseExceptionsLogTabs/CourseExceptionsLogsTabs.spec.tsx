import { Course_Audit_Type_Enum } from '@app/generated/graphql'
import useCourseAuditLogs from '@app/modules/admin/Audits/hooks/useCourseAuditLogs'

import { screen, render, userEvent } from '@test/index'
import { buildLogs } from '@test/mock-data-utils'

import { CourseExceptionsLogTabs } from '.'

const logsMock = [buildLogs()]
vi.mock('@app/modules/admin/Audits/hooks/useCourseAuditLogs')
const useCourseAuditLogsMock = vi.mocked(useCourseAuditLogs)

describe('component: CourseExceptionsLogsTabs', () => {
  useCourseAuditLogsMock.mockReturnValue({
    logs: logsMock,
    error: undefined,
    loading: false,
    count: logsMock.length,
    getUnpagedLogs: () => Promise.resolve(logsMock),
  })
  beforeEach(() => {
    render(<CourseExceptionsLogTabs />)
  })
  it('should render the component', () => {
    expect(screen.getByTestId('course-exceptions-log-tabs')).toBeInTheDocument()
  })
  it(`should display ${Course_Audit_Type_Enum.Approved} and ${Course_Audit_Type_Enum.Rejected} tabs`, () => {
    expect(screen.getAllByRole('tab')[0]).toHaveTextContent(
      Course_Audit_Type_Enum.Approved.charAt(0).toUpperCase() +
        Course_Audit_Type_Enum.Approved.slice(1).toLowerCase(),
    )
    expect(screen.getAllByRole('tab')[1]).toHaveTextContent(
      Course_Audit_Type_Enum.Rejected.charAt(0).toUpperCase() +
        Course_Audit_Type_Enum.Rejected.slice(1).toLowerCase(),
    )
  })
  it('should set the active tab', async () => {
    const approveTab = screen.getAllByRole('tab')[0]
    const rejectTab = screen.getAllByRole('tab')[1]
    await userEvent.click(approveTab)
    expect(approveTab).toHaveAttribute('aria-selected', 'true')
    expect(rejectTab).toHaveAttribute('aria-selected', 'false')
  })
})
