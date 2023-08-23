import { useTranslation } from 'react-i18next'

import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import { RoleName } from '@app/types'

import { act, renderHook, userEvent, waitFor } from '@test/index'
import { render, screen } from '@test/index'

const mockUseOrgs = { loading: false }

jest.mock('@app/hooks/useOrg', () => jest.fn(() => mockUseOrgs))
jest.mock('@app/hooks/useUpcomingCourses', () =>
  jest
    .fn()
    .mockReturnValue({
      loading: false,
    })
    .mockReturnValueOnce({
      loading: true,
    })
)

describe('AvailableCourse', () => {
  beforeEach(async () => {
    await waitFor(() =>
      render(<AvailableCourses />, { auth: { activeRole: RoleName.TT_ADMIN } })
    )
  })
  it('should handle the loading state', () => {
    expect(screen.getByTestId('courses-fetching')).toBeInTheDocument()
  })
  it('should render the AvailableCourses component', async () => {
    const { result } = renderHook(() => useTranslation())
    await act(async () => {
      expect(
        screen.getByText(result.current.t('pages.available-courses.title'))
      ).toBeInTheDocument()
    })
  })
  it('should render the course level dropdown', async () => {
    const { result } = renderHook(() => useTranslation())
    const componentTitle = screen.getByText(
      result.current.t('pages.available-courses.title')
    )
    expect(componentTitle).toBeInTheDocument()
  })
  it('should render course delivery type dropdown', () => {
    const { result } = renderHook(() => useTranslation())
    expect(screen.getByText(result.current.t('delivery'))).toBeInTheDocument()
  })
  it('should handle no courses being found upon filtering', async () => {
    const { result } = renderHook(() => useTranslation())
    const courseLevelDropdown = screen.getByText(
      result.current.t('course-level')
    )
    await userEvent.click(courseLevelDropdown)
    await userEvent.keyboard('{tab}{enter}')
    expect(
      screen.getByText(result.current.t('pages.available-courses.no-results'))
    ).toBeInTheDocument()
  })
})
