import { Accreditors_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { chance, render, screen, userEvent } from '@test/index'

import { CourseActionsMenu } from './CourseActionsMenu'

describe(CourseActionsMenu.name, () => {
  const defaultOrganizations = [
    {
      organization: {
        id: chance.guid(),
      },
    },
  ]

  it('displays correct options for an admin user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
    expect(screen.getByText(/resend course information/i)).toBeInTheDocument()
  })

  it('renders correct options for an ops user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
    expect(screen.getByText(/resend course information/i)).toBeInTheDocument()
  })

  it('renders correct options for a sales admin user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_ADMIN,
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
    expect(screen.getByText(/resend course information/i)).toBeInTheDocument()
  })

  it('renders correct options for a sales representative user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_REPRESENTATIVE,
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.queryByText(/transfer/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/resend course information/i)
    ).not.toBeInTheDocument()
  })

  it('displays correct options for a trainer user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TRAINER,
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))
    expect(screen.getByText(/resend course information/i)).toBeInTheDocument()
  })

  it('renders correct options for an org admin user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [defaultOrganizations[0].organization.id],
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/resend course information/i)
    ).not.toBeInTheDocument()
  })

  it('does not render correct options for an org admin of another org', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [chance.guid()],
        },
      }
    )

    expect(screen.queryByText(/manage attendance/i)).not.toBeInTheDocument()
  })

  it('renders correct options for an org admin user for BILD course', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Bild },
          profile: {
            organizations: defaultOrganizations,
          },
        }}
        onRemoveClick={vi.fn()}
        onReplaceClick={vi.fn()}
        onTransferClick={vi.fn()}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
          managedOrgIds: [defaultOrganizations[0].organization.id],
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.queryByText(/replace/i)).not.toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
    expect(
      screen.queryByText(/resend course information/i)
    ).not.toBeInTheDocument()
  })

  it('calls correct callbacks when clicked on an option', async () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    }
    const onRemoveMock = vi.fn()
    const onReplaceMock = vi.fn()
    const onTransferMock = vi.fn()
    const onResendCourseInformationMock = vi.fn()

    render(
      <CourseActionsMenu
        item={actionableItem}
        onRemoveClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
        onResendCourseInformationClick={onResendCourseInformationMock}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    await userEvent.click(screen.getByText(/manage attendance/i))

    await userEvent.click(screen.getByText(/remove/i))
    expect(onRemoveMock).toHaveBeenCalledTimes(1)
    expect(onRemoveMock).toHaveBeenCalledWith(actionableItem)

    await userEvent.click(screen.getByText(/manage attendance/i))

    await userEvent.click(screen.getByText(/replace/i))
    expect(onReplaceMock).toHaveBeenCalledTimes(1)
    expect(onReplaceMock).toHaveBeenCalledWith(actionableItem)

    await userEvent.click(screen.getByText(/manage attendance/i))

    await userEvent.click(screen.getByText(/transfer/i))
    expect(onTransferMock).toHaveBeenCalledTimes(1)
    expect(onTransferMock).toHaveBeenCalledWith(actionableItem)

    await userEvent.click(screen.getByText(/manage attendance/i))

    await userEvent.click(screen.getByText(/resend course information/i))
    expect(onResendCourseInformationMock).toHaveBeenCalledTimes(1)
    expect(onResendCourseInformationMock).toHaveBeenCalledWith(actionableItem)
  })

  it("doesn't display anything if a user doesn't have a permission to manage attendance", () => {
    const actionableItem = {
      id: chance.guid(),
      course: { accreditedBy: Accreditors_Enum.Icm },
      profile: {
        organizations: defaultOrganizations,
      },
    }
    const onRemoveMock = vi.fn()
    const onReplaceMock = vi.fn()
    const onTransferMock = vi.fn()

    render(
      <CourseActionsMenu
        item={actionableItem}
        onRemoveClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
        onResendCourseInformationClick={vi.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
        },
      }
    )

    expect(screen.queryByText(/manage attendance/i)).not.toBeInTheDocument()
  })
})
