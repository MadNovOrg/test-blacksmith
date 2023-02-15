import React from 'react'

import { RoleName } from '@app/types'

import { render, chance, screen, userEvent } from '@test/index'

import { CourseActionsMenu } from '.'

describe('component: CourseActionsMenu', () => {
  it('displays correct options for an admin user', () => {
    render(
      <CourseActionsMenu
        item={{ id: chance.guid() }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
  })

  it('renders correct options for an ops user', () => {
    render(
      <CourseActionsMenu
        item={{ id: chance.guid() }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.TT_OPS,
        },
      }
    )

    userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
  })

  it('renders correct options for a sales admin user', () => {
    render(
      <CourseActionsMenu
        item={{ id: chance.guid() }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_ADMIN,
        },
      }
    )

    userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
  })

  it('renders correct options for a sales representative user', () => {
    render(
      <CourseActionsMenu
        item={{ id: chance.guid() }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.SALES_REPRESENTATIVE,
        },
      }
    )

    userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.queryByText(/remove/i)).not.toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.queryByText(/transfer/i)).not.toBeInTheDocument()
  })

  it('renders correct options for an org admin user', () => {
    render(
      <CourseActionsMenu
        item={{ id: chance.guid() }}
        onRemoveClick={jest.fn()}
        onReplaceClick={jest.fn()}
        onTransferClick={jest.fn()}
      />,
      {
        auth: {
          activeRole: RoleName.USER,
          isOrgAdmin: true,
        },
      }
    )

    userEvent.click(screen.getByText(/manage attendance/i))

    expect(screen.getByText(/remove/i)).toBeInTheDocument()
    expect(screen.getByText(/replace/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer/i)).toBeInTheDocument()
  })

  it('calls correct callbacks when clicked on an option', () => {
    const actionableItem = { id: chance.guid() }
    const onRemoveMock = jest.fn()
    const onReplaceMock = jest.fn()
    const onTransferMock = jest.fn()

    render(
      <CourseActionsMenu
        item={actionableItem}
        onRemoveClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
      />,
      {
        auth: {
          activeRole: RoleName.TT_ADMIN,
        },
      }
    )

    userEvent.click(screen.getByText(/manage attendance/i))

    userEvent.click(screen.getByText(/remove/i))
    expect(onRemoveMock).toHaveBeenCalledTimes(1)
    expect(onRemoveMock).toHaveBeenCalledWith(actionableItem)

    userEvent.click(screen.getByText(/replace/i))
    expect(onReplaceMock).toHaveBeenCalledTimes(1)
    expect(onReplaceMock).toHaveBeenCalledWith(actionableItem)

    userEvent.click(screen.getByText(/transfer/i))
    expect(onTransferMock).toHaveBeenCalledTimes(1)
    expect(onTransferMock).toHaveBeenCalledWith(actionableItem)
  })

  it("doesn't display anything if a user doesn't have a permission to manage attendance", () => {
    const actionableItem = { id: chance.guid() }
    const onRemoveMock = jest.fn()
    const onReplaceMock = jest.fn()
    const onTransferMock = jest.fn()

    render(
      <CourseActionsMenu
        item={actionableItem}
        onRemoveClick={onRemoveMock}
        onReplaceClick={onReplaceMock}
        onTransferClick={onTransferMock}
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
