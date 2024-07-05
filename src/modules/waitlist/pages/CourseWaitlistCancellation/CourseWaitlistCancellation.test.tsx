import { Routes, Route } from 'react-router-dom'
import { Client, CombinedError, Provider } from 'urql'
import { never, fromValue } from 'wonka'

import {
  CancelMyselfFromCourseWaitlistError,
  CancelMyselfFromCourseWaitlistMutation,
} from '@app/generated/graphql'

import { render, screen, chance, waitFor } from '@test/index'

import { CourseWaitlistCancellation } from './CourseWaitlistCancellation'

const { CancellationSecretInvalid, CourseNotFound } =
  CancelMyselfFromCourseWaitlistError

describe(`page: ${CourseWaitlistCancellation.name}`, () => {
  it('should display a circular progress when loading', () => {
    // Arrange
    const courseId = 10000
    const cancellationSecret = chance.guid({ version: 4 })
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    // Act
    render(
      <Provider value={client}>
        <Routes>
          <Route
            path={`/waitlist-cancellation`}
            element={<CourseWaitlistCancellation />}
          />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/waitlist-cancellation?course_id=${courseId}&s=${cancellationSecret}`,
        ],
      },
    )

    // Assert
    expect(
      screen.getByTestId('course-waitlist-cancellation-loading'),
    ).toBeInTheDocument()
  })

  it('should display a warning when url is malformed', () => {
    // Arrange
    const client = {
      executeMutation: () => never,
    } as unknown as Client

    // Act
    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/waitlist-cancellation"
            element={<CourseWaitlistCancellation />}
          />
        </Routes>
      </Provider>,
      {},
      { initialEntries: [`/waitlist-cancellation`] },
    )

    // Assert
    expect(
      screen.getByText(
        /The required query parameters are missing or malformed/i,
      ),
    ).toBeInTheDocument()
  })

  it('should display a warning when something unexpected happens', async () => {
    // Arrange
    const courseId = 10000
    const cancellationSecret = chance.guid({ version: 4 })

    const client = {
      executeMutation: () =>
        fromValue<{ error: CombinedError }>({
          error: new CombinedError({
            networkError: Error('something went wrong!'),
          }),
        }),
    } as unknown as Client

    // Act
    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/waitlist-cancellation"
            element={<CourseWaitlistCancellation />}
          />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/waitlist-cancellation?course_id=${courseId}&s=${cancellationSecret}`,
        ],
      },
    )

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred. Please try again./i),
      ).toBeInTheDocument()
    })
  })

  it('should display a warning when course is not found', async () => {
    // Arrange
    const courseId = 10000
    const cancellationSecret = chance.guid({ version: 4 })

    const client = {
      executeMutation: () =>
        fromValue<{ data: CancelMyselfFromCourseWaitlistMutation }>({
          data: {
            cancelMyselfFromCourseWaitlist: {
              success: false,
              error: CourseNotFound,
            },
          },
        }),
    } as unknown as Client

    // Act
    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/waitlist-cancellation"
            element={<CourseWaitlistCancellation />}
          />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/waitlist-cancellation?course_id=${courseId}&s=${cancellationSecret}`,
        ],
      },
    )

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(
          /This course is no longer available. You were removed from the waiting list./i,
        ),
      ).toBeInTheDocument()
    })
    expect(true).toBeTruthy()
  })

  it('should display a warning when cancellation secret is invalid', async () => {
    // Arrange
    const courseId = 10000
    const cancellationSecret = chance.guid({ version: 4 })

    const client = {
      executeMutation: () =>
        fromValue<{ data: CancelMyselfFromCourseWaitlistMutation }>({
          data: {
            cancelMyselfFromCourseWaitlist: {
              success: false,
              error: CancellationSecretInvalid,
            },
          },
        }),
    } as unknown as Client

    // Act
    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/waitlist-cancellation"
            element={<CourseWaitlistCancellation />}
          />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/waitlist-cancellation?course_id=${courseId}&s=${cancellationSecret}`,
        ],
      },
    )

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(/You are not part of this course’s waiting list./i),
      ).toBeInTheDocument()
    })
    expect(true).toBeTruthy()
  })

  it('should display a success message when the user was removed from waitlist', async () => {
    const courseId = 10000
    const cancellationSecret = chance.guid({ version: 4 })

    const client = {
      executeMutation: () =>
        fromValue<{ data: CancelMyselfFromCourseWaitlistMutation }>({
          data: {
            cancelMyselfFromCourseWaitlist: {
              success: true,
            },
          },
        }),
    } as unknown as Client
    // Act
    render(
      <Provider value={client}>
        <Routes>
          <Route
            path="/waitlist-cancellation"
            element={<CourseWaitlistCancellation />}
          />
        </Routes>
      </Provider>,
      {},
      {
        initialEntries: [
          `/waitlist-cancellation?course_id=${courseId}&s=${cancellationSecret}`,
        ],
      },
    )

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText(/You’ve been removed from the course waiting list./i),
      ).toBeInTheDocument()
    })
  })
})
