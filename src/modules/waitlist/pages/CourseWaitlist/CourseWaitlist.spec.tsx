import { t } from 'i18next'
import { Route, Routes } from 'react-router-dom'
import { Client, Provider, TypedDocumentNode } from 'urql'
import { never, fromValue } from 'wonka'

import { Recaptcha } from '@app/components/Recaptcha'
import { createRecaptchaComp } from '@app/components/Recaptcha/test-utils'
import {
  Course,
  GetCourseResidingCountryQuery,
  JoinWaitlistMutation,
  JoinWaitlistMutationVariables,
  WaitlistCourseQuery,
  WaitlistCourseQueryVariables,
} from '@app/generated/graphql'
import {
  WAITLIST_COURSE,
  GET_COURSE_RESIDING_COUNTRY,
} from '@app/modules/waitlist/hooks'

import { render, screen, userEvent, waitFor } from '@test/index'
import { buildCourse } from '@test/mock-data-utils'

import { CourseWaitlist } from './CourseWaitlist'

const RecaptchaMock = createRecaptchaComp()

vi.mock('@app/components/Recaptcha', async () => ({
  __esModule: true,
  ...((await vi.importActual('@app/components/Recaptcha')) as object),
  Recaptcha: vi.fn(),
}))

const MockedRecaptcha = vi.mocked(Recaptcha)

describe(CourseWaitlist.name, () => {
  it('displays a skeleton while loading course details', () => {
    const client = {
      executeQuery: () => never,
    } as unknown as Client

    render(
      <Provider value={client}>
        <CourseWaitlist />
      </Provider>
    )

    expect(screen.getByTestId('course-info-skeleton')).toBeInTheDocument()
  })

  it("renders an alert if a course doesn't exist", () => {
    const client = {
      executeQuery: () =>
        fromValue<{ data: WaitlistCourseQuery }>({
          data: {
            courses: [],
          },
        }),
    } as unknown as Client

    render(
      <Provider value={client}>
        <CourseWaitlist />
      </Provider>
    )

    expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
      `"It seems like a course you're trying to join the waitlist for doesn't exist anymore."`
    )
  })

  it('displays course details', async () => {
    const course = buildCourse()
    const courseId = 10000

    const client = {
      executeQuery: ({
        variables,
        query,
      }: {
        variables: WaitlistCourseQueryVariables
        query: TypedDocumentNode
      }) => {
        if (query === WAITLIST_COURSE) {
          return fromValue<{ data: WaitlistCourseQuery }>({
            data: {
              courses:
                variables.id === courseId
                  ? ([course] as unknown as Course[])
                  : [],
            },
          })
        }
        if (query === GET_COURSE_RESIDING_COUNTRY) {
          return fromValue<{ data: GetCourseResidingCountryQuery }>({
            data: {
              course: [{ residingCountry: 'GB' }],
            },
          })
        }
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/waitlist" element={<CourseWaitlist />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/waitlist?course_id=${courseId}`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()
    const {
      schedule: [
        {
          start = '',
          venue: {
            name = '',
            addressLineOne = '',
            city = '',
            postCode = '',
            country = '',
          } = {},
        },
      ] = [],
    } = course
    const startEndTimes = `${t('dates.withTime', {
      date: start,
    })}`
    expect(screen.getAllByText(startEndTimes)).toHaveLength(2)
    expect(
      screen.getByText(
        `${name}, ${addressLineOne}, ${city}, ${postCode}, ${country}`
      )
    ).toBeInTheDocument()
    expect(screen.getByText(addressLineOne)).toBeInTheDocument()
    expect(screen.getByText(`${postCode}`)).toBeInTheDocument()
  })

  it('adds a user to the waitlist', async () => {
    const courseId = 10000

    MockedRecaptcha.mockImplementation(RecaptchaMock)

    const client = {
      executeQuery: ({
        variables,
        query,
      }: {
        variables: WaitlistCourseQueryVariables
        query: TypedDocumentNode
      }) => {
        if (query === WAITLIST_COURSE) {
          return fromValue<{ data: WaitlistCourseQuery }>({
            data: {
              courses:
                variables.id === courseId
                  ? ([buildCourse()] as unknown as Course[])
                  : [],
            },
          })
        }
        if (query === GET_COURSE_RESIDING_COUNTRY) {
          return fromValue<{ data: GetCourseResidingCountryQuery }>({
            data: {
              course: [{ residingCountry: 'GB' }],
            },
          })
        }
      },
      executeMutation: ({
        variables,
      }: {
        variables: JoinWaitlistMutationVariables
      }) => {
        const submittedVariables = variables.input
        const success = submittedVariables.courseId === courseId
        return fromValue<{ data: JoinWaitlistMutation }>({
          data: {
            joinWaitlist: {
              success,
            },
          },
        })
      },
    } as unknown as Client

    render(
      <Provider value={client}>
        <Routes>
          <Route path="/waitlist" element={<CourseWaitlist />} />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/waitlist?course_id=${courseId}`] }
    )

    await userEvent.type(screen.getByLabelText(/first name/i), 'John')
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe')
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'john.doe@example.com'
    )
    await userEvent.type(screen.getByLabelText(/phone/i), '7999 999999')
    await userEvent.type(screen.getByLabelText(/organisation name/i), 'Org')

    await userEvent.click(screen.getByText(/join waiting list/i))

    await userEvent.click(screen.getByTestId('recaptcha-success'))

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
        `"You’ve been added to the course waitlist."`
      )
    })
  })
})
