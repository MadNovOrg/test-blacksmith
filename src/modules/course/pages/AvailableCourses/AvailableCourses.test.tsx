import { useTranslation } from 'react-i18next'

import useUpcomingCourses from '@app/modules/admin/hooks/useUpcomingCourses'
import useOrgV2 from '@app/modules/organisation/hooks/UK/useOrgV2'
import { RoleName } from '@app/types'

import { _render, screen, act, renderHook, userEvent } from '@test/index'

import { AvailableCourses } from './AvailableCourses'

vi.mock('@app/modules/organisation/hooks/UK/useOrgV2')
vi.mock('@app/modules/admin/hooks/useUpcomingCourses')

describe('AvailableCourse', () => {
  describe('while loading', () => {
    beforeEach(() => {
      vi.mocked(useOrgV2, { partial: true }).mockReturnValue({
        fetching: true,
      })
      vi.mocked(useUpcomingCourses, { partial: true }).mockReturnValue({
        fetching: true,
      })
      _render(<AvailableCourses />, { auth: { activeRole: RoleName.TT_ADMIN } })
    })
    it('should handle the loading state', () => {
      expect(screen.getByTestId('courses-fetching')).toBeInTheDocument()
    })
  })
  describe('while loaded', () => {
    beforeEach(() => {
      vi.mocked(useOrgV2, { partial: true }).mockReturnValue({
        fetching: false,
      })
      vi.mocked(useUpcomingCourses, { partial: true }).mockReturnValue({
        fetching: false,
      })
      _render(<AvailableCourses />, { auth: { activeRole: RoleName.TT_ADMIN } })
    })
    it('should _render the AvailableCourses component', async () => {
      const { result } = renderHook(() => useTranslation())
      await act(async () => {
        expect(
          screen.getByText(result.current.t('pages.available-courses.title')),
        ).toBeInTheDocument()
      })
    })
    it('should _render the course level dropdown', async () => {
      const { result } = renderHook(() => useTranslation())
      const componentTitle = screen.getByText(
        result.current.t('pages.available-courses.title'),
      )
      expect(componentTitle).toBeInTheDocument()
    })
    it('should _render course delivery type dropdown', () => {
      const { result } = renderHook(() => useTranslation())
      expect(screen.getByText(result.current.t('delivery'))).toBeInTheDocument()
    })
    it('should handle no courses being found upon filtering', async () => {
      const { result } = renderHook(() => useTranslation())
      const courseLevelDropdown = screen.getByText(
        result.current.t('course-level'),
      )
      await userEvent.click(courseLevelDropdown)
      await userEvent.keyboard('{tab}{enter}')
      expect(
        screen.getByText(
          result.current.t('pages.available-courses.no-results'),
        ),
      ).toBeInTheDocument()
    })
  })
})
