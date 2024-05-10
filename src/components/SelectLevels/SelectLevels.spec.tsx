import { t } from 'i18next'
import '@app/i18n/config'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { ComponentProps } from 'react'

import { Course_Level_Enum } from '@app/generated/graphql'

import { fireEvent, render, screen } from '@test/index'

import { SelectLevels } from './SelectLevels'

vi.mock('posthog-js/react')
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)
const onChangeMock = vi.fn()

const setup = (props: Partial<ComponentProps<typeof SelectLevels>> = {}) => {
  render(<SelectLevels value={[]} onChange={onChangeMock} {...props} />)
}

describe(SelectLevels.name, () => {
  afterEach(() => {
    useFeatureFlagEnabledMock.mockClear()
  })
  it('should display all levels if MVA feature flag is enabled', () => {
    const allLevels = Object.values(Course_Level_Enum).map(level =>
      t(`course-levels.${level}`)
    )
    useFeatureFlagEnabledMock.mockReturnValueOnce(true)
    setup()

    fireEvent.click(screen.getByRole('button'))

    allLevels.forEach(level => {
      expect(screen.getByText(level)).toBeInTheDocument()
    })
  })

  it('should not display Level 1 MVA if MVA feature flag is disabled', () => {
    const levels = Object.values(Course_Level_Enum)
      .filter(level => level !== Course_Level_Enum.Level_1Bs)
      .map(level => t(`course-levels.${level}`))
    useFeatureFlagEnabledMock.mockReturnValue(false)
    setup()

    fireEvent.click(screen.getByRole('button'))

    levels.forEach(level => {
      expect(screen.getByText(level)).toBeInTheDocument()
    })

    expect(
      screen.queryByText(t(`course-levels.${Course_Level_Enum.Level_1Bs}`))
    ).not.toBeInTheDocument()
  })
})
