import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import { Accreditors_Enum, Course_Type_Enum } from '@app/generated/graphql'
import { AwsRegions, RoleName } from '@app/types'

import { render, renderHook, screen, userEvent, within } from '@test/index'

import { CourseLevelDropdown } from './index'
vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn(),
}))
const useFeatureFlagEnabledMock = vi.mocked(useFeatureFlagEnabled)

const getOption = (level: string | RegExp, query = false) => {
  const dropdown = screen.getByRole('listbox')

  if (query) {
    return within(dropdown).queryByText(level)
  }

  return within(dropdown).getByText(level)
}

describe('component: CourseLevelDropdown [ANZ]', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('renders correctly when type is CLOSED', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={Course_Type_Enum.Closed}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(5)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(
      getOption(t('common.course-levels.INTERMEDIATE_TRAINER')),
    ).toBeInTheDocument()
    expect(
      getOption(t('common.course-levels.FOUNDATION_TRAINER_PLUS')),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('course-level-option-LEVEL_1_BS'),
    ).toBeInTheDocument()
  })

  it('renders correctly when type is INDIRECT', async () => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={Course_Type_Enum.Indirect}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      { auth: { activeRole: RoleName.TT_ADMIN } },
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_1_BS'))).toBeInTheDocument()
  })
})
