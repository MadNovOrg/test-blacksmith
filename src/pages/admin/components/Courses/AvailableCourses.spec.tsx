import { useTranslation } from 'react-i18next'

import useUpcomingCourses from '@app/hooks/useUpcomingCourses'
import useOrgV2 from '@app/modules/organisation/hooks/useOrgV2'
import { AvailableCourses } from '@app/pages/admin/components/Courses/AvailableCourses'
import { RoleName } from '@app/types'

import { act, renderHook, userEvent } from '@test/index'
import { render, screen } from '@test/index'

vi.mock('@app/modules/organisation/hooks/useOrgV2')
vi.mock('@app/hooks/useUpcomingCourses')

vi.mocked(useOrgV2, { partial: true }).mockReturnValue({
  fetching: false,
})
vi.mocked(useUpcomingCourses, { partial: true })
  .mockReturnValueOnce({ loading: true })
  .mockReturnValue({ loading: false })

describe('AvailableCourse', () => {
  beforeEach(async () => {
    render(<AvailableCourses />, { auth: { activeRole: RoleName.TT_ADMIN } })
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
