import { addDays, subDays } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Accreditors_Enum } from '@app/generated/graphql'
import { CourseParticipant, CourseType, RoleName } from '@app/types'

import {
  chance,
  render,
  renderHook,
  screen,
  userEvent,
  within,
} from '@test/index'
import { buildCourse, buildCourseSchedule } from '@test/mock-data-utils'

import { ManageAttendanceMenu } from './ManageAttendanceMenu'

describe(ManageAttendanceMenu.name, () => {
  const defaultOrganizations = [
    {
      organization: {
        id: chance.guid(),
      },
    },
  ]

  const { result } = renderHook(() => useTranslation())
  const {
    current: { t },
  } = result

  it('displays correct options for an admin user, OPEN course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.getByText(t('common.replace'))).toBeInTheDocument()
    expect(screen.getByText(t('common.transfer'))).toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('displays correct options for an admin user, CLOSED course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({ overrides: { type: CourseType.CLOSED } })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('displays correct options for an admin user, INDIRECT course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for an ops user, OPEN course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.getByText(t('common.replace'))).toBeInTheDocument()
    expect(screen.getByText(t('common.transfer'))).toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for an ops user, CLOSED course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for an ops user, INDIRECT course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.INDIRECT,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for a sales admin user, OPEN course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.getByText(t('common.replace'))).toBeInTheDocument()
    expect(screen.getByText(t('common.transfer'))).toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for a sales admin user, CLOSED course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.CLOSED,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for a sales admin user, INDIRECT course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.INDIRECT,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for a sales representative user, OPEN course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_REPRESENTATIVE,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.queryByText(t('common.cancel'))).not.toBeInTheDocument()
    expect(screen.getByText(t('common.replace'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.queryByText(t('common.resend-course-information'))
    ).not.toBeInTheDocument()
  })

  it('renders correct options for a sales representative user, CLOSED course type', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({ overrides: { type: CourseType.CLOSED } })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_REPRESENTATIVE,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.queryByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.queryByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('displays correct options for a trainer user', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )
    expect(
      screen.getByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('renders correct options for an org admin user', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse()

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [defaultOrganizations[0].organization.id],
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.queryByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('does not render correct options for an org admin of another org', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse()

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [chance.guid()],
        },
      }
    )

    expect(
      screen.queryByText(t('pages.course-participants.manage-attendance'))
    ).not.toBeInTheDocument()
  })

  it('renders correct options for an org admin user for BILD course', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Bild },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse()

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [defaultOrganizations[0].organization.id],
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    expect(screen.getByText(t('common.cancel'))).toBeInTheDocument()
    expect(screen.queryByText(t('common.replace'))).not.toBeInTheDocument()
    expect(screen.queryByText(t('common.transfer'))).not.toBeInTheDocument()
    expect(
      screen.queryByText(t('common.resend-course-information'))
    ).toBeInTheDocument()
  })

  it('calls correct callbacks when clicked on an option', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: { end: addDays(new Date(), 1).toISOString() },
          }),
        ],
      },
    })
    const onRemoveMock = vi.fn()
    const onReplaceMock = vi.fn()
    const onTransferMock = vi.fn()
    const onResendCourseInformationMock = vi.fn()

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
        onResendInformationClick={onResendCourseInformationMock}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    await userEvent.click(screen.getByText(t('common.cancel')))
    expect(onRemoveMock).toHaveBeenCalledTimes(1)
    expect(onRemoveMock).toHaveBeenCalledWith(actionableItem)

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    await userEvent.click(screen.getByText(t('common.replace')))
    expect(onReplaceMock).toHaveBeenCalledTimes(1)
    expect(onReplaceMock).toHaveBeenCalledWith(actionableItem)

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    await userEvent.click(screen.getByText(t('common.transfer')))
    expect(onTransferMock).toHaveBeenCalledTimes(1)
    expect(onTransferMock).toHaveBeenCalledWith(actionableItem)

    await userEvent.click(
      screen.getByText(t('pages.course-participants.manage-attendance'))
    )

    await userEvent.click(
      screen.getByText(t('common.resend-course-information'))
    )
    expect(onResendCourseInformationMock).toHaveBeenCalledTimes(1)
    expect(onResendCourseInformationMock).toHaveBeenCalledWith(actionableItem)
  })

  it('displays only transfer and cancel options if a course has ended', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Bild },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse({
      overrides: {
        type: CourseType.OPEN,
        schedule: [
          buildCourseSchedule({
            overrides: {
              end: subDays(new Date(), 1).toISOString(),
              start: subDays(new Date(), 2).toISOString(),
            },
          }),
        ],
      },
    })

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(
      screen.getByRole('button', { name: /manage attendance/i })
    )

    const actionsMenu = screen.getByRole('menu')

    expect(
      within(actionsMenu).getByRole('menuitem', { name: /cancel/i })
    ).toBeInTheDocument()

    expect(
      within(actionsMenu).getByRole('menuitem', { name: /transfer/i })
    ).toBeInTheDocument()

    expect(
      within(actionsMenu).queryByRole('menuitem', {
        name: /resent course instructions/i,
      })
    ).not.toBeInTheDocument()

    expect(
      within(actionsMenu).queryByRole('button', { name: /replace/i })
    ).not.toBeInTheDocument()
  })

  it("doesn't display anything if a user doesn't have a permission to manage attendance", () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    } as CourseParticipant
    const course = buildCourse()
    const onRemoveMock = vi.fn()
    const onReplaceMock = vi.fn()
    const onTransferMock = vi.fn()

    render(
      <ManageAttendanceMenu
        course={course}
        courseParticipant={actionableItem}
        onCancelClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
        onResendInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      }
    )

    expect(
      screen.queryByText(t('pages.course-participants.manage-attendance'))
    ).not.toBeInTheDocument()
  })
})
