import { Route, Routes } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { fromValue, never } from 'wonka'

import { GetCourseParticipantDietOrDisabilitiesDataQuery } from '@app/generated/graphql'
import { useScopedTranslation } from '@app/hooks/useScopedTranslation'
import { RoleName } from '@app/types'

import { render, renderHook, screen } from '@test/index'
import { buildProfile, buildCourse } from '@test/mock-data-utils'

import { DisabilitiesTab } from './DisabilitiesTab'

DisabilitiesTab
const course = buildCourse()
const profile = buildProfile({
  overrides: {
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
        disabilities: [{ profile }],
        dietaryRestrictions: [],
        trainerDietaryRestrictions: [],
        trainerDisabilities: [],
      },
    }),
} as unknown as Client

describe(DisabilitiesTab.name, () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() =>
    useScopedTranslation('pages.course-details.tabs.disabilities')
  )
  beforeEach(() => {
    render(
      <Routes>
        <Route
          path="/courses/:id/details"
          element={
            <Provider value={client}>
              <DisabilitiesTab courseId={course.id} />
            </Provider>
          }
        />
        <Route path="/organisations/:id" element={<></>} />
      </Routes>,
      { auth: { activeRole: RoleName.TT_ADMIN } },
      { initialEntries: [`/courses/${course.id}/details`] }
    )
  })
  it('renders DisabilitiesTab component', () => {
    expect(screen.getAllByText(t('title'))[0]).toBeInTheDocument()
  })
  it.each([t('name'), t('email'), t('organisation')])(
    'renders column %s',
    column => {
      expect(screen.queryByText(column)).toBeInTheDocument()
    }
  )
  it.each([profile.fullName, profile.email, profile.disabilities])(
    'correctly renders the course participant disabilities data %s',
    profileInfo => {
      expect(screen.queryByText(profileInfo as string)).toBeInTheDocument()
    }
  )
  it('sets the href on the organization link correctly', async () => {
    expect(
      screen.getByTestId('dietary-requirements-organization')
    ).toHaveAttribute(
      'href',
      `/organisations/${profile.organizations[0].organization.id}`
    )
  })
})
