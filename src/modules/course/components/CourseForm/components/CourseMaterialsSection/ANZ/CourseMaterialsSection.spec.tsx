import { renderHook } from '@testing-library/react'

import {
  Course_Level_Enum,
  Course_Type_Enum,
  Currency,
  GetResourcePackPricingsQuery,
} from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { renderForm } from '@app/modules/course/components/CourseForm/test-utils'
import { useResourcePackPricing } from '@app/modules/resource_packs/hooks/useResourcePackPricing'
import { AwsRegions, RoleName } from '@app/types'

import { chance, screen, userEvent } from '@test/index'

import { CourseMaterialsSection } from './CourseMaterialsSection'

vi.mock('posthog-js/react', () => ({
  useFeatureFlagEnabled: vi.fn().mockReturnValue(false),
}))

vi.mock('@app/modules/course/hooks/useCoursePrice/useCoursePrice', () => ({
  useCoursePrice: vi.fn(),
}))

vi.mock('@app/modules/resource_packs/hooks/useResourcePackPricing')

const mockedHook = vi.mocked(useResourcePackPricing)
mockedHook.mockReturnValue({
  data: {
    anz_resource_packs_pricing: [
      { id: chance.guid(), currency: Currency.Aud, price: 52 },
    ],
  } as GetResourcePackPricingsQuery,
  error: undefined,
  fetching: false,
})

describe(`component: ${CourseMaterialsSection.name}`, () => {
  beforeAll(() => {
    vi.stubEnv('VITE_AWS_REGION', AwsRegions.Australia)
  })
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation('components.course-form.resource-packs'),
  )

  it('renders mandatory course materials component', () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.Level_1,
      role: RoleName.TT_ADMIN,
    })
    expect(screen.getByTestId('mandatory-course-materials')).toBeInTheDocument()
  })

  it('validates mandatory course materials is required', async () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.Level_1,
      role: RoleName.TT_ADMIN,
    })
    const mcm = screen.getByTestId('mandatory-course-materials')
    await userEvent.type(mcm, '1')
    await userEvent.clear(
      screen.getByLabelText('Resource Pack', { exact: false }),
    )
    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(screen.queryByText(t('errors.is-required'))).toBeInTheDocument()
  })

  it('validates mandatory course materials should be a positive number', async () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.Level_1,
      role: RoleName.TT_ADMIN,
    })
    expect(
      screen.getByLabelText('Resource Pack', { exact: false }),
    ).toBeInTheDocument()
    await userEvent.type(
      screen.getByLabelText('Resource Pack', { exact: false }),
      '-1',
    )
    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(screen.queryByText(t('errors.is-negative'))).toBeInTheDocument()
  })

  it('validates mandatory course materials should be less than max attendees', async () => {
    renderForm({
      type: Course_Type_Enum.Closed,
      certificateLevel: Course_Level_Enum.Level_1,
      role: RoleName.TT_ADMIN,
    })

    await userEvent.type(
      screen.getByLabelText('Resource Pack', { exact: false }),
      '6',
    )

    await userEvent.type(screen.getByTestId('max-attendees'), '5')
    expect(
      screen.queryByText(t('errors.more-fcm-than-attendees-create')),
    ).toBeInTheDocument()
  })
})
