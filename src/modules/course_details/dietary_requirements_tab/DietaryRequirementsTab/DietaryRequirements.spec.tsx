import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { GetCourseParticipantDietOrDisabilitiesDataQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'

import { _render, renderHook, screen } from '@test/index'
import { buildProfile, buildCourse } from '@test/mock-data-utils'

import { DietaryRequirementsTab } from './DietaryRequirements'

const course = buildCourse()
const profile = buildProfile({
  overrides: {
    dietaryRestrictions: 'Lactose intolerant',
    disabilities: 'Broken heart',
  },
})
const client = {
  executeMutation: () => never,
  executeQuery: () =>
    fromValue<{
      data: GetCourseParticipantDietOrDisabilitiesDataQuery
    }>({
      data: {
        dietaryRestrictions: [{ profile }],
        disabilities: [],
        trainerDietaryRestrictions: [],
        trainerDisabilities: [],
      },
    }),
} as unknown as Client

describe(DietaryRequirementsTab.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation('pages.course-details.tabs.dietary-requirements'),
  )
  beforeEach(() => {
    _render(
      <Routes>
        <Route
          path="/courses/:id/details"
          element={
            <Provider value={client}>
              <DietaryRequirementsTab courseId={course.id} />
            </Provider>
          }
        />
        <Route path="/organisations/:id" element={<></>} />
      </Routes>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/${course.id}/details`] },
    )
  })
  it('renders DietaryRequirementsTab component', () => {
    expect(screen.getByText(t('title'))).toBeInTheDocument()
  })
  it.each([t('name'), t('email'), t('organisation'), t('dietary-requirement')])(
    'renders column %s',
    column => {
      expect(screen.queryByText(column)).toBeInTheDocument()
    },
  )
  it.each([profile.fullName, profile.email, profile.dietaryRestrictions])(
    'correctly renders the course participant dietary data',
    profileInfo => {
      expect(screen.queryByText(profileInfo as string)).toBeInTheDocument()
    },
  )
  it('sets the href on the organization link correctly', async () => {
    expect(
      screen.getByTestId('dietary-requirements-organization'),
    ).toHaveAttribute(
      'href',
      `/organisations/${profile.organizations[0].organization.id}`,
    )
  })
})
