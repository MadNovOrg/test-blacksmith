import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Client, Provider } from 'urql'
import { never } from 'wonka'

import { Course_Type_Enum } from '@app/generated/graphql'
import { useCourseDraft } from '@app/hooks/useCourseDraft'
import { RoleName } from '@app/types'

import { render, within, screen } from '@test/index'

import { StepsEnum } from './types'

import { CreateCourse } from '.'

vi.mock('@app/hooks/useCourseDraft')
const useCourseDraftMocked = vi.mocked(useCourseDraft)

function createFetchingClient() {
  return {
    executeQuery: () => never,
  } as unknown as Client
}

describe('page: CreateCourse', () => {
  beforeAll(() => {
    useCourseDraftMocked.mockReturnValue({
      id: 'random-id',
      data: {},
      error: {
        name: 'errorName',
        message: 'errorMessage',
      },
      fetching: false,
    })
  })

  it("doesn't mark any step as done if on course details page", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route index element={<h1>Create course form page</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new`] }
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).getByText('1')).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it("doesn't mark course details page as done if on assign trainers page but course details page wasn't marked as complete", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new/assign-trainers`] }
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(within(attendanceNavItem).queryByTestId('CheckIcon')).toBeNull()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('marks course details page as done if on assign trainers page and details page was marked as complete', () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route
            path="/courses/new"
            element={
              <CreateCourse
                initialContextValue={{
                  completedSteps: [StepsEnum.COURSE_DETAILS],
                }}
              />
            }
          >
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new/assign-trainers`] }
    )

    const subnav = screen.getByTestId('create-course-nav')
    const attendanceNavItem = within(subnav).getByTestId('step-item-1')
    const modulesNavItem = within(subnav).getByTestId('step-item-2')

    expect(
      within(attendanceNavItem).getByTestId('CheckIcon')
    ).toBeInTheDocument()
    expect(within(modulesNavItem).getByText('2')).toBeInTheDocument()
  })

  it('renders correct title when creating open course', () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Open}`] }
    )

    expect(screen.getByText('Open course creation')).toBeInTheDocument()
  })

  it('renders correct title when creating closed course', () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Closed}`] }
    )

    expect(screen.getByText('Closed course creation')).toBeInTheDocument()
  })

  it('renders correct title when creating indirect course', () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Indirect}`] }
    )

    expect(screen.getByText('Course creation')).toBeInTheDocument()
  })

  it('displays correct steps for the indirect course', () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Indirect}`] }
    )

    const nav = screen.getByTestId('create-course-nav')

    expect(within(nav).queryByText('Assign trainer(s)')).toBeInTheDocument()
  })

  it('displays correct steps for the indirect course with TT-OPS', () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Indirect}`] }
    )

    const nav = screen.getByTestId('create-course-nav')

    expect(within(nav).queryByText('Assign trainer(s)')).toBeInTheDocument()
  })

  it("doesn't allow trainer to create open course", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Open}`] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to create open course", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Open}`] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow trainer to create closed course", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Closed}`] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to create closed course", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Closed}`] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow sales admin role to create indirect course", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.SALES_ADMIN,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Indirect}`] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it("doesn't allow attendee user to create indirect course", () => {
    render(
      <Provider value={createFetchingClient()}>
        <Routes>
          <Route path="/courses/new" element={<CreateCourse />}>
            <Route path="assign-trainers" element={<h1>Assign trainers</h1>} />
          </Route>
        </Routes>
      </Provider>,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      },
      { initialEntries: [`/courses/new?type=${Course_Type_Enum.Indirect}`] }
    )

    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})
