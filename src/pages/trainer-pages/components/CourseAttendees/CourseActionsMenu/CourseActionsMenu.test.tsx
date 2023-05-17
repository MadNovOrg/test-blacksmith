import React from 'react'

import { Accreditors_Enum } from '@app/generated/graphql'
import { RoleName } from '@app/types'

import { render, chance, screen, userEvent } from '@test/index'

import { CourseActionsMenu } from '.'

describe('component: CourseActionsMenu', () => {
  it('displays correct options for an admin user', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Icm },
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
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
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
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
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
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
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
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
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
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
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
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

  it('renders correct options for an org admin user for BILD course', async () => {
    render(
      <CourseActionsMenu
        item={{
          id: chance.guid(),
          course: { accreditedBy: Accreditors_Enum.Bild },
        }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
        onResendCourseInformationClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
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
    }
    const onRemoveMock = jest.fn()
    const onReplaceMock = jest.fn()
    const onTransferMock = jest.fn()
    const onResendCourseInformationMock = jest.fn()

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
    }
    const onRemoveMock = jest.fn()
    const onReplaceMock = jest.fn()
    const onTransferMock = jest.fn()

    render(
      <CourseActionsMenu
        item={actionableItem}
        onRemoveClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
        onResendCourseInformationClick={jest.fn()}
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
