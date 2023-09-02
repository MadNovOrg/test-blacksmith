import { useTranslation } from 'react-i18next'

import { screen, render, renderHook, userEvent } from '@test/index'

import { CourseExceptionsLog } from '.'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('page: CourseExceptionsLog', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())
  beforeEach(() => render(<CourseExceptionsLog />))
  it('should render the page', () => {
    expect(screen.getByTestId('course-exceptions-log')).toBeInTheDocument()
  })
  it('should render the back button and the header', () => {
    expect(
      screen.getByText(t('pages.admin.back-to-settings'))
    ).toBeInTheDocument()
    expect(
      screen.getByText(t('pages.admin.course-exceptions-log.title'))
    ).toBeInTheDocument()
  })
  it('should go back to settings', async () => {
    // Arrange
    const backToSettingsButton = screen.getByText(
      t('pages.admin.back-to-settings')
    )
    // Act
    await userEvent.click(backToSettingsButton)
    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith(-1, { replace: false })
  })
})
