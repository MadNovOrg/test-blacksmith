import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useTranslation } from 'react-i18next'
import { noop } from 'ts-essentials'

import {
  Accreditors_Enum,
  Course_Level_Enum,
  Course_Type_Enum,
  Grade_Enum,
} from '@app/generated/graphql'
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

describe('component: CourseLevelDropdown [UK]', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.UK)
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  it('renders correctly when type is OPEN', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={Course_Type_Enum.Open}
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
      getOption(t('common.course-levels.ADVANCED_TRAINER')),
    ).toBeInTheDocument()
    expect(
      getOption(t('common.course-levels.FOUNDATION_TRAINER_PLUS')),
    ).toBeInTheDocument()
  })

  it('renders correctly when type is CLOSED', async () => {
    useFeatureFlagEnabledMock.mockResolvedValue(true)

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

    expect(screen.queryAllByRole('option').length).toBe(7)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.ADVANCED'))).toBeInTheDocument()
    expect(
      getOption(t('common.course-levels.INTERMEDIATE_TRAINER')),
    ).toBeInTheDocument()
    expect(
      getOption(t('common.course-levels.ADVANCED_TRAINER')),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('course-level-option-LEVEL_1_BS'),
    ).toBeInTheDocument()
  })

  it('renders correctly when type is INDIRECT', async () => {
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

    expect(screen.queryAllByRole('option').length).toBe(4)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.ADVANCED'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_1_BS'))).toBeInTheDocument()
  })

  it("doesn't render Advanced modules if a trainer isn't Advanced Trainer or BILD Advanced trainer certified", async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={Course_Type_Enum.Indirect}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          certificates: [
            {
              expiryDate: new Date().toISOString(),
              courseLevel: Course_Level_Enum.IntermediateTrainer,
            },
          ],
          activeCertificates: [
            {
              level: Course_Level_Enum.IntermediateTrainer,
              grade: Grade_Enum.Pass,
            },
          ],
        },
      },
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(2)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(
      getOption(t('common.course-levels.ADVANCED'), true),
    ).not.toBeInTheDocument()
  })

  it('renders Advanced modules if a trainer has an Advanced trainer certificate', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={Course_Type_Enum.Indirect}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          activeCertificates: [
            {
              level: Course_Level_Enum.AdvancedTrainer,
              grade: Grade_Enum.Pass,
            },
          ],
        },
      },
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.ADVANCED'))).toBeInTheDocument()
  })

  it('renders Advanced modules if a trainer has a BILD Advanced trainer certificate', async () => {
    render(
      <CourseLevelDropdown
        value=""
        onChange={noop}
        courseType={Course_Type_Enum.Indirect}
        courseAccreditor={Accreditors_Enum.Icm}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
          activeCertificates: [
            {
              level: Course_Level_Enum.BildAdvancedTrainer,
              grade: Grade_Enum.Pass,
            },
          ],
        },
      },
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryAllByRole('option').length).toBe(3)

    expect(getOption(t('common.course-levels.LEVEL_1'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.LEVEL_2'))).toBeInTheDocument()
    expect(getOption(t('common.course-levels.ADVANCED'))).toBeInTheDocument()
  })
})
