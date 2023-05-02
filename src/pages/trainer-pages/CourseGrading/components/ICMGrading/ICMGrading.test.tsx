import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Grade_Enum } from '@app/generated/graphql'
import { useFetcher } from '@app/hooks/use-fetcher'
import { MUTATION } from '@app/queries/grading/save-course-grading'
import { Grade } from '@app/types'

import { render, screen, within, userEvent, waitForText } from '@test/index'
import { buildCourseModule, buildParticipant } from '@test/mock-data-utils'

import { buildGradingCourse, selectGradingOption } from '../../test-utils'

import { ICMGrading } from '.'

jest.mock('@app/hooks/use-fetcher')

const useFetcherMock = jest.mocked(useFetcher)

describe('page: CourseGrading', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('displays course name, course participants who attended and covered course modules', () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path="/:id/grading" element={<ICMGrading course={course} />} />
      </Routes>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()

    const coveredModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(coveredModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      screen.queryByTestId(
        `module-group-${courseModules[1].module.moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    const attendedParticipant = courseParticipants[1]
    const notAttendedParticipant = courseParticipants[0]

    expect(
      screen.getByText(`${attendedParticipant.profile.fullName}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(`${notAttendedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('All attendees')).toBeInTheDocument()
  })

  it("doesn't display already graded participants", () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: true, grade: Grade_Enum.Pass },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path="/:id/grading" element={<ICMGrading course={course} />} />
      </Routes>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    expect(screen.getByText(course.name)).toBeInTheDocument()

    const coveredModuleGroup = screen.getByTestId(
      `module-group-${courseModules[0].module.moduleGroup.id}`
    )

    expect(
      within(coveredModuleGroup).getByLabelText(courseModules[0].module.name)
    ).toBeChecked()

    expect(
      screen.queryByTestId(
        `module-group-${courseModules[1].module.moduleGroup.id}`
      )
    ).not.toBeInTheDocument()

    const attendedParticipant = courseParticipants[1]
    const notAttendedParticipant = courseParticipants[0]

    expect(
      screen.getByText(`${attendedParticipant.profile.fullName}`)
    ).toBeInTheDocument()

    expect(
      screen.queryByText(`${notAttendedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('All attendees')).toBeInTheDocument()
  })

  it('displays selected participants from query param', () => {
    const COURSE_ID = 'course-id'
    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path="/:id/grading" element={<ICMGrading course={course} />} />
      </Routes>,
      {},
      {
        initialEntries: [
          `/${COURSE_ID}/grading?participants=${courseParticipants[0].id},${courseParticipants[1].id}`,
        ],
      }
    )

    const selectedParticipants = [courseParticipants[0], courseParticipants[1]]
    const notSelectedParticipant = courseParticipants[2]

    selectedParticipants.forEach(participant => {
      expect(
        screen.getByText(`${participant.profile.fullName}`)
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByText(`${notSelectedParticipant.profile.fullName}`)
    ).not.toBeInTheDocument()

    expect(screen.getByText('2 attendee(s)')).toBeInTheDocument()
  })

  it('displays confirmation modal when clicked on submit button', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path="/:id/grading" element={<ICMGrading course={course} />} />
      </Routes>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await selectGradingOption('Pass')

    await userEvent.click(screen.getByText('Submit final grade'))

    expect(screen.getByText('Grading confirmation')).toBeVisible()
    expect(screen.getByText('Cancel')).toBeVisible()
    expect(screen.getByText('Confirm')).toBeVisible()
  })

  it('closes modal when saving is not confirmed', async () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path="/:id/grading" element={<ICMGrading course={course} />} />
      </Routes>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await selectGradingOption('Pass')

    await userEvent.click(screen.getByText('Submit final grade'))

    await userEvent.click(screen.getByText('Cancel'))

    expect(screen.queryByText('Grading confirmation')).not.toBeVisible()
  })

  it("disables save button if a grading option isn't selected", () => {
    const COURSE_ID = 'course-id'

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path=":id/grading" element={<ICMGrading course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    expect(screen.getByText('Submit final grade')).toBeDisabled()
  })

  it('saves grades for participants when an intent for saving is confirmed', async () => {
    const COURSE_ID = 'course-id'
    const fetcherMock = jest.fn()

    useFetcherMock.mockReturnValue(fetcherMock)
    fetcherMock.mockResolvedValue({
      saveModules: { affectedRows: 2 },
      saveParticipantsGrade: { affectedRows: 2 },
    })

    const courseModules = [
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: true },
      { ...buildCourseModule(), covered: false },
    ]
    const courseParticipants = [
      { ...buildParticipant(), attended: false },
      { ...buildParticipant(), attended: true },
    ]

    const course = buildGradingCourse({
      overrides: {
        modules: courseModules,
        participants: courseParticipants,
      },
    })

    render(
      <Routes>
        <Route path=":id/grading" element={<ICMGrading course={course} />} />
        <Route path="/courses/:id/details" element={<h1>Course details</h1>} />
      </Routes>,
      {},
      { initialEntries: [`/${COURSE_ID}/grading`] }
    )

    await userEvent.type(
      screen.getByPlaceholderText('Any notes attendee(s) (optional)'),
      'Feedback'
    )

    await userEvent.click(screen.getByLabelText(courseModules[0].module.name))

    await selectGradingOption('Non-Physical Pass')

    await userEvent.click(screen.getByText('Submit final grade'))
    await userEvent.click(screen.getByText('Confirm'))

    expect(fetcherMock).toHaveBeenCalledTimes(1)
    expect(fetcherMock).toHaveBeenCalledWith(MUTATION, {
      modules: [
        {
          course_participant_id: courseParticipants[1].id,
          module_id: courseModules[0].module.id,
          completed: false,
        },
        {
          course_participant_id: courseParticipants[1].id,
          module_id: courseModules[1].module.id,
          completed: true,
        },
      ],
      participantIds: [courseParticipants[1].id],
      grade: Grade.OBSERVE_ONLY,
      feedback: 'Feedback',
      courseId: course.id,
    })

    await waitForText('Course details')
  })
})
