import { add, sub } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Course_Delivery_Type_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, renderHook, screen } from '@test/index'
import {
  buildCourse,
  buildCourseSchedule,
  buildCourseTrainer,
  buildProfile,
  buildOrganization,
} from '@test/mock-data-utils'

import { CourseHeroSummary } from './CourseHeroSummary'

describe('component: CourseHeroSummary', () => {
  const {
    result: {
      current: { t },
    },
  } = renderHook(() => useTranslation())

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('displays basic course information', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(screen.getByText(course.name)).toBeInTheDocument()
    expect(screen.getByText(course.course_code)).toBeInTheDocument()
  })

  it('displays a correct message if a course has began', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: sub(new Date(), { days: 2 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(
      screen.getByText(t('pages.course-participants.course-began')),
    ).toBeInTheDocument()
  })

  it('displays a correct message if a course begins today', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { minutes: 5 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(
      screen.getByText(t('pages.course-participants.course-begins-today')),
    ).toBeInTheDocument()
  })

  it('displays a correct message if a course begins in 1 day', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { days: 1 }).toISOString(),
        end: add(new Date(), { days: 1 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />)

    expect(
      screen.getByText(
        t('pages.course-participants.until-course-begins_days_one'),
      ),
    ).toBeInTheDocument()
  })

  it('displays a correct message if a course begins in 2 days', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: add(new Date(), { days: 2 }).toISOString(),
        end: add(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(
      screen.getByText(
        t('pages.course-participants.until-course-begins_days_other', {
          count: 2,
        }),
      ),
    ).toBeInTheDocument()
  })

  it('displays a correct message if a course has ended', () => {
    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: sub(new Date(), { days: 3 }).toISOString(),
        end: sub(new Date(), { days: 2 }).toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(
      screen.getByText(t('pages.course-participants.course-ended')),
    ).toBeInTheDocument()
  })

  it('displays correct course dates', () => {
    const courseStarts = new Date('2022-05-12T06:30:00')
    const courseEnds = new Date('2022-05-15T07:30:00')

    const courseSchedule = buildCourseSchedule({
      overrides: {
        start: courseStarts.toISOString(),
        end: courseEnds.toISOString(),
      },
    })
    const course = buildCourse({
      overrides: { schedule: [courseSchedule] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: {
        activeRole: RoleName.TT_ADMIN,
      },
    })

    expect(
      screen.getByText('12 May 2022, 06:30 AM (GMT+01:00) Europe/London'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('15 May 2022, 07:30 AM (GMT+01:00) Europe/London'),
    ).toBeInTheDocument()
  })

  it('displays correct trainer info if a logged in user is not a trainer', () => {
    const LOGGED_IN_USER_ID = 'current-user'

    const profile = buildProfile({
      overrides: {
        id: 'not-current-user',
        givenName: 'John',
        familyName: 'Doe',
      },
    })

    const course = buildCourse({
      overrides: { trainers: [buildCourseTrainer({ overrides: { profile } })] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: { profile: { id: LOGGED_IN_USER_ID } },
    })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('(Lead)')).toBeInTheDocument()
  })

  it('displays correct trainer info if a logged in user is a trainer', () => {
    const LOGGED_IN_USER_ID = 'current-user'

    const profile = buildProfile({ overrides: { id: LOGGED_IN_USER_ID } })

    const course = buildCourse({
      overrides: { trainers: [buildCourseTrainer({ overrides: { profile } })] },
    })

    render(<CourseHeroSummary course={course} />, {
      auth: { profile: { id: LOGGED_IN_USER_ID } },
    })

    expect(
      screen.getByText(t('pages.course-participants.trainer')),
    ).toBeInTheDocument()
  })

  it('displays course venue information', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByTestId('course-venue')).toHaveTextContent(
      `${course.schedule[0].venue?.name}, ${course.schedule[0].venue?.addressLineOne}, ${course.schedule[0].venue?.city}, ${course.schedule[0].venue?.postCode}, ${course.schedule[0].venue?.country}`,
    )
  })

  it('displays org information', () => {
    const course = buildCourse({
      overrides: {
        organization: buildOrganization({
          overrides: {
            name: 'London First School',
          },
        }),
      },
    })

    render(<CourseHeroSummary course={course} />)

    expect(
      screen.getByText(
        t('pages.course-participants.company-host', {
          companyName: 'London First School',
        }),
      ),
    ).toBeInTheDocument()
  })

  it('displays Virtual if course is online', () => {
    const course = buildCourse({
      overrides: {
        deliveryType: Course_Delivery_Type_Enum.Virtual,
      },
    })

    render(<CourseHeroSummary course={course} />)

    expect(screen.getByText('Virtual')).toBeInTheDocument()
  })

  it('displays booking contact data in case of exisitng user for external user', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })

    expect(
      screen.getByText(t('components.course-form.contact-person-label'), {
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.bookingContact?.email as string),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.bookingContact?.fullName as string),
    ).toBeInTheDocument()
  })

  it('displays booking contact data in case of exisitng user for internal user', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    expect(
      screen.getByText(t('components.course-form.contact-person-label'), {
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.bookingContact?.email as string),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.bookingContact?.fullName as string),
    ).toBeInTheDocument()
  })

  it('displays booking contact data in case of non exisitng user', () => {
    const inviteData = {
      email: chance.email(),
      firstName: chance.name(),
      lastName: chance.name(),
    }

    const course = buildCourse({
      overrides: {
        bookingContactInviteData: inviteData,
      },
    })
    course.bookingContact = undefined

    render(<CourseHeroSummary course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    expect(
      screen.getByText(t('components.course-form.contact-person-label'), {
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(screen.getByText(inviteData.email)).toBeInTheDocument()

    expect(
      screen.getByText(`${inviteData.firstName} ${inviteData.lastName}`),
    ).toBeInTheDocument()
  })

  it('displays orgnisation key contact data in case of exisitng user for internal user', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    expect(
      screen.getByText(
        t('components.course-form.organization-key-contact-label'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.organizationKeyContact?.email as string),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.organizationKeyContact?.fullName as string),
    ).toBeInTheDocument()

    expect(
      screen
        .getByText(course.organizationKeyContact?.fullName as string)
        .closest('a'),
    ).not.toBeNull()
  })

  it('displays orgnisation key contact data in case of exisitng user for external user', () => {
    const course = buildCourse()

    render(<CourseHeroSummary course={course} />, {
      auth: { activeRole: RoleName.TRAINER },
    })

    expect(
      screen.getByText(
        t('components.course-form.organization-key-contact-label'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.organizationKeyContact?.email as string),
    ).toBeInTheDocument()

    expect(
      screen.getByText(course.organizationKeyContact?.fullName as string),
    ).toBeInTheDocument()
  })

  it('displays orgnisation key contact data in case of non exisitng user', () => {
    const inviteData = {
      email: chance.email(),
      firstName: chance.name(),
      lastName: chance.name(),
    }

    const course = buildCourse({
      overrides: {
        organizationKeyContactInviteData: inviteData,
      },
    })
    course.organizationKeyContact = undefined

    render(<CourseHeroSummary course={course} />, {
      auth: { activeRole: RoleName.TT_ADMIN },
    })

    expect(
      screen.getByText(
        t('components.course-form.organization-key-contact-label'),
        {
          exact: false,
        },
      ),
    ).toBeInTheDocument()

    expect(screen.getByText(inviteData.email)).toBeInTheDocument()

    expect(
      screen.getByText(`${inviteData.firstName} ${inviteData.lastName}`),
    ).toBeInTheDocument()
  })

  describe('Slots', () => {
    it('should render BackButton slot', () => {
      const course = buildCourse({
        overrides: {},
      })

      render(
        <CourseHeroSummary
          course={course}
          slots={{
            BackButton: () => (
              <button data-testid="back-button">Back Button</button>
            ),
          }}
        />,
      )

      expect(screen.getByTestId('back-button')).toBeInTheDocument()
    })

    it('should render EditButton slot', () => {
      const course = buildCourse({
        overrides: {},
      })

      render(
        <CourseHeroSummary
          course={course}
          slots={{
            EditButton: () => (
              <button data-testid="edit-button">Edit Button</button>
            ),
          }}
        />,
      )

      expect(screen.getByTestId('edit-button')).toBeInTheDocument()
    })

    it('should render OrderItem slot', () => {
      const course = buildCourse({
        overrides: {},
      })

      render(
        <CourseHeroSummary
          course={course}
          slots={{
            OrderItem: () => <div>Order: TT-123</div>,
          }}
        />,
      )

      expect(screen.getByTestId('order-item')).toBeInTheDocument()
    })
  })
})
