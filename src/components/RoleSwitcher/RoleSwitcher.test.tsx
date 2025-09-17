import React from 'react'
import { getI18n } from 'react-i18next'

import { RoleName } from '@app/types'

import { _render, screen, userEvent, waitFor } from '@test/index'

import { RoleSwitcher } from './RoleSwitcher'

const { t } = getI18n()
const RoleUserLabel = t(`components.role-switcher.${RoleName.USER}`)
const RoleTrainerLabel = t(`components.role-switcher.${RoleName.TRAINER}`)

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual('react-router-dom')) as object),
  useNavigate: () => mockNavigate,
}))

describe('component: RoleSwitcher', () => {
  it('renders as expected', async () => {
    const activeRole = RoleName.TRAINER
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    _render(<RoleSwitcher />, { auth: { allowedRoles, activeRole } })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')

    expect(roleSwitcherBtn).toHaveTextContent(RoleTrainerLabel)
  })

  it('shows list when clicked', async () => {
    const activeRole = RoleName.TRAINER
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    _render(<RoleSwitcher />, { auth: { allowedRoles, activeRole } })

    expect(screen.queryByTestId('RoleSwitcher-list')).toBeNull() // list not shown

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const roleSwitcherRoles = screen.getAllByTestId('RoleSwitcher-otherRole')
    expect(roleSwitcherRoles).toHaveLength(1)
    expect(roleSwitcherRoles[0]).toHaveTextContent(RoleUserLabel)
  })

  it('changes role when click another role', async () => {
    const activeRole = RoleName.TRAINER
    const allowedRoles = new Set([RoleName.USER, RoleName.TRAINER])

    const { context } = _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([]),
        isOrgAdmin: false,
      },
    })
    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const roleSwitcherRoles = screen.getAllByTestId('RoleSwitcher-otherRole')
    await userEvent.click(roleSwitcherRoles[0])

    expect(context.auth.changeRole).toHaveBeenCalledWith(RoleName.USER)

    await waitFor(() => {
      expect(screen.queryByTestId('RoleSwitcher-list')).not.toBeInTheDocument()
    })
  })

  it('returns null if user has only one role', async () => {
    const activeRole = RoleName.USER
    const allowedRoles = new Set([RoleName.USER])

    _render(<RoleSwitcher />, { auth: { allowedRoles, activeRole } })

    expect(screen.queryByTestId('RoleSwitcher-btn')).not.toBeInTheDocument()
  })

  it('show only individual on none individual roles present', async () => {
    const activeRole = RoleName.TT_ADMIN
    const allowedRoles = new Set([
      RoleName.FINANCE,
      RoleName.LD,
      RoleName.SALES_ADMIN,
      RoleName.SALES_REPRESENTATIVE,
      RoleName.TRAINER,
      RoleName.TT_ADMIN,
      RoleName.TT_OPS,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([]),
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.queryByTestId(
      'RoleSwitcher-individual-arrow',
    )

    expect(individualRolePicker).not.toBeInTheDocument()
  })

  it('show only individual on only one (booking contact) individual roles present', async () => {
    const activeRole = RoleName.TT_ADMIN
    const allowedRoles = new Set([
      RoleName.BOOKING_CONTACT,
      RoleName.FINANCE,
      RoleName.LD,
      RoleName.SALES_ADMIN,
      RoleName.SALES_REPRESENTATIVE,
      RoleName.TRAINER,
      RoleName.TT_ADMIN,
      RoleName.TT_OPS,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([RoleName.BOOKING_CONTACT]),
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.queryByTestId(
      'RoleSwitcher-individual-arrow',
    )

    expect(individualRolePicker).not.toBeInTheDocument()
  })

  it('show arrow button on present more that one individual role', async () => {
    const activeRole = RoleName.TT_ADMIN
    const allowedRoles = new Set([
      RoleName.BOOKING_CONTACT,
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.TRAINER,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([RoleName.BOOKING_CONTACT, RoleName.ORGANIZATION_KEY_CONTACT]),
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.getByTestId(
      'RoleSwitcher-individual-arrow',
    )
    expect(individualRolePicker).toBeInTheDocument()
  })

  it('show arrow button on present more that one individual role, one of them is org admin', async () => {
    const activeRole = RoleName.USER
    const allowedRoles = new Set([
      RoleName.BOOKING_CONTACT,
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.TRAINER,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([RoleName.BOOKING_CONTACT]),
        isOrgAdmin: true,
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.getByTestId(
      'RoleSwitcher-individual-arrow',
    )
    expect(individualRolePicker).toBeInTheDocument()
  })

  it('show individual role picker with booking contact role and org admin property presented', async () => {
    const activeRole = RoleName.USER
    const allowedRoles = new Set([
      RoleName.BOOKING_CONTACT,
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.TRAINER,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([RoleName.BOOKING_CONTACT]),
        isOrgAdmin: true,
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.getByTestId(
      'RoleSwitcher-individual-arrow',
    )
    expect(individualRolePicker).toBeInTheDocument()

    await userEvent.click(individualRolePicker)

    const individualRoleMenu = screen.getByTestId(
      'RoleSwitcher-list-individual',
    )
    const bookingContactMenuOption = screen.queryByTestId(
      'Individual-role-booking-contact',
    )
    const organisationAdminMenuOption = screen.queryByTestId(
      'Individual-role-organisation-admin',
    )

    expect(individualRoleMenu).toBeInTheDocument()
    expect(bookingContactMenuOption).toBeInTheDocument()
    expect(organisationAdminMenuOption).not.toBeInTheDocument()
  })

  it('show individual role picker for multiple individual roles, but not org admin', async () => {
    const activeRole = RoleName.TT_ADMIN
    const allowedRoles = new Set([
      RoleName.BOOKING_CONTACT,
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.TRAINER,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<
          RoleName.BOOKING_CONTACT | RoleName.ORGANIZATION_KEY_CONTACT
        >([RoleName.BOOKING_CONTACT, RoleName.ORGANIZATION_KEY_CONTACT]),
        isOrgAdmin: false,
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.getByTestId(
      'RoleSwitcher-individual-arrow',
    )
    expect(individualRolePicker).toBeInTheDocument()

    await userEvent.click(individualRolePicker)

    const individualRoleMenu = screen.getByTestId(
      'RoleSwitcher-list-individual',
    )
    const bookingContactMenuOption = screen.queryByTestId(
      'Individual-role-booking-contact',
    )
    const orgKeyContactContactMenuOption = screen.queryByTestId(
      'Individual-role-organization-key-contact',
    )
    const organisationAdminMenuOption = screen.queryByTestId(
      'Individual-role-organisation-admin',
    )

    expect(individualRoleMenu).toBeInTheDocument()
    expect(bookingContactMenuOption).toBeInTheDocument()
    expect(orgKeyContactContactMenuOption).toBeInTheDocument()
    expect(organisationAdminMenuOption).not.toBeInTheDocument()
  })

  it('show individual role picker for org admin and one individual sub role', async () => {
    const activeRole = RoleName.ORGANIZATION_KEY_CONTACT
    const allowedRoles = new Set([
      RoleName.ORGANIZATION_KEY_CONTACT,
      RoleName.USER,
    ])

    _render(<RoleSwitcher />, {
      auth: {
        allowedRoles,
        activeRole,
        individualAllowedRoles: new Set<RoleName.ORGANIZATION_KEY_CONTACT>([
          RoleName.ORGANIZATION_KEY_CONTACT,
        ]),
        isOrgAdmin: true,
      },
    })

    const roleSwitcherBtn = screen.getByTestId('RoleSwitcher-btn')
    expect(roleSwitcherBtn).toBeInTheDocument()

    await userEvent.click(roleSwitcherBtn)

    const individualRolePicker = screen.getByTestId(
      'RoleSwitcher-individual-arrow',
    )

    expect(individualRolePicker).toBeInTheDocument()
  })
})
