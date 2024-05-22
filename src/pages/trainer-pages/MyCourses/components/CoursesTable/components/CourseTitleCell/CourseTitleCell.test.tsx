import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useAuth } from '@app/context/auth'
import { Course_Invite_Status_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { TableCourse } from '../../types'

import { CourseTitleCell } from './CourseTitleCell'

// Mock useAuth hook
vi.mock('@app/context/auth', () => ({
  useAuth: vi.fn(),
}))

const mockUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>

describe('CourseTitleCell', () => {
  const course = {
    id: '1',
    course_code: 'C123',
    name: 'Test Course',
    isDraft: false,
    trainers: [
      { profile: { id: '1' }, status: Course_Invite_Status_Enum.Pending },
    ],
    modulesAgg: { aggregate: { count: 0 } },
    bildModules: [],
    curriculum: [],
    arloReferenceId: 'AR123',
  }

  const mockAuthContext = {
    profile: { id: '1' },
    acl: {
      canBuildCourse: vi.fn(() => true),
      isInternalUser: vi.fn(() => true),
    },
    activeRole: RoleName.TRAINER,
  }

  beforeEach(() => {
    mockUseAuth.mockReturnValue(mockAuthContext)
  })

  it('renders the course title without link if the course trainer status is pending', () => {
    const { getByTestId } = render(
      <CourseTitleCell course={course as unknown as TableCourse} />
    )
    const courseNameCell = getByTestId('course-name-cell')
    expect(courseNameCell.querySelector('a')).not.toBeInTheDocument()
    expect(courseNameCell.textContent).toContain('Test Course')
  })

  it('renders the Arlo reference ID for internal users', () => {
    const { getByTestId } = render(
      <CourseTitleCell course={course as unknown as TableCourse} />
    )
    const arloReference = getByTestId('arlo-reference-id')
    expect(arloReference).toBeInTheDocument()
    expect(arloReference.textContent).toContain('AR123')
  })

  it('does not render the Arlo reference ID for non-internal users', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContext,
      acl: { ...mockAuthContext.acl, isInternalUser: vi.fn(() => false) },
    })
    const { queryByTestId } = render(
      <CourseTitleCell course={course as unknown as TableCourse} />
    )
    const arloReference = queryByTestId('arlo-reference-id')
    expect(arloReference).toBeNull()
  })
})
